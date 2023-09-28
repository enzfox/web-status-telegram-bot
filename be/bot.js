import TelegramBot from "node-telegram-bot-api";
import { fetchConfig, getConfigData } from "./firebase.js";

let bot;

export async function initBot() {
  try {
    await fetchConfig();
    const { botToken } = getConfigData();
    bot = new TelegramBot(botToken, { polling: true });
  } catch (error) {
    console.error("Failed to initialize bot:", error);
  }
}

export function getBot() {
  return bot;
}
