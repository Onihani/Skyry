import { getUserWeatherData, getWeatherForLocation } from "./weatherApi.js";
import {
  renderCurrentWeather,
  renderWeeklyWeather,
  renderAlert,
  removeAlert,
} from "./renderComponents.js";

window.addEventListener("load", () => {
  const searchForm = document.querySelector("#searchForm");
  const requestGeoBtn = document.querySelector("#requestGeoBtn");
  const recentSearchesModal = document.querySelector("#recentSearchesModal");

  // adding eventListener for searchInput
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const searchInput = document.querySelector("#search");
    const searchedLocation = searchInput.value;

    if (requestGeoBtn) {
      requestGeoBtn.remove();
    }

    // init spinner
    renderAlert({
      color: "info",
      html: `
      <div class="spinner-border text-info" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <strong>Fetching Wether Data for ${searchedLocation}</strong>
      `,
      close: false,
    });

    getWeatherForLocation(searchedLocation)
      .then((weatherData) => {
        if (
          weatherData.error &&
          weatherData.error.message == "Failed to fetch"
        ) {
          renderAlert({
            color: "danger",
            html: `
            <strong>An Error Occured while fetching weather data</strong>, Seems you're offline
            `,
            close: true,
          });

          return;
        } else if (weatherData.cod && weatherData.cod != 200) {
          renderAlert({
            color: "danger",
            html: `
            <strong>City not found</strong> ...
            `,
            close: true,
          });

          return;
        } else if (weatherData.error) {
          renderAlert({
            color: "danger",
            html: `
            <strong>An Error Occured while fetching weather data</strong> ...
            `,
            close: true,
          });

          return;
        }

        renderCurrentWeather(weatherData);
        renderWeeklyWeather(weatherData);
        removeAlert();
      })
      .catch((err) => {
        console.log(err);
      });

    searchForm.reset();
  });

  // init getting weather data (for current user location)
  requestGeoBtn.addEventListener("click", getUserCoordinates);

  // adding eventListener for recent searches modal
  $('#recentSearchesModal').on('show.bs.modal', function (e) {
    const modalBody = recentSearchesModal.querySelector('.modal-body');
    const skyryData = localStorage.skyryData ? JSON.parse(localStorage.skyryData) : [];
    if (skyryData.length) {
      let buttonList = '';
      console.log(skyryData);
      skyryData.reverse().forEach((search, index) => {
        buttonList += `
        <button type="button" data-index="${index}" class="list-group-item list-group-item-action recentForecastBtn">
          ${search.timezone}
        </button>
        `
      })
      modalBody.innerHTML = `
      <p class="lead">Click on a list to view forecast</p>
      <div class="list-group list-group-flush shadow-inner">
        ${buttonList}
      </div>
      `;
    } else {
      modalBody.innerHTML = `<h2>No have no recent searches</h2>`
    }

    const viewRecentForecastButtons = document.querySelectorAll('.recentForecastBtn');
    console.log(viewRecentForecastButtons);
    viewRecentForecastButtons.forEach(button => {
      button.addEventListener('click', function (event) {
        const index = event.currentTarget.dataset.index;
        const skyryData = JSON.parse(localStorage.skyryData);
        
        if (requestGeoBtn) {
          requestGeoBtn.remove();
        }

        $('#recentSearchesModal').modal('hide')
        renderCurrentWeather(skyryData[(skyryData.length - 1)-index]);
        renderWeeklyWeather(skyryData[(skyryData.length - 1)-index]);
      })
    })

  })
  

  // init sw registration
  registerSW();
});

window.addEventListener("online", () => {
  // handle online
  removeAlert();
});

window.addEventListener("offline", () => {
  // handle offline
  renderAlert({
    color: "warning",
    html: `
    <strong>Network Disconnected:</strong> Offline Mode (Weather Searches data may be inaccurate)
    `,
    close: true,
  });
});

// registering service worker
function registerSW() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("sw.js")
      .then((registration) => {
        console.log("Service Worker Registered!!!");
        // console.log(registration);
      })
      .catch((error) => {
        console.log("Service Worker Registration Failed");
        console.log(error);
      });
  } else {
    console.log("Service Worker not available in Browser");
  }
}

// function to get user coords and render app data on first visit
function getUserCoordinates() {
  event.currentTarget.remove();

  // callback function to retrieve lattitude and longitude of user
  function retrieveCoords(position) {
    const coords = {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
    };

    renderAlert({
      color: "info",
      html: `
      <div class="spinner-border text-info" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <strong>Fetching Wether Data for your location</strong>
      `,
      close: false,
    });

    getUserWeatherData(coords)
      .then((weatherData) => {
        if (
          weatherData.error &&
          weatherData.error.message == "Failed to fetch"
        ) {
          renderAlert({
            color: "danger",
            html: `
            <strong>An Error Occured while fetching weather data</strong>, Seems you're offline
            `,
            close: true,
          });

          return;
        } else if (weatherData.error) {
          renderAlert({
            color: "danger",
            html: `
            <strong>An Error Occured while fetching weather data</strong> ...
            `,
            close: true,
          });

          return;
        }

        renderCurrentWeather(weatherData);
        renderWeeklyWeather(weatherData);
        removeAlert();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // callback function to handle error if getting coordinates fails
  function handleError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        renderAlert({
          color: "warning",
          html: `
          <strong>Location Permission Denied:</strong> Please search location manually from search bar
          `,
          close: true,
        });
        break;
      default:
        renderAlert({
          color: "warning",
          html: `
          <strong>An Error Occured:</strong> An error occured while accessing your location. Please search location manually from search bar
          `,
          close: true,
        });
        break;
    }
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(retrieveCoords, handleError);
  }

  // later change to toasting a message
  return null;
}
