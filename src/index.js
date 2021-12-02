import './style.css';

let weather = {
    apiKey: 'e3af2ea00e42cd06165f0bd4b145815d',
    fetchWeather: function (city, unit) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${this.apiKey}`)
        .then((response) => response.json())
        .then((data) => this.displayWeather(data));
    },
    fetchWeatherByCoords: function(long, lat, unit) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=${this.apiKey}`)
        .then((response) => response.json())
        .then((data) => this.displayWeather(data))
    },
    displayWeather: function(data) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        document.querySelector('.city').innerText = `Weather in ${name}`;
        document.querySelector('.icon').src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        document.querySelector('.description').innerText = description;
        document.querySelector('.temp').innerText = `${Math.floor(temp)}°C`
        document.querySelector('.humidity').innerText = `Humidity: ${humidity}%`;
        document.querySelector('.wind').innerText = `Wind speed: ${speed} km/h`;
        document.querySelector('.weather').classList.remove("loading");
        document.body.style.backgroundImage = `url(https://source.unsplash.com/1600x900/?${description.split(' ').join()})`;
    },
    search: function() {
        this.fetchWeather(document.querySelector(".search-bar").value, 'metric');
        document.querySelector(".search-bar").value = "";
    }
}

document.querySelector('.search button')
        .addEventListener('click', function() {
            weather.search();
        });

document.querySelector('.search-bar')
        .addEventListener('keyup', function(event) {
            if (event.key == "Enter") {
                weather.search();
            }
        })

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.")
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.")
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.")
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.")
            break;
    }
    weather.fetchWeather('Bucharest', 'metric');
}

function getLocation(positions) {
    const lat = positions.coords.latitude;
    const long = positions.coords.longitude;
    weather.fetchWeatherByCoords(long, lat, 'metric');
}

navigator.geolocation.getCurrentPosition(getLocation(positions), showError(error))