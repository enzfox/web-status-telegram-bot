import withAuth from "../../hooks/withAuth";
import { PageTitle } from "../../components/Page/PageTitle";
import { Button } from "primereact/button";
import { useState } from "react";
import WebsiteForm from "../../pages/Websites/Components/WebsiteForm";
import WebsiteList from "./Components/WebsiteList.tsx";

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

      <WebsiteList refetch={shouldRefetchList} />

      {showModal && <WebsiteForm closeModal={closeModal} />}
    </>
  );
}

const AuthenticatedWebsites = withAuth(Websites);

export default AuthenticatedWebsites;
