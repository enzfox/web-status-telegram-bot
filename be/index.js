import { getBot, initBot } from "./bot.js";
import {
  checkWebsiteStatus,
  getWebsitesFromFirestore,
  updateHistoryStatus,
} from "./website.js";
import { getConfigData } from "./firebase.js";

async function init() {
  await initBot();

  const bot = getBot();

  // Initially fetch website status
  let websiteStatus = await getWebsitesFromFirestore();

  // Set an interval to update website status every hour
  setInterval(async () => {
    websiteStatus = await getWebsitesFromFirestore();

    console.log("Updating website list...\n");
  }, 3600000);

  // Set an interval to check website status every minute
  setInterval(() => checkWebsites(websiteStatus, bot), 60000);
}

async function checkWebsites(websiteStatus, bot) {
  console.log("Checking websites...\n");

  const currentTime = new Date();

  for (const website of websiteStatus) {
    // Check if the website is up
    const isUp = await checkWebsiteStatus(website.website, website.id);

    const { isUp: wasUp, lastNotification, downSince } = website;

    const timeSinceLastNotification = lastNotification
      ? (currentTime - new Date(lastNotification)) / 1000 / 60
      : null;

    // Check if a notification is needed (one every 10 minutes)
    const isNotificationNeeded =
      !isUp && (wasUp || timeSinceLastNotification >= 10);
    const isRecoveryNotificationNeeded = isUp && !wasUp && downSince !== null;

    if (isNotificationNeeded) {
      // Check again if the website is down
      const isUp2 = await checkWebsiteStatus(website.website, website.id);

      if (!isUp2) {
        bot.sendMessage(
          getConfigData().chatId,
          `⚠️ The website ${website.website} appears to be down.`
        );

        website.lastNotification = currentTime;

        if (!downSince) {
          website.downSince = currentTime;
        }
      }
    } else if (isRecoveryNotificationNeeded) {
      const downTime =
        downSince instanceof Date ? (currentTime - downSince) / 1000 : 0;

      const downTimeMinutes = Math.floor(downTime / 60);

      await updateHistoryStatus(website.id, downTime);

      bot.sendMessage(
        getConfigData().chatId,
        `✅ The website ${website.website} is back up. ⏰ It was down for approximately ${downTimeMinutes} minutes.`
      );

      website.downSince = null;
    }

    website.isUp = isUp;
  }
}

init();
