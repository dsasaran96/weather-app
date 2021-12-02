import './style.css';

let weather = {
    apiKey: 'e3af2ea00e42cd06165f0bd4b145815d',
    fetchWeather: function (city) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}`)
        .then((response) => response.json())
        .then((data) => this.displayWeather(data));
    },
    fetchWeatherByCoords: function(long, lat) {
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
        document.querySelector('.temp').innerText = `${Math.floor(temp)}`
        document.querySelector('.humidity').innerText = `Humidity: ${humidity}%`;
        document.querySelector('.wind').innerText = `Wind speed: ${speed} km/h`;
        document.querySelector('.weather').classList.remove("loading");
    },
    search: function() {
        this.fetchWeather(document.querySelector(".search-bar").value, unit);
        document.querySelector(".search-bar").value = "";
    }
}

let unit = 'c';

document.getElementById('temp-box')
        .addEventListener('click', function() {
            let temp = document.querySelector('.temp');
            document.getElementById('cels').classList.toggle('active');
            document.getElementById('cels').classList.toggle('inactive');
            document.getElementById('fahr').classList.toggle('active');
            document.getElementById('fahr').classList.toggle('inactive');
            switch(unit) {
                case 'c':
                    unit = 'f';
                    break;
                case 'f':
                    unit = 'c';
                    break;
            }
            if(unit==='c') {
                temp.innerText = Math.floor((temp.innerText-32)*5/9);
            } else {
                temp.innerText = Math.ceil(temp.innerText*9/5+32);
            }
        })

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

function getLocation() {
    navigator.geolocation.getCurrentPosition(showPos, showError);
}

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

function showPos(position) {
    const long = position.coords.longitude;
    const lat = position.coords.latitude;

    weather.fetchWeatherByCoords(long, lat);
}

getLocation();

