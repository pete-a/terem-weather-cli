# Terem Weather CLI

## ⚠️ Please note
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
I have made the assumption the `WeatherDataForYear` and `WeatherDataForMonth` properties should actually be an array of 
objects, not a single object:
```json
{
  "WeatherData": {
    "WeatherDataForYear": [{
      "Year": "2019",
      ...
      "MonthlyAggregates": {
        "WeatherDataForMonth": [{
          ...
        }]
      }
    }]
  }
}
```

