var country_name = document.querySelector('.card-title');
var country_weather = document.querySelector('.card-text')
var select = document.querySelector('#selecting')
var count = 1
class Weather {
    constructor() {
        this.url = `https://api.openweathermap.org/data/2.5/weather`;
        this.key = `839813254c752e5692eeb7ec6591a83e`;
    }
    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(successFunction)
        }
        self = this;
        function successFunction(position) {
            var lat = position.coords.latitude;
            var long = position.coords.longitude;
            self.displayFunction(self.getPosition(lat, long))
        }
    }
    autoSelect(url) {
        fetch(url)
            .then(response => response.json())
            .then(res => {
                select.innerHTML = `<option value="" disabled selected>Choose your country</option>`
                res.forEach((element, index) => {
                    select.innerHTML += `<option value='${element.name}'>${element.name} (${element.alpha2Code})</option>`
                });
            })
    }
    getPosition(...positions) {
        if (positions.length == 2) {
            return `${this.url}?lat=${positions[0]}&lon=${positions[1]}&appid=${this.key}`
        }
        else {
            return `${this.url}?q=${positions[0]}&appid=${this.key}`;
        }
    }
    displayFunction(url) {
        try {
            fetch(url)
            .then(response => response.json())
            .then(resp => {
                if (resp.message == "city not found") {
                    document.querySelector('.absolute-div').classList.remove('d-none')
                    document.querySelector('.icon-div').classList.add('addremove')
                }
                else {
                    country_name.innerHTML = `<span class="country_name_1">${resp.name}</span> <span class="country_name">(${resp.sys.country})</span>`
                    document.getElementById('flag').setAttribute('src', `https://www.countryflags.io/${resp.sys.country}/shiny/64.png`)
                    country_weather.innerHTML = `${Math.round(273.15 - resp.main.temp)}°`;
                    // country_weather.insertAdjacentText('beforeend',`${273.15 - resp.main.temp_min}/${ 273.15 - resp.main.temp_max}`)
                    document.getElementById('icon').setAttribute('src', `http://openweathermap.org/img/wn/${resp.weather[0].icon}@2x.png`);
                    document.querySelector('.first').innerHTML = `<i class="fas fa-temperature-high">
                    </i> ${resp.main.pressure} hpa`;
                    document.querySelector('.second').innerHTML = `<i class="fas fa-tint"></i> ${resp.main.humidity} %`;
                    document.querySelector('.third').innerHTML = `<i class="fas fa-tachometer-alt"></i>${resp.wind.speed} m/s`
                    if (count <= 8) {
                        document.body.style.backgroundImage = `url('./img/${count}.jpg')`
                        count = count + 1;
                    }
                    else {
                        count = 1;
                    }
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
}

var weather = new Weather()
document.addEventListener('DOMContentLoaded', function () {
    document.body.style.backgroundImage = `url('./img/${count}.jpg')`
    weather.getLocation();
    weather.autoSelect(`https://restcountries.eu/rest/v2/all`)
})

document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault()
    if (select.value) {
        weather.displayFunction(weather.getPosition(select.value))
    }
})
document.querySelector('.cancel').addEventListener('click',function(){
    document.querySelector('.absolute-div').classList.add('d-none')
    document.querySelector('.icon-div').classList.remove('addremove')
})