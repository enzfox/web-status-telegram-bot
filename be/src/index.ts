import {
  checkWebsiteStatus,
  getWebsitesFromFirestore,
  updateHistoryStatus,
  updateWebsiteStatus,
  WebsiteData,
} from "./website";
import { getBot, initBot } from "./bot";
import { getConfigData } from "./firebase";

async function init() {
  await initBot();

  const bot = getBot();

  // Initially fetch website status
  let websiteStatus: WebsiteData[] = await getWebsitesFromFirestore();

  // Set an interval to update website status every hour
  setInterval(async () => {
    websiteStatus = await getWebsitesFromFirestore();

    console.log("Updating website list...\n");
  }, 3600000);

  // Set an interval to check website status every minute
  setInterval(() => checkWebsites(websiteStatus, bot), 60000);
}

// Check all websites
async function checkWebsites(websiteStatus: WebsiteData[], bot: any) {
  console.log("Checking websites...\n");

  for (const website of websiteStatus) {
    await checkWebsite(website, bot);
  }
}

// Check a website
async function checkWebsite(website: WebsiteData, bot: any) {
  // wasUp take the previous status of the website
  const { isUp: wasUp, lastNotification, downSince } = website;

  // Check if the website is up
  const isUp = await checkWebsiteStatus(website.website, website.id as string);

  website.isUp = isUp;

  const currentTime = new Date();

  const timeSinceLastNotification = lastNotification
    ? (currentTime.getTime() - new Date(lastNotification).getTime()) / 1000 / 60
    : 0;

  // Check if a notification is needed, if the website is down and was up, or is still down and the last notification was sent more than 10 minutes ago
  const isNotificationNeeded =
    !isUp && (wasUp || timeSinceLastNotification >= 10);

  // Check if a recovery notification is needed, if the website is up and was down and the downSince is not null
  const isRecoveryNotificationNeeded = isUp && !wasUp && downSince;

  if (isNotificationNeeded) {
    await sendDownNotification(website, bot, currentTime, downSince);
  } else if (isRecoveryNotificationNeeded) {
    await sendRecoveryNotification(website, bot, currentTime, downSince);
  }
}

async function sendDownNotification(
  website: WebsiteData,
  bot: any,
  currentTime: Date,
  downSince: Date | null,
) {
  // Check again if the website is down
  const isUp2 = await checkWebsiteStatus(website.website, website.id as string);
  if (isUp2) return;

  bot.sendMessage(
    getConfigData().chatId,
    `⚠️ The website ${website.website} appears to be down.`,
  );

  website.lastNotification = currentTime;

  if (!downSince) {
    website.downSince = currentTime;
  }

  await updateWebsiteStatus(website.id as string, {
    lastNotification: website.lastNotification,
    downSince: website.downSince,
  });

  // Recheck the website while is down every 10 seconds, when is up clear the interval, don't recheck the website if the interval is already set
  if (!website.interval) {
    website.interval = setInterval(async () => {
      await checkWebsite(website, bot);

      // If the website is back up, clear the interval
      if (website.isUp && website.interval) {
        clearInterval(website.interval);
        website.interval = null;
      }
    }, 10000);
  }
}

async function sendRecoveryNotification(
  website: WebsiteData,
  bot: any,
  currentTime: Date,
  downSince: Date | null,
) {
  const downTime =
    downSince instanceof Date
      ? (currentTime.getTime() - downSince.getTime()) / 1000
      : 0;

  const downTimeMinutes = Math.floor(downTime / 60);

  await updateHistoryStatus(website.id as string, downTime);

  bot.sendMessage(
    getConfigData().chatId,
    `✅ The website ${website.website} is back up. ⏰ It was down for approximately ${downTimeMinutes} minutes.`,
  );

  website.lastNotification = null;
  website.downSince = null;

  await updateWebsiteStatus(website.id as string, {
    lastNotification: null,
    downSince: null,
  });
}

init().then(() => console.log("App started"));
