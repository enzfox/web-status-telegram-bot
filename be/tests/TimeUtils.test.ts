import { formatDownTime, secondsToMs } from "../src/utils/timeUtils";

import { describe, expect, it } from "@jest/globals";

describe("timeUtils", () => {
  describe("secondsToMs", () => {
    it("should correctly convert seconds to milliseconds", () => {
      expect(secondsToMs(1)).toBe(1000);
      expect(secondsToMs(2)).toBe(2000);
      expect(secondsToMs(60)).toBe(60000);
    });
  });

  describe("formatDownTime", () => {
    it("should correctly format down time", () => {
      expect(formatDownTime(3661)).toBe("01:01:01");
      expect(formatDownTime(3600)).toBe("01:00:00");
      expect(formatDownTime(60)).toBe("00:01:00");
      expect(formatDownTime(1)).toBe("00:00:01");
    });
  });
});
