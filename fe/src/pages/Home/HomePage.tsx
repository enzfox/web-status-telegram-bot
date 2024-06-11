import InfoCard from "../../components/Card/InfoCard";
import withAuth from "../../hooks/withAuth";
import { PageTitle } from "../../components/Page/PageTitle";
import { WebsiteInterface } from "../../interfaces/WebsiteInterface";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "@firebase/firestore";
import { db } from "../../utils/Firebase";

import downImage from "../../assets/images/down.svg";
import onlineImage from "../../assets/images/online.svg";
import historyImage from "../../assets/images/history.svg";

function HomePage() {
  const [downWebsites, setDownWebsites] = useState<WebsiteInterface[]>([]);

  const [activeWebsites, setActiveWebsites] = useState<WebsiteInterface[]>([]);

  const [historyWebsites, setHistoryWebsites] = useState<WebsiteInterface[]>(
    [],
  );

  async function fetchDownWebsites() {
    const q = query(collection(db, "websites"), where("isUp", "==", false));
    const querySnapshot = await getDocs(q);
    const websitesData = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as WebsiteInterface,
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
        }) as WebsiteInterface,
    );

    setActiveWebsites(websitesData);
  }

  async function fetchHistoryWebsites() {
    const q = query(collection(db, "websites"), where("history", "!=", []));
    const querySnapshot = await getDocs(q);
    let websiteData = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as WebsiteInterface,
    );

    const firstOfMonth = new Date();
    firstOfMonth.setDate(1);

    websiteData = websiteData
      .filter((website) => {
        const websiteDate = new Date(
          website.history[website.history.length - 1].date.seconds * 1000,
        );
        if (websiteDate >= firstOfMonth) {
          return website;
        }
      })
      .slice(0, 5);

    setHistoryWebsites(websiteData);
  }

  function getWebsiteUrl(website: WebsiteInterface) {
    return website.website.startsWith("http")
      ? website.website
      : "https://" + website.website;
  }

  useEffect(() => {
    fetchActiveWebsites().then();
    fetchDownWebsites().then();
    fetchHistoryWebsites().then();
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
                          website,
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
                  website,
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5 p-3">
        <InfoCard
          card={{
            title: cards[0].title,
            subTitle: cards[0].subTitle,
            content: cards[0].content,
            image: cards[0].image,
            cardBackground: "transition-colors duration-300",
            style: { backgroundColor: "#FF6B6B" },
          }}
        />

        <InfoCard
          card={{
            title: cards[1].title,
            subTitle: cards[1].subTitle,
            content: cards[1].content,
            image: cards[1].image,
            cardBackground: "transition-colors duration-300",
            style: { backgroundColor: "#5B803B" },
          }}
        />

        <div className="md:col-span-2 lg:col-span-1">
          <InfoCard
            card={{
              title: cards[2].title,
              subTitle: cards[2].subTitle,
              content: cards[2].content,
              image: cards[2].image,
              cardBackground: "transition-colors duration-300",
              style: { backgroundColor: "#346A80" },
            }}
          />
        </div>
      </div>
    </>
  );
}

const AuthenticatedHomePage = withAuth(HomePage);

export default AuthenticatedHomePage;
