import "./components/current-weather-card.js";
import "./components/weekly-weather-card.js";
import "./components/alertModal.js";

const main = document.querySelector("main");

const renderCurrentWeather = (weatherData) => {
  // /*  currentWeatherData is an Object */
  const currentWeatherData = {
    current: weatherData.current,
    hourly: weatherData.hourly.splice(
      new Date(weatherData.current.dt).getHours(),
      7
    ),
    timezone: weatherData.timezone,
  };

  // checking for existing current weather card node in the DOM
  const existingCurrentWeatherCard = document.querySelector(
    "current-weather-card"
  );

  // creating a new current weather card with provided "currentWeatherData"
  const currentWeatherCardElem = document.createElement("current-weather-card");
  currentWeatherCardElem.weatherData = currentWeatherData;
  if (existingCurrentWeatherCard) {
    main.querySelector('.current').replaceChild(currentWeatherCardElem, existingCurrentWeatherCard);
  } else {
    main.querySelector('.current').prepend(currentWeatherCardElem);
  }
};

const renderWeeklyWeather = (weatherData) => {
  /* weeklyWeatherData is an array */
  const weeklyWeatherData = weatherData.daily.slice(0, 6);

  // checking for existing weekly weather card node in DOM
  const existingWeeklyWeatherCard = document.querySelector(
    "weekly-weather-card"
  );

  // creating a new current weather card with provided "weeklyWeatherData"
  const weeklyWeatherCardElem = document.createElement("weekly-weather-card");
  weeklyWeatherCardElem.weatherData = weeklyWeatherData;
  if (existingWeeklyWeatherCard) {
    main.querySelector('.daily').replaceChild(weeklyWeatherCardElem, existingWeeklyWeatherCard);
  } else {
    main.querySelector('.daily').append(weeklyWeatherCardElem);
  }
};

const renderAlert = (content) => {
  const alert = document.createElement("alert-dialog");
  alert.content = content;

  const existingMlert = document.querySelector("alert-dialog");
  if (existingMlert) {
    existingMlert.remove();
  }

  document.querySelector("main.container").prepend(alert);
};

const removeAlert = () => {
  const activeAlert = document.querySelector("alert-dialog");
  if (activeAlert) {
    activeAlert.remove()
  }
}

export { renderCurrentWeather, renderWeeklyWeather, renderAlert, removeAlert };
