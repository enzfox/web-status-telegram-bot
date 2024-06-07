import { fetchConfig, getConfigData } from "./firebase";
import TelegramBot from "node-telegram-bot-api";

let bot: TelegramBot;

export async function initBot(): Promise<void> {
  try {
    await fetchConfig();
    const { botToken } = getConfigData();
    bot = new TelegramBot(botToken, { polling: true });
  } catch (error) {
    console.error("Failed to initialize bot:", error);
  }
}

export function getBot(): TelegramBot {
  return bot;
}
