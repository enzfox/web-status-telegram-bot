import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useState } from "react";

export default function InfoComponent() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="absolute left-0 right-0 bottom-[25%] text-center">
      <div className="fadeindown animation-duration-500">
        <Button
          className="scale-[1.5]"
          severity="warning"
          icon="pi pi-info-circle"
          rounded
          onClick={() => setShowInfo(true)}
        />
      </div>

      <Dialog
        header="Get Token & Chat ID"
        visible={showInfo}
        className="w-[90%] max-w-[500px]"
        onHide={() => setShowInfo(false)}
      >
        <p className="m-0">
          TELEGRAM BOT TOKEN: Send{" "}
          <span className="text-amber-400">/start</span> to{" "}
          <a
            className="text-blue-500"
            href="https://t.me/BotFather"
            target="_blank"
          >
            @BotFather
          </a>
        </p>

        <p className="m-0">
          TELEGRAM CHAT ID: Send <span className="text-amber-400">/start</span>{" "}
          to{" "}
          <a
            className="text-blue-500"
            href="https://t.me/userinfobot"
            target="_blank"
          >
            @userinfobot
          </a>
        </p>
      </Dialog>
    </div>
  );
}
