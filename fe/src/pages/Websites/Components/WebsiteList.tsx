import { db } from "../../../utils/Firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "@firebase/firestore";
import { useEffect, useState } from "react";
import { WebsiteInterface } from "../../../interfaces/WebsiteInterface";
import WebsiteForm from "../../../pages/Websites/Components/WebsiteForm";
import WebsiteHistory from "./WebsiteHistory.tsx";
import WebsiteCard from "./WebsiteCard.tsx";

export default function WebsiteList({
  refetch: initialRefetch,
}: {
  refetch: boolean;
}) {
  const [websites, setWebsites] = useState<WebsiteInterface[]>([]);

  const [showFormModal, setShowFormModal] = useState(false);

  const [refetch, setRefetch] = useState<boolean>(false);

  const [selectedFormWebsite, setSelectedFormWebsite] = useState<
    WebsiteInterface | undefined
  >(undefined);

  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const [selectedHistoryWebsite, setSelectedHistoryWebsite] = useState<
    WebsiteInterface | undefined
  >(undefined);

  const openHistoryModal = (website: WebsiteInterface) => {
    setSelectedHistoryWebsite(website);
    setShowHistoryModal(true);
  };

  const closeHistoryModal = () => {
    setShowHistoryModal(false);
  };

  const closeFormModal = () => {
    setShowFormModal(false);

    setRefetch(true);
  };

  function editWebsite(website: WebsiteInterface) {
    setSelectedFormWebsite(website);
    setShowFormModal(true);
  }

  async function deleteWebsite(website: WebsiteInterface) {
    if (confirm(`Are you sure you want to delete ${website.name}?`)) {
      try {
        // Reference the document to delete
        const websiteDocRef = doc(db, "websites", website.id);

        // Delete the document
        await deleteDoc(websiteDocRef);

        // Remove the website from the state
        setWebsites((prevWebsites) =>
          prevWebsites.filter((w) => w.id !== website.id),
        );
      } catch (error) {
        console.error("Error deleting website:", error);
      }
    }
  }

  async function fetchWebsites() {
    const querySnapshot = await getDocs(
      query(collection(db, "websites"), orderBy("name", "asc")),
    );
    const websiteData = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as WebsiteInterface,
    );
    setWebsites(websiteData);
  }

  useEffect(() => {
    fetchWebsites().then();

    if (refetch || initialRefetch) {
      fetchWebsites().then(() => {
        setRefetch(false);
      });
    }
  }, [refetch, initialRefetch]);

  return (
    <>
      <div className="row animate-fadeIn">
        <div className="col-12">
          {websites.map((website) => (
            <WebsiteCard
              key={website.id}
              website={website}
              openHistoryModal={openHistoryModal}
              editWebsite={editWebsite}
              deleteWebsite={deleteWebsite}
            />
          ))}
        </div>
      </div>

      {showFormModal && (
        <WebsiteForm
          closeModal={closeFormModal}
          website={selectedFormWebsite}
        />
      )}

      {showHistoryModal && (
        <WebsiteHistory
          closeModal={closeHistoryModal}
          website={selectedHistoryWebsite}
        />
      )}
    </>
  );
}
