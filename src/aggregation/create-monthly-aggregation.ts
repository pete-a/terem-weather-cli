import {
  dateStringOfMeasurement,
  sortMeasurementsByDate,
  WeatherMeasurementWithRainfall,
} from "../weather-measurement.ts";

export type MonthlyAggregation = {
  firstMeasurementDate: string;
  lastMeasurementDate: string;
  totalRainfallInMillimeters: number;
  averageRainfallInMillimeters: number;
  medianRainfallInMillimeters: number;
  totalDaysWithRainfall: number;
  totalDaysWithoutRainfall: number;
};

export function createMonthlyAggregation(
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
    totalRainfallInMillimeters: totalRainfall / 1000,
    averageRainfallInMillimeters: averageRainfall / 1000,
    medianRainfallInMillimeters: medianRainfall / 1000,
    firstMeasurementDate: dateStringOfMeasurement(firstMeasurement),
    lastMeasurementDate: dateStringOfMeasurement(lastMeasurement),
    totalDaysWithRainfall,
    totalDaysWithoutRainfall,
  };
}

function calculateTotalRainfall(
  measurements: WeatherMeasurementWithRainfall[],
): number {
  return measurements.reduce(
    (acc, measurement) => acc + measurement.rainfallInMicrometers,
    0,
  );
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

function calculateTotalDaysWithRainfall(
  measurements: WeatherMeasurementWithRainfall[],
): number {
  return measurements.filter(
    (measurement) => measurement.rainfallInMicrometers > 0,
  ).length;
}

function calculateFirstAndLastMeasureMeasurement(
  measurements: WeatherMeasurementWithRainfall[],
) {
  measurements.sort(sortMeasurementsByDate);
  const firstMeasurement = measurements[0];
  const lastMeasurement = measurements[measurements.length - 1];
  return { firstMeasurement, lastMeasurement };
}
