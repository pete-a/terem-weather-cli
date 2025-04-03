import fs from "node:fs";
import fsAsync from "node:fs/promises";
import readline from "node:readline";
import { parseWeatherCsvData } from "./csv/parse-weather-csv.ts";
import { isWeatherMeasurementWithRainfall } from "./weather-measurement.ts";
import { aggregateMeasurements } from "./aggregation/aggregate-measurements.ts";

const inputPath = "data/IDCJAC0009_066062_1800_Data.csv";
const outputPath = "data/output.json";

async function run() {
  const fileStream = fs.createReadStream(inputPath);
  const readlineInterface = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const result = await parseWeatherCsvData(readlineInterface);

  if (!result.success) {
    console.error(result.error);
    process.exit(1);
  }

  const measurements = result.weatherMeasurements;
  const measurementsWithRainfall = measurements.filter(
    isWeatherMeasurementWithRainfall,
  );

  const data = aggregateMeasurements(measurementsWithRainfall);

  await fsAsync.writeFile(outputPath, JSON.stringify(data, null, 2));
  console.log(`JSON written to ${outputPath}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
