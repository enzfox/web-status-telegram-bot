import get from "axios";
import { db } from "./firebase.js";
import admin from "firebase-admin";

async function getWebsitesFromFirestore() {
  const websitesCollection = db.collection("websites");
  const websitesSnapshot = await websitesCollection
    .where("status", "==", true)
    .get();

  const websites = [];

  websitesSnapshot.forEach((websiteDoc) => {
    websites.push({
      id: websiteDoc.id,
      ...websiteDoc.data(),
    });
  });

  return websites;
}

async function checkWebsiteStatus(url, websiteId) {
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

async function updateWebsiteStatus(websiteId, data) {
  const websiteDocRef = db.doc(`websites/${websiteId}`);

  try {
    await websiteDocRef.update(data);
  } catch (error) {
    console.error("Failed to update website status:", error);
  }
}

async function updateHistoryStatus(websiteId, downTime) {
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
