export const weatherDataColumns = [
  "Product code",
  "Bureau of Meteorology station number",
  "Year",
  "Month",
  "Day",
  "Rainfall amount (millimetres)",
  "Period over which rainfall was measured (days)",
  "Quality",
] as const;

export type WeatherDataColumn = (typeof weatherDataColumns)[number];
