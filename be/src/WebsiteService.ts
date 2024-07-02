import axios from "axios";
import { firestore } from "firebase-admin";
import { formatDownTime, secondsToMs } from "./utils/timeUtils";
import { TelegramService } from "./TelegramService";
import { WebsiteRepository } from "./WebsiteRepository";
import Timestamp = firestore.Timestamp;

export interface WebsiteData {
  id?: string;
  website: string;
  isUp: boolean;
  lastNotification: Timestamp | null;
  downSince: Timestamp | null;
  interval: NodeJS.Timeout | null;

  [key: string]: any;
}

export class WebsiteService {
  data: WebsiteData;

  websiteRepository: WebsiteRepository = new WebsiteRepository();
  telegramService: TelegramService = TelegramService.getInstance();

  constructor(data: WebsiteData) {
    this.data = data;
  }

  /**
   * Check the website status
   *
   * If the website is up, check if it was down before and send a recovery notification
   *
   * If the website is down, check if it can be notified, check one more time if the website is down and send a down notification
   * */
  async checkWebsite(): Promise<void> {
    if (await this.isUp()) {
      if (!this.data.isUp) {
        await this.sendRecoveryNotification();
      }
    } else if (this.canNotify() && !(await this.isUp())) {
      await this.sendDownNotification();
    }
  }

  async isUp(): Promise<boolean> {
    try {
      const response = await axios.get(this.data.website);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  /**
   *
   * Check if the website can be notified
   * If the website was never notified, return true
   * If the website was notified, check if the last notification was more than 10 minutes ago
   *
   *
   * @returns boolean
   * */
  canNotify(): boolean {
    if (!this.data.lastNotification) return true;

    const lastNotificationDate: Date = this.data.lastNotification.toDate();

    const minutes = Math.floor(
      (new Date().getTime() - lastNotificationDate.getTime()) / 60000,
    );

    return minutes >= 10;
  }

  updateData(data: Partial<WebsiteData>): void {
    this.data = { ...this.data, ...data };

    this.websiteRepository.updateWebsite(this.data).then();
  }

  async updateHistoryStatus(downTime: number): Promise<void> {
    this.websiteRepository.updateWebsiteStatus(this.data, downTime).then();
  }

  /**
   * Set the website as down and send a notification
   *
   * Every 3 seconds, check if the website is back up
   * */
  async sendDownNotification(): Promise<void> {
    this.updateData({
      isUp: false,
      lastNotification: Timestamp.fromDate(new Date()),
      downSince: this.data.downSince ?? Timestamp.fromDate(new Date()),
    });

    await this.telegramService.sendMessage(
      `⚠️ The website ${this.data.website} appears to be down.`,
    );

    console.error(`⚠️ Sent down notification for ${this.data.website}`);

    if (!this.data.interval)
      this.data.interval = setInterval(
        async () => await this.checkWebsite(),
        secondsToMs(3),
      );
  }

  /**
   * Set the website as up and send a recovery notification
   *
   * Clear the interval
   * */
  async sendRecoveryNotification(): Promise<void> {
    const downSinceDate = this.data.downSince
      ? this.data.downSince.toDate()
      : null;

    clearInterval(this.data.interval!);

    this.updateData({
      isUp: true,
      lastNotification: null,
      downSince: null,
      interval: null,
    });

    const downTime: number = downSinceDate
      ? (new Date().getTime() - downSinceDate.getTime()) / 1000
      : 0;

    this.updateHistoryStatus(downTime).then();

    await this.telegramService.sendMessage(
      `✅ The website ${this.data.website} is back up. ⏰ It was down for approximately ${formatDownTime(downTime)}.`,
    );

    console.warn(`✅ Sent recovery notification for ${this.data.website}`);
  }
}
