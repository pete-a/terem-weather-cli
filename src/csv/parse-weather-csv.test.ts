import { describe, expect, it } from "vitest";
import { parseWeatherCsvData } from "./parse-weather-csv.ts";
import { WeatherMeasurement } from "../weather-measurement.js";

async function* makeAsyncIteratorFromArray<T>(array: T[]) {
  for (const item of array) {
    yield item;
  }
}

describe("parseWeatherCsv", async () => {
  const csvHeader =
    "Product code,Bureau of Meteorology station number,Year,Month,Day,Rainfall amount (millimetres),Period over which rainfall was measured (days),Quality";
  const rowIterator = makeAsyncIteratorFromArray([
    csvHeader,
    "IDCJAC0009,066062,1858,01,01,1.2,,",
    "IDCJAC0009,066062,2020,04,03,,,",
    "IDCJAC0009,066062,2019,12,02,0.2,,",
  ]);

  const parseResult = await parseWeatherCsvData(rowIterator);

  const expectedResults: WeatherMeasurement[] = [
    {
      year: "1858",
      month: "01",
      day: "01",
      rainfallInMicrometers: 1200,
    },
    {
      year: "2020",
      month: "04",
      day: "03",
      rainfallInMicrometers: null,
    },
    {
      year: "2019",
      month: "12",
      day: "02",
      rainfallInMicrometers: 200,
    },
  ];

  if (!parseResult.success) {
    throw new Error("Expect parse result to be successful");
  }
  const { weatherMeasurements } = parseResult;

  it("parses each row correctly", () => {
    for (const [index, measurement] of weatherMeasurements.entries()) {
      const expectedMeasurement = expectedResults[index];
      expect(measurement.year).toEqual(expectedMeasurement.year);
      expect(measurement.month).toEqual(expectedMeasurement.month);
      expect(measurement.day).toEqual(expectedMeasurement.day);
      expect(measurement.rainfallInMicrometers).toEqual(
        expectedMeasurement.rainfallInMicrometers,
      );
    }
  });
});
