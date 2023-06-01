import TelegramBot from "node-telegram-bot-api";
import get from "axios";
import dotenv from "dotenv";

dotenv.config();

const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, WEBSITES } = process.env;

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

const websiteStatus = WEBSITES.split(",").map((url) => ({
  url,
  isUp: true,
  lastNotification: null,
  downSince: null,
}));

async function checkWebsiteStatus(url) {
  try {
    const response = await get(url);
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

setInterval(async () => {
  const currentTime = new Date();

  for (const website of websiteStatus) {
    const isUp = await checkWebsiteStatus(website.url);
    const { isUp: wasUp, lastNotification, downSince } = website;

    const timeSinceLastNotification = lastNotification
      ? (currentTime - lastNotification) / 1000 / 60
      : null;

    const isNotificationNeeded =
      !isUp && (wasUp || timeSinceLastNotification >= 10);
    const isRecoveryNotificationNeeded = isUp && !wasUp && downSince !== null;

    if (isNotificationNeeded) {
      bot.sendMessage(
        TELEGRAM_CHAT_ID,
        `⚠️ The website ${website.url} appears to be down.`
      );

      website.lastNotification = currentTime;

      if (downSince === null) {
        website.downSince = currentTime;
      }
    } else if (isRecoveryNotificationNeeded) {
      const downtimeDuration = Math.floor(
        (currentTime - downSince) / 1000 / 60
      );

      bot.sendMessage(
        TELEGRAM_CHAT_ID,
        `✅ The website ${website.url} is back up. ⏰ It was down for approximately ${downtimeDuration} minutes.`
      );

      website.downSince = null;
    }

    website.isUp = isUp;
  }
}, 60000);
