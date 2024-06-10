import TelegramBot from "node-telegram-bot-api";
import { FirebaseService } from "./FirebaseService";

export class TelegramService {
  private telegram?: InstanceType<typeof TelegramBot>;
  private firebaseService = FirebaseService.getInstance();

  private static instance = new TelegramService();

  private constructor() {
    this.initTelegram().then();
  }

  private async initTelegram() {
    const { botToken } = await this.firebaseService.getConfigData();

    this.telegram = new TelegramBot(botToken, { polling: true });
  }

  public static getInstance(): TelegramService {
    return TelegramService.instance;
  }

  public async sendMessage(message: string) {
    const { chatId } = await this.firebaseService.getConfigData();

    this.telegram
      ?.sendMessage(chatId, message)
      .catch((error: string) =>
        console.error(`Failed to send message to ${chatId}`, error),
      );
  }
}
