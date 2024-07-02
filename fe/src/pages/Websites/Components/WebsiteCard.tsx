import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { WebsiteInterface } from "../../../interfaces/WebsiteInterface.ts";
import { formatDownTime } from "../../../utils/timeUtils.tsx";
import { Fragment } from "react";

export default function WebsiteCard({
  website,
  openHistoryModal,
  editWebsite,
  deleteWebsite,
}: {
  website: WebsiteInterface;
  openHistoryModal: (website: WebsiteInterface) => void;
  editWebsite: (website: WebsiteInterface) => void;
  deleteWebsite: (website: WebsiteInterface) => void;
}) {
  function getUptimePercentage(website: WebsiteInterface) {
    let totalDownTime = 0;

    website.history?.forEach((history) => {
      totalDownTime += history.downTime;
    });

    const totalPeriod = 30 * 24 * 60 * 60;
    const uptime = totalPeriod - totalDownTime;
    const uptimePercentage = (uptime / totalPeriod) * 100;

    return uptimePercentage.toFixed(4);
  }

  function getLastDownTime(website: WebsiteInterface) {
    return website.history?.length
      ? new Date(
          website.history[website.history.length - 1].date.seconds * 1000,
        ).toLocaleString()
      : " - ";
  }

  function getTotalDownTime(website: WebsiteInterface) {
    let totalDownTime = 0;

    website.history?.forEach((history) => {
      totalDownTime += history.downTime;
    });

    return formatDownTime(totalDownTime);
  }

  const currentDate = new Date();
  const startDate = new Date();
  startDate.setDate(currentDate.getDate() - 30);

  const daysArray = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="p-col-12 p-md-6 p-lg-4 md:max-w-[800px] mx-auto">
      <Card
        className={`${website.isUp ? "bg-violet-500 dark:bg-indigo-600" : "bg-amber-700"} animate-fadeIn hover:shadow-2xl hover:scale-[1.005] transition-all duration-500 mb-5`}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-bold text-2xl break-all pr-3">{website.name}</h2>

          <div className="text-end flex">
            {website?.history?.length ? (
              <Button
                icon="pi pi-clock"
                className="mr-1"
                onClick={() => openHistoryModal(website)}
              />
            ) : null}

            <Button
              icon="pi pi-pencil"
              className="mr-1"
              onClick={() => editWebsite(website)}
            />

            <Button icon="pi pi-trash" onClick={() => deleteWebsite(website)} />
          </div>
        </div>

        <a href={website.website} rel="noopener nofollow" target="_blank">
          <b>{website.website}</b>
        </a>

        <div className="flex justify-between items-center mt-3">
          <div>
            <span>Online</span>
          </div>

          <div>
            <span>{website.isUp ? "Up" : "Down"}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-2">
          <div>
            <span>Uptime</span>
          </div>

          <div>
            <span>{getUptimePercentage(website)}%</span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-2">
          <div>
            <span>Last Downtime</span>
          </div>
          <div>
            <span>{getLastDownTime(website)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-2">
          <div>
            <span>Total Downtime</span>
          </div>

          <div>
            <span>{getTotalDownTime(website)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-2">
          <div>
            <span>Status</span>
          </div>

          <div>
            <span>{website.status ? "Active" : "Inactive"}</span>
          </div>
        </div>

        <div className="flex mt-5 justify-content-center">
          {daysArray.map((day) => {
            const dayDate = new Date(startDate);
            dayDate.setDate(dayDate.getDate() + day);

            const isDayInHistory = website.history?.some((history) => {
              const historyDate = new Date(history.date.seconds * 1000);
              return (
                historyDate.getDate() === dayDate.getDate() &&
                historyDate.getMonth() === dayDate.getMonth() &&
                historyDate.getFullYear() === dayDate.getFullYear() &&
                history.downTime > 0
              );
            });

            const boxColor = isDayInHistory ? "bg-amber-600" : "bg-emerald-600";

            const options = { day: "numeric", month: "short" };
            const formattedDate = dayDate.toLocaleDateString(
              undefined,
              options as any,
            );

            return (
              <Fragment key={day}>
                <div
                  id={`day-tooltip-${day}`}
                  className={`w-[20px] h-[20px] m-[2px] rounded shadow-xl hover:shadow-2xl hover:scale-[1.2] transform-gpu transition-all duration-300 ${boxColor}`}
                />
                <Tooltip
                  target={`#day-tooltip-${day}`}
                  content={`Date: ${formattedDate}`}
                  position="bottom"
                />
              </Fragment>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
