import * as admin from "firebase-admin";
import serviceAccount from "../firebase-auth.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

interface ConfigData {
  [key: string]: any;
}

let configData: FirebaseFirestore.DocumentData | undefined = {};

export const db = admin.firestore();

export async function fetchConfig(): Promise<void> {
  try {
    const configDocRef = db.doc("config/configId");
    const configDocSnapshot = await configDocRef.get();

    if (configDocSnapshot.exists) {
      configData = configDocSnapshot.data();
    }
  } catch (error) {
    console.error("Failed to fetch config:", error);
  }
}

export function getConfigData(): ConfigData {
  return <ConfigData>configData;
}
