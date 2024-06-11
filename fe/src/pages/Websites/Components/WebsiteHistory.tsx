import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import { WebsiteInterface } from "../../../interfaces/WebsiteInterface";
import { formatDownTime } from "../../../utils/timeUtils.tsx";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export default function WebsiteHistory({
  showModal,
  closeModal,
  website,
}: {
  showModal: boolean;
  closeModal: () => void;
  website?: WebsiteInterface;
}) {
  const [historyData, setHistoryData] = useState(website?.history || []);

  useEffect(() => {
    if (website) {
      setHistoryData(website.history || []);
    }
  }, [website]);

  const totalDownTime = historyData.reduce(
    (total, history) => total + history.downTime,
    0,
  );

  return (
    <Dialog
      visible={showModal}
      onHide={closeModal}
      header={`Website History (${website?.history?.length})`}
      className="w-[90%] max-w-[500px]"
    >
      <DataTable value={historyData}>
        <Column
          field="downTime"
          header="Down Time"
          body={(rowData) => formatDownTime(rowData.downTime)}
          className="text-left"
        />
        <Column
          field="date"
          header="Down At"
          body={(rowData) =>
            new Date(rowData.date.seconds * 1000).toLocaleString()
          }
          className="text-left"
        />
      </DataTable>

      <div className="text-center pt-5">
        Total Down Time: {formatDownTime(totalDownTime)}
      </div>
    </Dialog>
  );
}