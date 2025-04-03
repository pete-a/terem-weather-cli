import { describe, expect, it } from "vitest";
import { WeatherMeasurement } from "../weather-measurement.ts";
import { createMonthlyAggregation } from "./create-monthly-aggregation.js";

describe("createAggregation", () => {
  const measurements: (WeatherMeasurement & {
    rainfallInMicrometers: number;
  })[] = [
    { year: "2020", month: "01", day: "02", rainfallInMicrometers: 1000 },
    { year: "2020", month: "01", day: "04", rainfallInMicrometers: 100 },
    { year: "2020", month: "01", day: "01", rainfallInMicrometers: 1200 },
    { year: "2020", month: "01", day: "03", rainfallInMicrometers: 0 },
  ];

  const result = createMonthlyAggregation(measurements);

  it("has the correct total rainfall", () => {
    expect(result.totalRainfallInMillimeters).toEqual(2.3);
  });

  it("has the correct average rainfall", () => {
    expect(result.averageRainfallInMillimeters).toEqual(0.575);
  });

  it("has the correct median rainfall", () => {
    expect(result.medianRainfallInMillimeters).toEqual(0.55);
  });

  it("has the correct total days with rainfall", () => {
    expect(result.totalDaysWithRainfall).toEqual(3);
  });

  it("has the correct total days without rainfall", () => {
    expect(result.totalDaysWithoutRainfall).toEqual(1);
  });

  it("has the correct first recording", () => {
    expect(result.firstMeasurementDate).toEqual("2020-01-01");
  });
  it("has the correct last recording", () => {
    expect(result.lastMeasurementDate).toEqual("2020-01-04");
  });
});
