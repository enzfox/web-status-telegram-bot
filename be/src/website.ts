import get from "axios";
import { db } from "./firebase";
import * as admin from "firebase-admin";

export interface WebsiteData {
  id?: string;
  website: string;
  isUp: boolean;
  lastNotification: Date | null;
  downSince: Date | null;
  interval: NodeJS.Timeout | null;

  [key: string]: any;
}

async function getWebsitesFromFirestore(): Promise<WebsiteData[]> {
  const websitesCollection = db.collection("websites");
  const websitesSnapshot = await websitesCollection
    .where("status", "==", true)
    .get();

  const websites: WebsiteData[] = [];

  websitesSnapshot.forEach((websiteDoc) => {
    websites.push({
      id: websiteDoc.id,
      ...(websiteDoc.data() as WebsiteData),
    });
  });

  return websites;
}

async function checkWebsiteStatus(
  url: string,
  websiteId: string,
): Promise<boolean> {
  try {
    const response = await get(url);
    const isUp = response.status === 200;

    // Update Firestore with the website status
    await updateWebsiteStatus(websiteId, { isUp: isUp });

    return isUp;
  } catch (error) {
    // Handle errors and update Firestore with the website status
    await updateWebsiteStatus(websiteId, { isUp: false });
    return false;
  }
}

async function updateWebsiteStatus(
  websiteId: string,
  data: any,
): Promise<void> {
  const websiteDocRef = db.doc(`websites/${websiteId}`);

  try {
    await websiteDocRef.update(data);
  } catch (error) {
    console.error("Failed to update website status:", error);
  }
}

async function updateHistoryStatus(
  websiteId: string,
  downTime: number,
): Promise<void> {
  const websiteDocRef = db.doc(`websites/${websiteId}`);

  try {
    await websiteDocRef.update({
      history: admin.firestore.FieldValue.arrayUnion({
        date: new Date(),
        downTime: downTime,
      }),
    });
  } catch (error) {
    console.error("Failed to update website status:", error);
  }
}

export {
  getWebsitesFromFirestore,
  checkWebsiteStatus,
  updateWebsiteStatus,
  updateHistoryStatus,
};
