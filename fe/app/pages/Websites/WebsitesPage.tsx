"use client";

import withAuth from "@/app/hooks/withAuth";
import { PageTitle } from "@/app/components/Page/PageTitle";
import { Button } from "primereact/button";
import { useState } from "react";
import WebsiteForm from "@/app/pages/Websites/Components/WebsiteForm";
import WebsitesList from "@/app/pages/Websites/Components/WebsitesList";

function Websites() {
  const [showModal, setShowModal] = useState(false);
  const [shouldRefetchList, setShouldRefetchList] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);

    // Refetch the list of websites
    setShouldRefetchList(true);

    // Reset the refetch state
    setTimeout(() => {
      setShouldRefetchList(false);
    }, 1000);
  };

  return (
    <>
      <PageTitle title="Websites" />

      <div className="row fadein animation-duration-500">
        <div className="col-12">
          <div className="text-end">
            <Button
              onClick={openModal}
              label="Add Website"
              icon="pi pi-plus"
              rounded={true}
              className="bg-violet-500 dark:bg-indigo-600 text-white border-2 border-violet-300 transition-colors duration-300"
            />
          </div>
        </div>
      </div>

      <WebsiteForm showModal={showModal} closeModal={closeModal} />

      <WebsitesList refetch={shouldRefetchList} />
    </>
  );
}

export default withAuth(Websites);
