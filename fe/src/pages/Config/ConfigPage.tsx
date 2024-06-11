import withAuth from "../../hooks/withAuth";
import { PageTitle } from "../../components/Page/PageTitle";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "@firebase/firestore";
import { db } from "../../utils/Firebase";
import InfoComponent from "../../pages/Config/Components/InfoComponent";
import { useToast } from "../../hooks/useToastContext.tsx";

function Config() {
  const [botToken, setBotToken] = useState("");
  const [chatId, setChatId] = useState("");

  const [formError, setFormError] = useState("");

  const { showToast } = useToast();

  useEffect(() => {
    async function fetchConfig() {
      try {
        const configDocRef = doc(db, "config", "configId");
        const configDocSnapshot = await getDoc(configDocRef);

        if (configDocSnapshot.exists()) {
          const configData = configDocSnapshot.data();
          setBotToken(configData.botToken);
          setChatId(configData.chatId);
        }
      } catch (error) {
        showToast({
          severity: "error",
          summary: "Error",
          detail: "Failed to fetch config",
        });
      }
    }

    fetchConfig().then();
  }, [showToast]);

  const handleSubmit = async () => {
    setFormError("");

    if (!botToken || !chatId) {
      setFormError("Please enter bot token and chat id");
      return;
    }

    try {
      const configDocRef = doc(db, "config", "configId");
      await setDoc(configDocRef, { botToken, chatId });

      showToast({
        severity: "success",
        summary: "Success",
        detail: "Config saved successfully!",
      });
    } catch (error) {
      showToast({
        severity: "error",
        summary: "Error",
        detail: "Failed to save config",
      });
    }
  };

  return (
    <>
      <PageTitle title="Config" />

      <div className="md:max-w-[500px] mx-auto pt-5 fadein animation-duration-500">
        <div className="p-inputgroup pb-3">
          <span className="p-inputgroup-addon">
            <i className="pi pi-telegram"></i>
          </span>

          <InputText
            placeholder="TELEGRAM BOT TOKEN"
            value={botToken}
            onChange={(e) => setBotToken(e.target.value)}
          />
        </div>

        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">
            <i className="pi pi-comment"></i>
          </span>

          <InputText
            placeholder="TELEGRAM CHAT ID"
            value={chatId}
            onChange={(e) => setChatId(e.target.value)}
          />
        </div>

        {formError && <div className="text-red-500">{formError}</div>}

        <div className="w-100 p-3 text-center">
          <Button
            className="bg-violet-500 dark:bg-indigo-600 text-white border-2 border-violet-300 transition-colors duration-300 max-w-[200px] w-full fadein animation-duration-500"
            icon="pi pi-check"
            rounded
            label="Submit"
            onClick={handleSubmit}
          />
        </div>
      </div>

      <InfoComponent />
    </>
  );
}

const AuthenticatedConfig = withAuth(Config);

export default AuthenticatedConfig;
