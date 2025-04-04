import {
  dateStringOfMeasurement,
  WeatherMeasurementWithRainfall,
} from "../weather-measurement.ts";
import {
  calculateFirstAndLastMeasureMeasurement,
  calculateTotalDaysWithRainfall,
  calculateTotalRainfall,
} from "./shared-calculations.ts";

export type MonthlyAggregation = {
  monthDate: string;
  monthNumber: number;
  firstMeasurementDate: string;
  lastMeasurementDate: string;
  totalRainfallInMillimeters: number;
  averageRainfallInMillimeters: number;
  medianRainfallInMillimeters: number;
  totalDaysWithRainfall: number;
  totalDaysWithoutRainfall: number;
};

export function createMonthlyAggregation(
  year: string,
  month: string,
  weatherMeasurements: WeatherMeasurementWithRainfall[],
): MonthlyAggregation {
  const totalRainfall = calculateTotalRainfall(weatherMeasurements);
  const averageRainfall = totalRainfall / weatherMeasurements.length;
  const medianRainfall = calculateMedianRainfall(weatherMeasurements);
  const totalDaysWithRainfall =
    calculateTotalDaysWithRainfall(weatherMeasurements);
  const totalDaysWithoutRainfall =
    weatherMeasurements.length - totalDaysWithRainfall;

  const { firstMeasurement, lastMeasurement } =
    calculateFirstAndLastMeasureMeasurement(weatherMeasurements);

  return {
    monthDate: `${year}-${month}`,
    monthNumber: parseInt(month),
    totalRainfallInMillimeters: totalRainfall / 1000,
    averageRainfallInMillimeters: averageRainfall / 1000,
    medianRainfallInMillimeters: medianRainfall / 1000,
    firstMeasurementDate: dateStringOfMeasurement(firstMeasurement),
    lastMeasurementDate: dateStringOfMeasurement(lastMeasurement),
    totalDaysWithRainfall,
    totalDaysWithoutRainfall,
  };
}

function calculateMedianRainfall(
  measurements: WeatherMeasurementWithRainfall[],
): number {
  const values = measurements
    .map((measurement) => measurement.rainfallInMicrometers)
    .sort();
  const middle = Math.floor(values.length / 2);
  if (values.length % 2 === 1) {
    return values[middle];
  }
  return (values[middle - 1] + values[middle]) / 2;
}
