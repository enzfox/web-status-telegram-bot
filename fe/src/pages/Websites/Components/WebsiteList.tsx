// Import necessary modules
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
import { Card } from "primereact/card";
import { WebsiteInterface } from "../../../interfaces/WebsiteInterface";
import { Button } from "primereact/button";
import WebsiteForm from "../../../pages/Websites/Components/WebsiteForm";

export default function WebsiteList({
  refetch: initialRefetch,
}: {
  refetch: boolean;
}) {
  const [websites, setWebsites] = useState<WebsiteInterface[]>([]);

  const [showModal, setShowModal] = useState(false);

  const [refetch, setRefetch] = useState<boolean>(initialRefetch);

  const [selectedWebsite, setSelectedWebsite] = useState<
    WebsiteInterface | undefined
  >(undefined);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);

    setRefetch(true);
  };

  function getLastDownTime(website: WebsiteInterface) {
    const lastDownIndex = website.history?.length - 1;

    return lastDownIndex > 0
      ? new Date(
          website.history[lastDownIndex].date.seconds * 1000,
        ).toLocaleString()
      : " - ";
  }

  function getTotalDownTime(website: WebsiteInterface) {
    const totalDownTime = website.history?.reduce((acc, curr) => {
      return acc + curr.downTime;
    }, 0);

    return totalDownTime ? Math.floor(totalDownTime / 60) + " minutes" : " - ";
  }

  function editWebsite(website: WebsiteInterface) {
    setSelectedWebsite(website);
    openModal();
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
      fetchWebsites().then();
    }
  }, [refetch, initialRefetch]);

  return (
    <>
      <div className="row animate-fadeIn">
        <div className="col-12">
          {websites.map((website) => (
            <div
              key={website.id}
              className="p-col-12 p-md-6 p-lg-4 md:max-w-[800px] mx-auto"
            >
              <Card
                title={website.name}
                className="bg-violet-500 dark:bg-indigo-600 animate-fadeIn transition-colors duration-300 mb-5"
              >
                <div className="text-end">
                  <Button
                    icon="pi pi-pencil"
                    className="mx-1"
                    onClick={() => editWebsite(website)}
                  />

                  <Button
                    icon="pi pi-trash"
                    onClick={() => deleteWebsite(website)}
                  />
                </div>

                <a
                  href={website.website}
                  rel="noopener nofollow"
                  target="_blank"
                >
                  <b>{website.website}</b>
                </a>

                <div className="flex justify-between items-center mt-3">
                  <div>
                    <span className="">Last Downtime</span>
                  </div>
                  <div>
                    <span className="">{getLastDownTime(website)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <div>
                    <span className="">Total Downtime</span>
                  </div>

                  <div>
                    <span className="">{getTotalDownTime(website)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <div>
                    <span className="">Status</span>
                  </div>

                  <div>
                    <span className="">{website.status ? "Up" : "Down"}</span>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <WebsiteForm
        showModal={showModal}
        closeModal={closeModal}
        website={selectedWebsite}
      />
    </>
  );
}
