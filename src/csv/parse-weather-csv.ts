import { makeCsvHeader } from "./csv-header.ts";
import { CsvRow, makeCsvRow } from "./csv-row.ts";
import {
  WeatherDataColumn,
  weatherDataColumns,
} from "./weather-data-columns.ts";
import { WeatherMeasurement } from "../weather-measurement.ts";

type ParseWeatherCsvDataResult =
  | {
      success: true;
      weatherMeasurements: WeatherMeasurement[];
    }
  | { success: false; error: string };

export async function parseWeatherCsvData(
  rowsIterator: AsyncIterable<string>,
): Promise<ParseWeatherCsvDataResult> {
  const weatherMeasurements: WeatherMeasurement[] = [];

  const headerRowString: string = (
    await rowsIterator[Symbol.asyncIterator]().next()
  ).value;

  const csvHeaderResult = makeCsvHeader(headerRowString, weatherDataColumns);
  if (!csvHeaderResult.success) {
    return {
      success: false,
      error: "Error while parsing CSV header: " + csvHeaderResult.error,
    };
  }

  const { csvHeader } = csvHeaderResult;

  let rowNumber = 1;
  for await (const rowString of rowsIterator) {
    rowNumber++;
    if (rowString.length === 0) {
      continue;
    }

    const csvRow = makeCsvRow(rowString, csvHeader);
    const processResult = await processCsvRow(csvRow);

    if (!processResult.success) {
      return {
        success: false,
        error: `Error processing row ${rowNumber}: ${processResult.error}`,
      };
    }
    weatherMeasurements.push(processResult.measurement);
  }

  return {
    success: true,
    weatherMeasurements,
  };
}

type ProcessCsvRowResult =
  | {
      success: true;
      measurement: WeatherMeasurement;
    }
  | { success: false; error: string };

async function processCsvRow(
  csvRow: CsvRow<WeatherDataColumn>,
): Promise<ProcessCsvRowResult> {
  const year = csvRow["Year"];
  const month = csvRow["Month"];
  const day = csvRow["Day"];

  if (year === undefined || month === undefined || day === undefined) {
    return {
      success: false,
      error: `Invalid date row (${year}-${month}-${day})`,
    };
  }

  const rainfallString = csvRow["Rainfall amount (millimetres)"];
  const rainfallInMillimeters = !rainfallString
    ? null
    : parseFloat(rainfallString);

  if (Number.isNaN(rainfallInMillimeters)) {
    return {
      success: false,
      error: "Rainfall amount (millimetres) value is not a valid number",
    };
  }

  return {
    success: true,
    measurement: {
      year,
      month,
      day,
      rainfallInMicrometers: rainfallInMillimeters
        ? Math.round(rainfallInMillimeters * 1000)
        : null,
    },
  };
}
