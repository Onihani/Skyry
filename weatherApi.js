const apiKey = "7c72c4660455669edf14877fb6257619";
const apiBaseUrl = "https://api.openweathermap.org/data/2.5/onecall";
const apiSearchUrl = "http://api.openweathermap.org/data/2.5/weather?q=";

// One Call Api Docs (Open Weather)
/* https://openweathermap.org/api/one-call-api */

// API call Example:
/* https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={YOUR API KEY} */

function generateApiUrl(lat, lon, exclude, appid = apiKey) {
  const hasExcludes = exclude ? `&exclude=${exclude}` : "";
  return `${apiBaseUrl}?lat=${lat}&lon=${lon}${hasExcludes}&appid=${apiKey}`;
}

// get weather data for current user location
async function getUserWeatherData(coords) {
  // fetch weather data here
  const { lat, lon } = coords;
  const weatherUrl = generateApiUrl(lat, lon, null);
  try {
    const response = await fetch(weatherUrl);
    const json = await response.json();

    // storing weather data to localstorage
    let skyryData = localStorage.skyryData;
    if (skyryData) {
      skyryData = JSON.parse(skyryData);
      if (skyryData.length == 10) {
        skyryData.shift()
      }
      skyryData.push(json);
      localStorage.skyryData = JSON.stringify(skyryData);
    } else {
      skyryData = [json];
      localStorage.skyryData = JSON.stringify(skyryData);
    }

    return json;
  } catch (error) {
    console.log(error)
    return { error: error };
  }
}

async function getWeatherForLocation(location) {
  // fetch weather Data For Searched Location
  try {
    const searchResponse = await fetch(
      `${apiSearchUrl}${location}&appid=${apiKey}`
    );
    const searchJson = await searchResponse.json();
    console.log(searchJson);

    if (searchJson.cod == 200) {
      const weatherData = await getUserWeatherData(searchJson.coord);
      return weatherData;
    } else {
      return searchJson;
    }
  } catch (error) {
    return { error: error };
  }
}

export { getUserWeatherData, getWeatherForLocation };
