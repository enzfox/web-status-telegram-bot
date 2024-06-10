import { WebsiteData } from "./WebsiteService";
import { FirebaseService } from "./FirebaseService";
import { firestore } from "firebase-admin";

export class WebsiteRepository {
  private firebaseService = FirebaseService.getInstance();

  async getWebsites(): Promise<WebsiteData[]> {
    const websitesSnapshot = await this.firebaseService.db
      .collection("websites")
      .where("status", "==", true)
      .get();

    return websitesSnapshot.docs.map((websiteDoc) => ({
      id: websiteDoc.id,
      ...(websiteDoc.data() as WebsiteData),
    }));
  }

  async updateWebsite(websiteData: WebsiteData) {
    // Can't store the interval in Firestore
    websiteData.interval = null;

    try {
      await this.firebaseService.db
        .doc(`websites/${websiteData.id}`)
        .update(websiteData);
    } catch (error) {
      console.error("Failed to update website status:", error);
    }
  }

  async updateWebsiteStatus(websiteData: WebsiteData, downTime: number) {
    try {
      websiteData.history = websiteData.history || [];
      websiteData.history.push({
        date: new Date(),
        downTime: downTime,
      });

      await this.firebaseService.db.doc(`websites/${websiteData.id}`).update({
        history: firestore.FieldValue.arrayUnion({
          date: new Date(),
          downTime: downTime,
        }),
      });
    } catch (error) {
      console.error("Failed to update website status:", error);
    }
  }
}
