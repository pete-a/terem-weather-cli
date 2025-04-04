import fs from "node:fs";
import readline from "node:readline";
import { parseWeatherCsvData } from "./csv/parse-weather-csv.js";
import { isWeatherMeasurementWithRainfall } from "./weather-measurement.js";
import { aggregateMeasurements } from "./aggregation/aggregate-measurements.js";
import { formatDataToJsonFormat } from "./formatting/mappings.js";
import fsAsync from "node:fs/promises";

type RunCliResult =
  | { success: true; message: string }
  | { success: false; error: string };

export async function runApplication(
  csvInputPath: string,
  jsonOutputPath: string,
): Promise<RunCliResult> {
  try {
    const fileStream = fs.createReadStream(csvInputPath);
    const readlineInterface = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    const result = await parseWeatherCsvData(readlineInterface);

    if (!result.success) {
      return result;
    }

    const measurements = result.weatherMeasurements;
    const measurementsWithRainfall = measurements.filter(
      isWeatherMeasurementWithRainfall,
    );

    const data = aggregateMeasurements(measurementsWithRainfall);
    const formattedData = formatDataToJsonFormat(data);

    await fsAsync.writeFile(
      jsonOutputPath,
      JSON.stringify(formattedData, null, 2),
    );
    return { success: true, message: `JSON written to: ${jsonOutputPath}` };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

type ParseArgsResult =
  | { type: "success"; csvInputPath: string; jsonOutputPath: string }
  | { type: "error"; error: string }
  | { type: "help"; message: string };

export async function parseArgs(args: string[]): Promise<ParseArgsResult> {
  if (args.length === 0) {
    return {
      type: "help",
      message:
        "=== TEREM WEATHER CLI ===\nUsage: npm start <csv-input-path> <json-output-path>",
    };
  }

  const csvInputPath = args[0];
  try {
    await fsAsync.access(csvInputPath);
  } catch {
    return {
      type: "error",
      error: `Could not find CSV input file: ${csvInputPath}`,
    };
  }

  const jsonOutputPath = args[1];
  if (jsonOutputPath === undefined || jsonOutputPath === "") {
    return {
      type: "error",
      error: "Missing JSON output path",
    };
  }

  return {
    type: "success",
    csvInputPath,
    jsonOutputPath,
  };
}
