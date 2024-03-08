import { getBot, initBot } from "./bot.js";
import {
  checkWebsiteStatus,
  getWebsitesFromFirestore,
  updateWebsiteStatus,
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

// Check all websites
async function checkWebsites(websiteStatus, bot) {
  console.log("Checking websites...\n");

  for (const website of websiteStatus) {
    await checkWebsite(website, bot);
  }
}

// Check a website
async function checkWebsite(website, bot) {
  // wasUp take the previous status of the website
  const { isUp: wasUp, lastNotification, downSince } = website;

  // Check if the website is up
  const isUp = await checkWebsiteStatus(website.website, website.id);

  website.isUp = isUp;

  const currentTime = new Date();

  const timeSinceLastNotification = lastNotification
    ? (currentTime - new Date(lastNotification)) / 1000 / 60
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

async function sendDownNotification(website, bot, currentTime, downSince) {
  // Check again if the website is down
  const isUp2 = await checkWebsiteStatus(website.website, website.id);
  if (isUp2) return;

  bot.sendMessage(
    getConfigData().chatId,
    `⚠️ The website ${website.website} appears to be down.`
  );

  website.lastNotification = currentTime;

  if (!downSince) {
    website.downSince = currentTime;
  }

  updateWebsiteStatus(website.id, {
    lastNotification: website.lastNotification,
    downSince: website.downSince,
  });

  // Recheck the website while is down every 10 seconds, when is up clear the interval, don't recheck the website if interval is already set
  if (!website.interval) {
    website.interval = setInterval(async () => {
      await checkWebsite(website, bot);

      // If the website is back up, clear the interval
      if (website.isUp) {
        clearInterval(website.interval);
        website.interval = null;
      }
    }, 10000);
  }
}

async function sendRecoveryNotification(website, bot, currentTime, downSince) {
  const downTime =
    downSince instanceof Date ? (currentTime - downSince) / 1000 : 0;

  const downTimeMinutes = Math.floor(downTime / 60);

  await updateHistoryStatus(website.id, downTime);

  bot.sendMessage(
    getConfigData().chatId,
    `✅ The website ${website.website} is back up. ⏰ It was down for approximately ${downTimeMinutes} minutes.`
  );

  website.lastNotification = null;
  website.downSince = null;

  updateWebsiteStatus(website.id, {
    lastNotification: null,
    downSince: null,
  });
}

init();
