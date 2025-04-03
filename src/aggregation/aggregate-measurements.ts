import {
  groupMeasurementsByYear,
  sortMeasurementsByDate,
  WeatherMeasurementWithRainfall,
} from "../weather-measurement.ts";
import {
  createYearlyAggregation,
  YearlyAggregation,
} from "./create-yearly-aggregation.js";

export function aggregateMeasurements(
  measurements: WeatherMeasurementWithRainfall[],
): YearlyAggregation[] {
  measurements.sort(sortMeasurementsByDate);

  const measurementsByYear = groupMeasurementsByYear(measurements);

  const yearlyData: YearlyAggregation[] = [];
  for (const year of Object.keys(measurementsByYear)) {
    const yearlyMeasurements = measurementsByYear[year];
    yearlyData.push(createYearlyAggregation(year, yearlyMeasurements));
  }

  return yearlyData;
}
