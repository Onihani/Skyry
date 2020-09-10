class CurrentWeatherCard extends HTMLElement {
  constructor () {
    super();
    // this.root = this.attachShadow({mode: "open"})
  }

  set weatherData(data) {
    const { current, hourly } = data;
    let hoursTabs = '';
    let hoursData = '';
    hourly.map((hData, index) => {
      let hour = new Date().getHours() + index + 1;
      hoursTabs += `
        <li class="nav-item" role="presentation">
          <a class="nav-link ${!index ? 'active' : ''}" id="hourtab${index+1}" data-toggle="tab" href="#hour${index+1}" role="tab" aria-controls="hour${index+1}" aria-selected="true">${hour > 24 ? hour - 24 : hour > 12 ? hour - 12 : hour == 0 ? 12 : hour} ${hour > 23 ? "AM" : hour >= 12 ? "PM" : "AM"}</a>
        </li>
      `;
      hoursData += `
        <div class="tab-pane fade ${!index ? 'show active' : ''}" id="hour${index+1}" role="tabpanel" aria-labelledby="hour${index+1}">
          <div class="hour-info text-center">
            <img src="http://openweathermap.org/img/wn/${hData.weather[0].icon}.png" alt="weather condition icon">
            <h4 class="m-0">${Math.round((hData.temp - 273).toFixed(1))}&deg;C</h4>
            <p class="m-0 lead">${hData.weather[0].description}</p>
          </div>
        </div>
      `;
    })
    const date = new Date();
    this.innerHTML = `
    <!-- Current Weather Area Start -->
    <div class="current-weather-card card text-white mb-5">
      <div class="card-header">
        <div class="row">
          <div class="col-md-6 text-center text-md-left">
            <div class="user-date-time">
              <div class="time">${date.getHours() > 12 ? date.getHours() - 12 : date.getHours() == 0 ? 12 : date.getHours()}:${date.getMinutes()} ${date.getHours() >= 12 ? 'pm' : 'am'}</div>
              <div class="date">${date.toLocaleString('default', {  weekday: 'long' })} ${date.toLocaleString('default', { month: 'long' })} ${date.getDate()}, ${date.getFullYear()}</div>
            </div>
            <div class="current-area-temp">
              <h1 class="m-0">${Math.round((current.temp - 273).toFixed(1))}&deg;C</h1>
              <p class="m-0">Feels Like ${Math.round((current.feels_like - 273).toFixed(1))}&deg;C • Sunset ${new Date(current.sunset).getHours()}:${new Date(current.sunset).getMinutes()}</p>
            </div>
          </div>
          <div class="col-md-6 text-center text-md-right p-sm-3">
            <div class="icon-date-area">
              <img src="http://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png" lalt="weather condition icon" width="100px" height="100px">
              <h5 class="m-0 text-capitalize">${current.weather[0].description}</h5>
              <h4 class="m-0">${data.timezone}</h4>
            </div>
          </div>
        </div>
      </div>
      <div class="card-body py-1 px-2 text-white">
        <div class="weather-info">
          <ul class="list-group list-group-flush">
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <strong>Wind</strong>
              <span>${current.wind_speed} m/s</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <strong>Visibility</strong>
              <span>${(current.visibility / 1000).toFixed(1)} km</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <strong>cloudiness</strong>
              <span>${current.clouds} %</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <strong>Humidity</strong>
              <span>${current.humidity} %</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="card-footer hourly-weather-info">
        <ul class="nav nav-tabs" id="myTab" role="tablist">
          ${hoursTabs}
        </ul>
        <div class="tab-content" id="myTabContent">
          ${hoursData}
        </div>
      </div>
    </div>
    <!-- Current Weather Area End -->
    `;
  }
}

// registering custom Element
customElements.define("current-weather-card", CurrentWeatherCard);