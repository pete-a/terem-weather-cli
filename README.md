# Terem Weather CLI
## 🏗️ Setup
- Node.js v20 or later is required
- `cd` into the project
- run `npm install`
- run `npm run build`

## 🏃Running the application

`npm start <csv-input-path> <json-output-path>`

### Example
```
npm start ./data/input.csv ./output.json
```

## 📘 Examples and documents
- The test's instructions are located at `instructions.pdf`
- An example JSON output is located at `data/example-output.json`

## ⚠️ Assumptions 
### JSON structure
The instructions state:

> NOTE: The above snippet is only showing the sample output for January of 2019, the expected sample output
would have data for _**all recorded years and all months**_.

However, the example JSON structure is a single object that doesn't allow for representing multiple years or months:

```json
{
  "WeatherData": {
    "WeatherDataForYear": {
      "Year": "2019",
      ...
      "MonthlyAggregates": {
        "WeatherDataForMonth": {
          ...
        }
      }
    }
  }
}
```
I have made the assumption the `WeatherDataForYear` and `WeatherDataForMonth` properties are placeholders for the year / month value:
```json
{
  "WeatherData": {
    "2019": {
      "Year": "2019",
      ...
      "MonthlyAggregates": {
        "2019-01": {
          ...
        }
      }
    }
  }
}
```

Also, the structure indicated numbers should be returns as strings:

```json
{
  ...
  "AverageDailyRainfall": "1.574193548",
  "DaysWithNoRainfall": "21",
  "DaysWithRainfall": "10"
  ...
}
```

I have decided to follow the standard practice of representing these values as numbers:

```json
{
  "AverageDailyRainfall": 1.574193548,
  "DaysWithNoRainfall": 21,
  "DaysWithRainfall": 10
}

```
### Rainfall data
- I am assuming that dates with no rainfall data are not included in the 'Days with/without rainffall' properties.
- If there is a date with missing data, it will stop any 'Longest number days raining' streak

### Measurement period
There is one recording (26 April 2008) where the 'Period over which rainfall was measured (days)' is two days and not one.
There are no instructions on how to treat this data, e.g. should the total rainfall be split 50/50 on 25th and 26th? 
But how to we know if 10% of the rainfall was on the 25th and 90% on 26th? With no other information, I am assuming that
recording date should be determined to have received all the rainfall.


