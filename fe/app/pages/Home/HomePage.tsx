"use client";

import InfoCard from "@/app/components/Card/InfoCard";
import withAuth from "@/app/hooks/withAuth";
import { PageTitle } from "@/app/components/Page/PageTitle";
import { WebsiteInterface } from "@/app/interfaces/WebsiteInterface";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "@firebase/firestore";
import { db } from "@/app/utils/Firebase";

import downImage from "@/public/assets/images/down.webp";
import onlineImage from "@/public/assets/images/online.webp";
import historyImage from "@/public/assets/images/history.webp";

function HomePage() {
  const [downWebsites, setDownWebsites] = useState<WebsiteInterface[]>([]);

  const [activeWebsites, setActiveWebsites] = useState<WebsiteInterface[]>([]);

  const [historyWebsites, setHistoryWebsites] = useState<WebsiteInterface[]>(
    []
  );

  async function fetchDownWebsites() {
    const q = query(collection(db, "websites"), where("isUp", "==", false));
    const querySnapshot = await getDocs(q);
    const websitesData = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as WebsiteInterface)
    );

    setDownWebsites(websitesData);
  }

  async function fetchActiveWebsites() {
    const q = query(collection(db, "websites"), where("isUp", "==", true));
    const querySnapshot = await getDocs(q);
    const websitesData = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as WebsiteInterface)
    );

    setActiveWebsites(websitesData);
  }

  async function fetchHistoryWebsites() {
    const q = query(collection(db, "websites"), where("history", "!=", []));
    const querySnapshot = await getDocs(q);
    let websitesData = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as WebsiteInterface)
    );

    const firstOfMonth = new Date();
    firstOfMonth.setDate(1);

    const firstOfMonthTimestamp = Timestamp.fromDate(firstOfMonth);

    websitesData = websitesData
      .filter((website) => {
        if (website.history[0].date >= firstOfMonthTimestamp) {
          return website;
        }
      })
      .slice(0, 5);

    setHistoryWebsites(websitesData);
  }

  function getWebsiteUrl(website: WebsiteInterface) {
    return website.website.startsWith("http")
      ? website.website
      : "https://" + website.website;
  }

  useEffect(() => {
    fetchActiveWebsites();
    fetchDownWebsites();
    fetchHistoryWebsites();
  }, []);

  const cards = [
    {
      title: "Down",
      subTitle: "Down Websites",
      image: downImage,
      content: `
                <ul>
                  ${downWebsites
                    .map((website) => {
                      return `<li>
                        <a href=${getWebsiteUrl(
                          website
                        )} target="_blank" rel="noreferrer">
                          ${website.name}
                        </a>
                      </li>`;
                    })
                    .join("")}
                  
                    ${
                      downWebsites.length === 0
                        ? "<li>No websites down</li>"
                        : ""
                    }
                </ul>
                `,
    },
    {
      title: "Up",
      subTitle: "Online Websites",
      image: onlineImage,
      content: `${activeWebsites.length} websites are up`,
    },
    {
      title: "History",
      subTitle: "Last 5 down websites",
      image: historyImage,
      content: `
    <ul>
        ${historyWebsites
          .map((website) => {
            return `<li>
                <a href=${getWebsiteUrl(
                  website
                )} target="_blank" rel="noreferrer">
                ${website.name}
                </a>
            </li>`;
          })
          .join("")}
        
        ${historyWebsites.length === 0 ? "<li>No history</li>" : ""}
    </ul>
      `,
    },
  ];

  return (
    <>
      <PageTitle title="Dashboard" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <InfoCard
          card={{
            title: cards[0].title,
            subTitle: cards[0].subTitle,
            content: cards[0].content,
            image: cards[0].image,
            cardBackground:
              "bg-rose-500 dark:bg-red-600 transition-colors duration-300",
          }}
        />

        <InfoCard
          card={{
            title: cards[1].title,
            subTitle: cards[1].subTitle,
            content: cards[1].content,
            image: cards[1].image,
            cardBackground:
              "bg-emerald-500 dark:bg-green-600 transition-colors duration-300",
          }}
        />

        <div className="md:col-span-2 lg:col-span-1">
          <InfoCard
            card={{
              title: cards[2].title,
              subTitle: cards[2].subTitle,
              content: cards[2].content,
              image: cards[2].image,
              cardBackground:
                "bg-sky-500 dark:bg-blue-600 transition-colors duration-300",
            }}
          />
        </div>
      </div>
    </>
  );
}

export default withAuth(HomePage);
