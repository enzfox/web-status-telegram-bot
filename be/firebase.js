import admin from "firebase-admin";

import serviceAccount from "./firebase-auth.json" assert { type: "json" };

// Initialize Firebase Admin SDK with service account credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Create a Firestore instance
export const db = admin.firestore();

let configData = {};

// Function to fetch configuration data from Firestore
export async function fetchConfig() {
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

// Function to get the configuration data
export function getConfigData() {
  return configData;
}

