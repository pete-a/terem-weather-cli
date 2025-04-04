import { format as formatDate, addDays, parseISO } from "date-fns";

import {
  dateStringOfMeasurement,
  groupMeasurementsByMonth,
  WeatherMeasurementWithRainfall,
} from "../weather-measurement.ts";
import {
  createMonthlyAggregation,
  MonthlyAggregation,
} from "./create-monthly-aggregation.ts";
import {
  calculateFirstAndLastMeasureMeasurement,
  calculateTotalDaysWithRainfall,
  calculateTotalRainfall,
} from "./shared-calculations.ts";

export type YearlyAggregation = {
  year: string;
  firstMeasurementDate: string;
  lastMeasurementDate: string;
  totalRainfallInMillimeters: number;
  averageRainfallInMillimeters: number;
  totalDaysWithRainfall: number;
  totalDaysWithoutRainfall: number;
  longestRainingStreakInDays: number;
  monthlyAggregations: MonthlyAggregation[];
};

export function createYearlyAggregation(
  year: string,
  measurements: WeatherMeasurementWithRainfall[],
): YearlyAggregation {
  const monthlyMeasurements = groupMeasurementsByMonth(measurements);
  const longestRainingStreakInDays =
    calculateLongestRainingStreak(measurements);

  const totalRainfall = calculateTotalRainfall(measurements);
  const averageRainfall = totalRainfall / measurements.length;

  const totalDaysWithRainfall = calculateTotalDaysWithRainfall(measurements);
  const totalDaysWithoutRainfall = measurements.length - totalDaysWithRainfall;

  const { firstMeasurement, lastMeasurement } =
    calculateFirstAndLastMeasureMeasurement(measurements);

  return {
    year,
    firstMeasurementDate: dateStringOfMeasurement(firstMeasurement),
    lastMeasurementDate: dateStringOfMeasurement(lastMeasurement),
    totalRainfallInMillimeters: totalRainfall / 1000,
    averageRainfallInMillimeters: averageRainfall / 1000,
    totalDaysWithRainfall,
    totalDaysWithoutRainfall,
    longestRainingStreakInDays,
    monthlyAggregations: Object.keys(monthlyMeasurements)
      .map((month) =>
        createMonthlyAggregation(year, month, monthlyMeasurements[month]),
      )
      .sort((a, b) => a.monthNumber - b.monthNumber),
  };
}

function calculateLongestRainingStreak(
  measurements: WeatherMeasurementWithRainfall[],
) {
  let previousDate: Date | null = null;
  let currentStreak = 0;
  let longestStreak = 0;

  for (const measurement of measurements) {
    const measurementDate = parseISO(dateStringOfMeasurement(measurement));
    const dayBeforeMeasurementDate = addDays(measurementDate, -1);

    const isSubsequentDay = previousDate
      ? formatDate(dayBeforeMeasurementDate, "yyyy-MM-dd") ===
        formatDate(previousDate, "yyyy-MM-dd")
      : true;

    if (measurement.rainfallInMicrometers > 0 && isSubsequentDay) {
      currentStreak++;
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
    } else {
      currentStreak = 0;
    }

    previousDate = measurementDate;
  }
  return longestStreak;
}
