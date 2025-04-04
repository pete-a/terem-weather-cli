import {
  sortMeasurementsByDate,
  WeatherMeasurementWithRainfall,
} from "../weather-measurement.ts";

export function calculateTotalRainfall(
  measurements: WeatherMeasurementWithRainfall[],
): number {
  return measurements.reduce(
    (acc, measurement) => acc + measurement.rainfallInMicrometers,
    0,
  );
}

export function calculateTotalDaysWithRainfall(
  measurements: WeatherMeasurementWithRainfall[],
): number {
  return measurements.filter(
    (measurement) => measurement.rainfallInMicrometers > 0,
  ).length;
}

export function calculateFirstAndLastMeasureMeasurement(
  measurements: WeatherMeasurementWithRainfall[],
) {
  measurements.sort(sortMeasurementsByDate);
  const firstMeasurement = measurements[0];
  const lastMeasurement = measurements[measurements.length - 1];
  return { firstMeasurement, lastMeasurement };
}
