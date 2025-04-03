import {
  groupMeasurementsByMonth,
  WeatherMeasurementWithRainfall,
} from "../weather-measurement.js";
import {
  createMonthlyAggregation,
  MonthlyAggregation,
} from "./create-monthly-aggregation.js";

export type YearlyAggregation = {
  year: string;
  firstMeasurementDate: string;
  lastMeasurementDate: string;
  totalRainfallInMillimeters: number;
  averageRainfallInMillimeters: number;
  totalDaysWithRainfall: number;
  totalDaysWithoutRainfall: number;
  monthlyAggregations: MonthlyAggregation[];
};

export function createYearlyAggregation(
  year: string,
  measurements: WeatherMeasurementWithRainfall[],
): YearlyAggregation {
  const monthlyMeasurements = groupMeasurementsByMonth(measurements);
  return {
    year,
    firstMeasurementDate: "TODO",
    lastMeasurementDate: "TODO",
    totalRainfallInMillimeters: 0,
    averageRainfallInMillimeters: 0,
    totalDaysWithRainfall: 0,
    totalDaysWithoutRainfall: 0,
    monthlyAggregations: Object.keys(monthlyMeasurements).map((month) =>
      createMonthlyAggregation(monthlyMeasurements[month]),
    ),
  };
}
