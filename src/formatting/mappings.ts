import { MonthlyAggregation } from "../aggregation/create-monthly-aggregation.ts";
import { YearlyAggregation } from "../aggregation/create-yearly-aggregation.ts";

export function formatDataToJsonFormat(data: YearlyAggregation[]) {
  const formattedData = data.reduce((acc, yearlyData) => {
    const yearFormatted = mapYearlyAggregationDataToJsonFormat(yearlyData);
    return {
      ...acc,
      [yearlyData.year]: yearFormatted,
    };
  }, {});

  return {
    WeatherData: formattedData,
  };
}

function mapYearlyAggregationDataToJsonFormat(data: YearlyAggregation) {
  return {
    Year: data.year,
    FirstRecordedDate: data.firstMeasurementDate,
    LastRecordedDate: data.lastMeasurementDate,
    TotalRainfall: data.totalRainfallInMillimeters,
    AverageRainfall: data.averageRainfallInMillimeters,
    DaysWithNoRainfall: data.totalDaysWithoutRainfall,
    DaysWithRainfall: data.totalDaysWithRainfall,
    LongestRainingStreak: data.longestRainingStreakInDays,
    MonthlyAggregates: formatMonthlyAggregationData(data.monthlyAggregations),
  };
}

function formatMonthlyAggregationData(monthlyData: MonthlyAggregation[]) {
  return monthlyData.reduce((acc, aggregation) => {
    const data = mapMonthlyAggregationDataToJsonFormat(aggregation);
    return {
      ...acc,
      [aggregation.monthDate]: data,
    };
  }, {});
}

function mapMonthlyAggregationDataToJsonFormat(data: MonthlyAggregation) {
  return {
    Month: monthHumanNameFromNumber(data.monthNumber),
    FirstRecordedDate: data.firstMeasurementDate,
    LastRecordedDate: data.lastMeasurementDate,
    TotalRainfall: data.totalRainfallInMillimeters,
    AverageDailyRainfall: data.averageRainfallInMillimeters,
    MedianDailyRainfall: data.medianRainfallInMillimeters,
    DaysWithNoRainfall: data.totalDaysWithoutRainfall,
    DaysWithRainfall: data.totalDaysWithRainfall,
  };
}

const humanMonthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function monthHumanNameFromNumber(month: number) {
  return humanMonthNames[month - 1];
}
