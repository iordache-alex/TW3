document.addEventListener('DOMContentLoaded', function () {
 initAutocomplete()
let units ="metric";

let cityInput = document.querySelector(".weather__searchform");
const weatherCardsDiv = document.querySelector(".weather-cards");
const currentWeatherDiv = document.querySelector(".weather__now");


function convertCountryCode(country) {
let regionNames = new Intl.DisplayNames(["en"],{type:"region"});
return regionNames.of(country);
}

function getWeather(cityName) {
   const API_KEY = '412e1a6fb8652f9129739aecd8405e45';
   fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=${units}`)
   .then (res => res.json())
   .then (data => {
    console.log(data);
    const country=convertCountryCode(data.city.country);
    document.body.style.backgroundImage =`url('https://source.unsplash.com/1980x1080/?${cityName}')`;
    const uniqueForecastDays = [];
    const fiveDaysForecast = data.list.filter(forecast => {
        const forecastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqueForecastDays.includes(forecastDate)) {
            return uniqueForecastDays.push(forecastDate);
        }
    });

    cityInput.value = "";
    currentWeatherDiv.innerHTML = "";
    weatherCardsDiv.innerHTML = "";

        fiveDaysForecast.forEach( (weatherItem, index) => {
            const html = createWeatherCard(cityName, weatherItem, index, country);
            if (index === 0) {
                console.log(weatherItem);
                currentWeatherDiv.insertAdjacentHTML("beforeend", html);
            } else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", html);
            }
        });   
   
   })
}

const createWeatherCard = (cityName, weatherItem, index, country) => {
    if(index === 0) { // HTML for the main weather card
        return `<div class="details">
                    <h2> ${cityName}, ${country} </h2>
                    <h3> (${weatherItem.dt_txt.split(" ")[0]})</h3>
                    <h4>Temperature: ${Math.ceil(weatherItem.main.temp)}°C</h4>
                    <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                </div>`;
    } else { // HTML for the other five day forecast card
        return `<li class="card">
                    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                    <h4>Temperature: ${Math.ceil(weatherItem.main.temp)}°C</h4>
                    <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                </li>`;
    }
}


const start = () => {
    let cityName = cityInput.value.trim();
    if (cityName === "") return;
    getWeather(cityName);
}

function initAutocomplete() {
    var input = document.getElementById('searchTextField');
    new google.maps.places.Autocomplete(input);
  }

cityInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
        start();
    }
});

});
