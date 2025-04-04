import { describe, expect, it } from "vitest";
import { WeatherMeasurementWithRainfall } from "../weather-measurement.ts";
import { createYearlyAggregation } from "./create-yearly-aggregation.ts";

describe("createYearlyAggregation", () => {
  describe("longestRainingStreakInDays", () => {
    const measurements: WeatherMeasurementWithRainfall[] = [
      { year: "2025", month: "01", day: "30", rainfallInMicrometers: 0 },
      { year: "2025", month: "01", day: "31", rainfallInMicrometers: 1 },
      { year: "2025", month: "02", day: "01", rainfallInMicrometers: 1 },
      { year: "2025", month: "02", day: "02", rainfallInMicrometers: 1 },
      { year: "2025", month: "02", day: "03", rainfallInMicrometers: 1 },
      { year: "2025", month: "02", day: "04", rainfallInMicrometers: 1 },
      { year: "2025", month: "02", day: "06", rainfallInMicrometers: 1 }, // Notice there is not data for the 5th of Feb
      { year: "2025", month: "02", day: "05", rainfallInMicrometers: 0 },
      { year: "2025", month: "02", day: "06", rainfallInMicrometers: 1 },
      { year: "2025", month: "02", day: "07", rainfallInMicrometers: 2 },
      { year: "2025", month: "02", day: "08", rainfallInMicrometers: 2 },
      { year: "2025", month: "02", day: "09", rainfallInMicrometers: 0 },
      { year: "2025", month: "02", day: "10", rainfallInMicrometers: 0 },
      { year: "2025", month: "02", day: "11", rainfallInMicrometers: 0 },
      { year: "2025", month: "02", day: "12", rainfallInMicrometers: 1 },
      { year: "2025", month: "02", day: "13", rainfallInMicrometers: 1 },
    ];

    const result = createYearlyAggregation("2025", measurements);

    it("calculates the longest raining streak in days", () => {
      expect(result.longestRainingStreakInDays).toEqual(5);
    });
  });

  describe("first and last measurement dates", () => {
    const measurements: WeatherMeasurementWithRainfall[] = [
      { year: "2025", month: "03", day: "02", rainfallInMicrometers: 1 },
      { year: "2025", month: "02", day: "03", rainfallInMicrometers: 0 },
      { year: "2025", month: "04", day: "03", rainfallInMicrometers: 2 },
      { year: "2025", month: "04", day: "04", rainfallInMicrometers: 1 },
      { year: "2025", month: "04", day: "05", rainfallInMicrometers: 0 },
      { year: "2025", month: "04", day: "06", rainfallInMicrometers: 1 },
      { year: "2025", month: "05", day: "07", rainfallInMicrometers: 2 },
      { year: "2025", month: "05", day: "08", rainfallInMicrometers: 2 },
      { year: "2025", month: "05", day: "09", rainfallInMicrometers: 1 },
      { year: "2025", month: "05", day: "10", rainfallInMicrometers: 1 },
      { year: "2025", month: "12", day: "29", rainfallInMicrometers: 0 },
      { year: "2025", month: "06", day: "11", rainfallInMicrometers: 0 },
    ];
    const result = createYearlyAggregation("2025", measurements);

    it("calculates the correct dates", () => {
      expect(result.firstMeasurementDate).toEqual("2025-02-03");
      expect(result.lastMeasurementDate).toEqual("2025-12-29");
    });
  });

  describe("total and average rainfalls", () => {
    const measurements: WeatherMeasurementWithRainfall[] = [
      { year: "2025", month: "03", day: "02", rainfallInMicrometers: 100 },
      { year: "2025", month: "02", day: "03", rainfallInMicrometers: 0 },
      { year: "2025", month: "04", day: "03", rainfallInMicrometers: 50 },
      { year: "2025", month: "04", day: "04", rainfallInMicrometers: 50 },
    ];
    const result = createYearlyAggregation("2025", measurements);

    it("calculates the total in millimeters", () => {
      expect(result.totalRainfallInMillimeters).toEqual(0.2);
    });

    it("calculates the average in millimeters", () => {
      expect(result.averageRainfallInMillimeters).toEqual(0.05);
    });
  });

  describe("total days with and without rainfall", () => {
    const measurements: WeatherMeasurementWithRainfall[] = [
      { year: "2025", month: "03", day: "02", rainfallInMicrometers: 1 },
      { year: "2025", month: "02", day: "03", rainfallInMicrometers: 0 },
      { year: "2025", month: "04", day: "03", rainfallInMicrometers: 1 },
      { year: "2025", month: "04", day: "04", rainfallInMicrometers: 1 },
      { year: "2025", month: "04", day: "05", rainfallInMicrometers: 0 },
      { year: "2025", month: "04", day: "06", rainfallInMicrometers: 0 },
      { year: "2025", month: "05", day: "07", rainfallInMicrometers: 1 },
      { year: "2025", month: "05", day: "08", rainfallInMicrometers: 1 },
      { year: "2025", month: "05", day: "10", rainfallInMicrometers: 1 },
      { year: "2025", month: "12", day: "29", rainfallInMicrometers: 0 },
      { year: "2025", month: "06", day: "11", rainfallInMicrometers: 0 },
    ];

    const result = createYearlyAggregation("2025", measurements);

    it("calculates the total days with rainfall", () => {
      expect(result.totalDaysWithRainfall).toEqual(6);
    });

    it("calculates the total days without rainfall", () => {
      expect(result.totalDaysWithoutRainfall).toEqual(5);
    });
  });

  describe("monthly aggregations", () => {
    const measurements: WeatherMeasurementWithRainfall[] = [
      { year: "2025", month: "02", day: "01", rainfallInMicrometers: 0 },
      { year: "2025", month: "02", day: "02", rainfallInMicrometers: 0 },
      { year: "2025", month: "02", day: "03", rainfallInMicrometers: 0 },
      { year: "2025", month: "03", day: "01", rainfallInMicrometers: 0 },
      { year: "2025", month: "03", day: "02", rainfallInMicrometers: 0 },
      { year: "2025", month: "04", day: "01", rainfallInMicrometers: 0 },
      { year: "2025", month: "04", day: "02", rainfallInMicrometers: 0 },
    ];

    const result = createYearlyAggregation("2025", measurements);
    it("includes the correct number of monthly aggregations", () => {
      expect(result.monthlyAggregations.length).toEqual(3);
    });
  });
});
