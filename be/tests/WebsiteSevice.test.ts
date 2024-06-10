import axios from "axios";
import { WebsiteData, WebsiteService } from "../src/WebsiteService";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { firestore } from "firebase-admin";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("../src/FirebaseService", () => ({
  FirebaseService: {
    getInstance: () => ({
      db: {
        doc: jest.fn().mockReturnThis(),
        update: jest.fn(),
      },
      fetchConfig: jest.fn(),
      getConfigData: jest.fn(),
    }),
  },
}));

jest.mock("../src/TelegramService", () => ({
  TelegramService: {
    getInstance: () => ({
      initTelegram: jest.fn(),
      sendMessage: jest.fn(),
    }),
  },
}));

describe("WebsiteService", () => {
  let websiteService: WebsiteService;
  let telegramServiceSendMessageSpy: any;
  let websiteRepositoryUpdateWebsiteSpy: any;

  const websiteData: WebsiteData = {
    website: "https://google.com",
    isUp: true,
    lastNotification: null,
    downSince: null,
    interval: null,
  };

  beforeEach(() => {
    websiteService = new WebsiteService(websiteData);
    telegramServiceSendMessageSpy = jest.spyOn(
      websiteService.telegramService,
      "sendMessage",
    );
    websiteRepositoryUpdateWebsiteSpy = jest.spyOn(
      websiteService.websiteRepository,
      "updateWebsite",
    );
  });

  afterEach(() => {
    telegramServiceSendMessageSpy.mockClear();
    mockedAxios.get.mockClear();
    clearInterval(websiteService.data.interval!);
  });

  describe("isUp", () => {
    it("should return true when the website is up and status is 200", async () => {
      mockedAxios.get.mockResolvedValue({ status: 200 });

      const result = await websiteService.isUp();

      expect(result).toBe(true);
      expect(mockedAxios.get).toHaveBeenCalledWith(websiteData.website);
    });

    it("should return false when the website is up but status is not 200", async () => {
      mockedAxios.get.mockResolvedValue({ status: 404 });

      const result = await websiteService.isUp();

      expect(result).toBe(false);
      expect(mockedAxios.get).toHaveBeenCalledWith(websiteData.website);
    });

    it("should return false when the website is down", async () => {
      mockedAxios.get.mockRejectedValue(new Error("Network Error"));

      const result = await websiteService.isUp();
      expect(result).toBe(false);

      expect(mockedAxios.get).toHaveBeenCalledWith(websiteData.website);
    });
  });

  describe("canNotify", () => {
    it("should return true when lastNotification is null", () => {
      websiteService.data.lastNotification = null;

      const result = websiteService.canNotify();

      expect(result).toBe(true);
    });

    it("should return false when lastNotification is less than 10 minutes ago", () => {
      websiteService.data.lastNotification = firestore.Timestamp.fromDate(
        new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      );

      const result = websiteService.canNotify();

      expect(result).toBe(false);
    });

    it("should return true when lastNotification is more than 10 minutes ago", () => {
      websiteService.data.lastNotification = firestore.Timestamp.fromDate(
        new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      );

      const result = websiteService.canNotify();

      expect(result).toBe(true);
    });
  });

  describe("updateData", () => {
    it("should update the website data and call the updateWebsite method", () => {
      const newData = { isUp: false };
      websiteService.updateData(newData);

      expect(websiteService.data).toEqual({ ...websiteData, ...newData });
      expect(websiteRepositoryUpdateWebsiteSpy).toHaveBeenCalledWith({
        ...websiteData,
        ...newData,
      });
    });

    it("should not change the website data when called with an empty object", () => {
      websiteService.updateData({});

      expect(websiteService.data).toEqual(websiteData);
      expect(websiteRepositoryUpdateWebsiteSpy).toHaveBeenCalledWith(
        websiteData,
      );
    });
  });

  describe("sendDownNotification", () => {
    it("should update the website data, send a message and set an interval", async () => {
      await websiteService.sendDownNotification();

      expect(websiteService.data.isUp).toBe(false);
      expect(websiteService.data.lastNotification).not.toBeNull();
      expect(websiteService.data.downSince).not.toBeNull();
      expect(websiteService.data.interval).not.toBeNull();
      expect(telegramServiceSendMessageSpy).toHaveBeenCalledWith(
        `⚠️ The website ${websiteData.website} appears to be down.`,
      );
      expect(websiteRepositoryUpdateWebsiteSpy).toHaveBeenCalled();
    });
  });

  describe("sendRecoveryNotification", () => {
    it("should update the website data, send a message and clear the interval", async () => {
      await websiteService.sendRecoveryNotification();

      expect(websiteService.data.isUp).toBe(true);
      expect(websiteService.data.lastNotification).toBeNull();
      expect(websiteService.data.downSince).toBeNull();
      expect(websiteService.data.interval).toBeNull();
      expect(telegramServiceSendMessageSpy).toHaveBeenCalled();
      expect(websiteRepositoryUpdateWebsiteSpy).toHaveBeenCalled();
    });
  });
});
