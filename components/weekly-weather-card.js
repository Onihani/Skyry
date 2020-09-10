class WeeklyWeatherCard extends HTMLElement {
  constructor () {
    super();
  }

  set weatherData(data) {
    const today = new Date()
    let dailyCards = '';
    data.map((dayData, index) => {
      today.setDate(today.getDate() + 1)
      dailyCards += `
      <!-- Accordion item ${index+1} -->
      <div class="card shadow-1">
        <div id="heading${index+1}" class="card-header shadow-sm p-1 border-0">
          <h2 class="mb-0">
            <button type="button" data-toggle="collapse" data-target="#collapse${index+1}" aria-expanded="${!index ? 'true' : 'false'}" aria-controls="collapse${index+1}" class="btn btn-link text-white font-weight-bold text-uppercase collapsible-link">
              <div class="d-flex justify-content-between align-items-center">
                <p class="m-0 font-weight-bold">${today.toLocaleString('default', {  weekday: 'long' })}</p>
                <h6 class="m-0 mr-3">${Math.round((dayData.temp.max - 273).toFixed(1))}&deg;C / ${Math.round((dayData.temp.min - 273).toFixed(1))}&deg;C</h5>
              </div>
            </button>
          </h2>
        </div>
        <div id="collapse${index+1}" aria-labelledby="heading${index+1}" data-parent="#accordionExample" class="collapse ${!index ? 'show': ''}">
          <div class="card-body py-1 px-3 shadow-inner text-light">
            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex flex-column justify-content-center align-items-center">
                <img src="http://openweathermap.org/img/wn/${dayData.weather[0].icon}@2x.png" alt="weather condition icon">
                <p class="lead text-capitalize">${dayData.weather[0].description}</p>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <strong>Wind</strong>
                <span>${dayData.wind_speed} m/s</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <strong>Pressure</strong>
                <span>${dayData.pressure} hPa</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <strong>Humidity</strong>
                <span>${dayData.humidity} %</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <strong>cloudiness</strong>
                <span>${dayData.clouds} %</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- End -->
      `
    })
    this.innerHTML = `
    <!-- Weekly Waether Area Start -->
    <div class="weekly-weather-card card text-white">
      <div class="card-header">
        <h1 class="weekly-heading m-0">Weekly Forecast</h1>
      </div>
      <div class="card-body p-0">
        <!-- Accordion -->
        <div id="accordionExample" class="accordion border-0 shadow">
          ${dailyCards}
        </div>
        <!-- End -->
      </div>
    </div>
    <!-- Weekly Waether Area End -->
    `;
  }
}

// registering custom Element
customElements.define("weekly-weather-card", WeeklyWeatherCard);