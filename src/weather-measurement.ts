export type WeatherMeasurement = {
  year: string;
  month: string;
  day: string;
  rainfallInMicrometers: number | null;
};

export type WeatherMeasurementWithRainfall = WeatherMeasurement & {
  rainfallInMicrometers: number;
};

export function isWeatherMeasurementWithRainfall(
  measurement: WeatherMeasurement,
): measurement is WeatherMeasurementWithRainfall {
  return measurement.rainfallInMicrometers !== null;
}

export function dateStringOfMeasurement({
  year,
  month,
  day,
}: WeatherMeasurement): string {
  return `${year}-${month}-${day}`;
}

export function sortMeasurementsByDate(
  a: WeatherMeasurement,
  b: WeatherMeasurement,
) {
  const aDate = dateStringOfMeasurement(a);
  const bDate = dateStringOfMeasurement(b);
  return aDate.localeCompare(bDate);
}

export function groupMeasurementsByYear<
  T extends WeatherMeasurement | WeatherMeasurementWithRainfall,
>(measurements: T[]): Record<string, T[]> {
  return measurements.reduce(
    (acc, measurement) => {
      const year = measurement.year;
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(measurement);
      return acc;
    },
    {} as Record<string, T[]>,
  );
}

export function groupMeasurementsByMonth<
  T extends WeatherMeasurement | WeatherMeasurementWithRainfall,
>(measurements: T[]): Record<string, T[]> {
  return measurements.reduce(
    (acc, measurement) => {
      const month = measurement.month;
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(measurement);
      return acc;
    },
    {} as Record<string, T[]>,
  );
}
