import * as admin from "firebase-admin";
import serviceAccount from "../firebase-auth.json";

interface ConfigData {
  [key: string]: any;
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export class FirebaseService {
  public db = admin.firestore();
  private configData: ConfigData | undefined;

  private static instance = new FirebaseService();

  private constructor() {}

  public static getInstance(): FirebaseService {
    return FirebaseService.instance;
  }

  async fetchConfig(): Promise<void> {
    try {
      const configDocSnapshot = await this.db.doc("config/configId").get();

      if (configDocSnapshot.exists) {
        this.configData = configDocSnapshot.data();
      }
    } catch (error) {
      console.error("Failed to fetch config:", error);
    }
  }

  async getConfigData(): Promise<ConfigData> {
    await this.fetchConfig();
    return this.configData || {};
  }
}
