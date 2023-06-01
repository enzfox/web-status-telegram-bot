import get from "axios";
import dotenv from "dotenv";

dotenv.config();

const { WEBSITES } = process.env;

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

    console.log(websiteStatus);

    const timeSinceLastNotification = lastNotification
      ? (currentTime - lastNotification) / 1000 / 60
      : null;

    const isNotificationNeeded =
      !isUp && (wasUp || timeSinceLastNotification >= 10);
    const isRecoveryNotificationNeeded = isUp && !wasUp && downSince !== null;

    if (isNotificationNeeded) {
      console.log(`⚠️ The website ${website.url} appears to be down.`);

      website.lastNotification = currentTime;

      if (downSince === null) {
        website.downSince = currentTime;
      }
    } else if (isRecoveryNotificationNeeded) {
      const downtimeDuration = Math.floor(
        (currentTime - downSince) / 1000 / 60
      );

      console.log(
        `✅ The website ${website.url} is back up. ⏰ It was down for approximately ${downtimeDuration} minutes.`
      );

      website.downSince = null;
    }

    website.isUp = isUp;
  }
}, 60000);
