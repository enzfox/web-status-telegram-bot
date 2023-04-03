import TelegramBot from "node-telegram-bot-api";
import get from "axios";
import { schedule } from "node-cron";
import dotenv from "dotenv";

// Configure environment variables
dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
const websites = process.env.WEBSITES.split(",");

// Setup Telegram bot
const bot = new TelegramBot(token, { polling: true });

// Create an array of objects to store website information
const websiteStatus = websites.map((website) => ({
  url: website,
  isUp: true,
  lastNotification: null,
  downSince: null,
}));

// Check if a website is up or down
async function checkWebsiteStatus(url) {
  try {
    const response = await get(url);
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

// Schedule the website checker to run every minute (use a different cron pattern if needed)
schedule("* * * * *", async () => {
  // Get current time
  const currentTime = new Date();

  // Iterate through each website
  for (const website of websiteStatus) {
    // Check if the website is up or down
    const isUp = await checkWebsiteStatus(website.url);

    // Calculate time since last notification (if any in last 10 minutes then don't send notification)
    const timeSinceLastNotification = website.lastNotification
      ? (currentTime - website.lastNotification) / 1000 / 60 // Convert to minutes
      : null;

    // Check if the website is down and if it's been more than 10 minutes since the last notification
    if (!isUp && (website.isUp || timeSinceLastNotification >= 10)) {
      // Check again this website
      if (!(await checkWebsiteStatus(website.url))) {
        // Send a message to your Telegram chat when a website is down
        bot.sendMessage(
          chatId,
          `⚠️ The website ${website.url} appears to be down.`
        );

        // Update website last notification time
        website.lastNotification = currentTime;

        // Set downSince if it's not already set
        if (!website.downSince) {
          website.downSince = currentTime;
        }
      }
    } else if (isUp && !website.isUp) {
      // Calculate downtime duration
      const downtimeDuration = (currentTime - website.downSince) / 1000 / 60; // Convert to minutes

      // Send a message to your Telegram chat when a website is back up
      bot.sendMessage(
        chatId,
        `✅ The website ${
          website.url
        } is back up. It was down for approximately ${Math.floor(
          downtimeDuration
        )} minutes.`
      );

      // Update website downtime status
      website.downSince = null;
    }

    // Update website status
    website.isUp = isUp;
  }
});
