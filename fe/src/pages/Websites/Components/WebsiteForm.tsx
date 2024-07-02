import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { FormEvent as FormEventPrime } from "primereact/ts-helpers";
import { db } from "../../../utils/Firebase";
import { addDoc, collection, doc, updateDoc } from "@firebase/firestore";
import { WebsiteInterface } from "../../../interfaces/WebsiteInterface";

export default function WebsiteForm({
  showModal,
  closeModal,
  website,
}: {
  showModal: boolean;
  closeModal: () => void;
  website?: WebsiteInterface;
}) {
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    status: true,
    isUp: true,
  });

  useEffect(() => {
    if (website) {
      setFormData({
        name: website.name,
        website: website.website,
        status: website.status as boolean,
        isUp: website.isUp,
      });
    }
  }, []);

  const [hasError, setHasError] = useState<boolean | string>(false);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement> | FormEventPrime,
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!validateForm()) return;

    if (website) {
      try {
        // Reference the document to update
        const websiteDocRef = doc(db, "websites", website.id);

        // Update the document with the new data
        await updateDoc(
          websiteDocRef,
          formData as unknown as Partial<WebsiteInterface>,
        );
      } catch (error) {
        console.error("Error updating website:", error);
      }
    } else {
      await addDoc(
        collection(db, "websites"),
        formData as unknown as WebsiteInterface,
      );
    }

    resetForm();

    closeModal();
  }

  function validateForm() {
    if (!formData.name) {
      setHasError("Name is required");
      return false;
    }

    if (!formData.website) {
      setHasError("Website is required");
      return false;
    }

    return true;
  }

  function resetForm() {
    setFormData({
      name: "",
      website: "",
      status: true,
      isUp: true,
    });

    setHasError(false);
  }

  const statusOptions = [
    { label: "Active", value: true },
    { label: "Inactive", value: false },
  ];

  return (
    <>
      <Dialog
        visible={showModal}
        onHide={closeModal}
        header="Website Form"
        className="w-[90%] max-w-[500px]"
        footer={
          <div>
            <Button label="Save" onClick={handleSubmit} />
            <Button
              label="Cancel"
              onClick={closeModal}
              className="p-button-secondary"
            />
          </div>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="p-fluid">
            <div className="p-field pb-2">
              <label htmlFor="name">Name</label>
              <InputText
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="p-field py-2">
              <label htmlFor="website">Website</label>
              <InputText
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
              />
            </div>

            <div className="p-field py-2">
              <label htmlFor="status">Status</label>
              <Dropdown
                id="status"
                name="status"
                value={formData.status}
                options={statusOptions}
                onChange={handleInputChange}
                placeholder="Select a status"
                optionValue="value"
              />
            </div>

            {hasError && (
              <div className="p-field">
                <small className="p-error">{hasError}</small>
              </div>
            )}
          </div>
        </form>
      </Dialog>
    </>
  );
}
