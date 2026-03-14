const stationID = "172718"
const token = "44d18b63-f6c1-4b2e-b1bd-f50254360fd1"



/* CURRENT WEATHER */

async function loadWeather(){

const response = await fetch(
`https://swd.weatherflow.com/swd/rest/observations/station/${stationID}?token=${token}`
)

const data = await response.json()

const obs = data.obs[0]

const tempC = obs.air_temperature
const tempF = Math.round((tempC * 9/5) + 32)

document.getElementById("temp").innerText = tempF

const feels = Math.round((obs.air_temperature * 9/5) + 32)
document.getElementById("feels").innerText = feels

document.getElementById("humidity").innerText =
obs.relative_humidity + "%"

document.getElementById("wind").innerText =
Math.round(obs.wind_avg * 2.237) + " mph"

document.getElementById("pressure").innerText =
(obs.station_pressure * 0.02953).toFixed(2) + " inHg"

document.getElementById("uv").innerText =
obs.uv

document.getElementById("solar").innerText =
Math.round(obs.solar_radiation) + " W/m²"

document.getElementById("rain").innerText =
obs.precip + " in"

}



/* HOURLY FORECAST */

async function loadHourly(){

const res = await fetch(
`https://swd.weatherflow.com/swd/rest/better_forecast?station_id=${stationID}&token=${token}`
)

const data = await res.json()

const hours = data.forecast.hourly.slice(0,10)

let html = ""

const sunrise = data.forecast.daily[0].sunrise
const sunset = data.forecast.daily[0].sunset

hours.forEach((h,index) => {

const date = new Date(h.time * 1000)

const hour = date.getHours()

let hour12 = hour % 12
hour12 = hour12 ? hour12 : 12

const suffix = hour >= 12 ? "pm" : "am"

const tempF = Math.round((h.air_temperature * 9/5) + 32)

const cond = (h.icon || "").toLowerCase()

let isNight = h.time < sunrise || h.time > sunset

let icon = isNight ? "wi-night-clear" : "wi-day-sunny"

if(cond.includes("cloud"))
icon = isNight ? "wi-night-alt-cloudy" : "wi-day-cloudy"

if(cond.includes("partly"))
icon = isNight ? "wi-night-alt-partly-cloudy" : "wi-day-cloudy"

if(cond.includes("rain"))
icon = "wi-rain"

if(cond.includes("snow"))
icon = "wi-snow"


/* UPDATE MAIN ICON + CONDITIONS USING FIRST HOUR */

if(index === 0){

document.getElementById("weatherIcon").className =
`wi ${icon}`

document.getElementById("conditions").innerText =
h.conditions

}


html += `
<div class="hour">

<div class="hour-time">${hour12}${suffix}</div>

<div class="hour-icon">
<i class="wi ${icon}"></i>
</div>

<div class="hour-temp">${tempF}°</div>

<div class="hour-rain">${Math.round(h.precip_probability)}%</div>

</div>
`

})

document.getElementById("hourly").innerHTML = html


/* SUNRISE / SUNSET */

const sunriseTime = new Date(data.forecast.daily[0].sunrise * 1000)
const sunsetTime = new Date(data.forecast.daily[0].sunset * 1000)

document.getElementById("sunrise").innerText =
sunriseTime.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})

document.getElementById("sunset").innerText =
sunsetTime.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})

}



/* 7 DAY FORECAST */

async function buildForecast(){

const res = await fetch(
`https://swd.weatherflow.com/swd/rest/better_forecast?station_id=${stationID}&token=${token}`
)

const data = await res.json()

const days = data.forecast.daily.slice(1,8)

let html = ""

days.forEach(d => {

const date = new Date(d.day_start_local * 1000)

const day = date.toLocaleDateString('en-US',{weekday:'short'})

const highF = Math.round((d.air_temp_high * 9/5) + 32)
const lowF = Math.round((d.air_temp_low * 9/5) + 32)

const cond = (d.conditions || "").toLowerCase()

let icon = "wi-day-sunny"

if(cond.includes("cloud"))
icon = "wi-cloudy"

if(cond.includes("partly"))
icon = "wi-day-cloudy"

if(cond.includes("rain"))
icon = "wi-rain"

if(cond.includes("snow"))
icon = "wi-snow"

html += `
<div class="day">

<div>${day}</div>

<div class="day-icon">
<i class="wi ${icon}"></i>
</div>

<div>${highF}° / ${lowF}°</div>

</div>
`

})

document.getElementById("forecast").innerHTML = html

}



/* CLOCK */

function updateTime(){

const now = new Date()

document.getElementById("date").innerText =
now.toLocaleString()

}



/* INITIAL LOAD */

loadWeather()
loadHourly()
buildForecast()
updateTime()



/* AUTO REFRESH */

setInterval(loadWeather,60000)

setInterval(loadHourly,3600000)

setInterval(buildForecast,3600000)

setInterval(updateTime,1000)

if ("serviceWorker" in navigator) {
navigator.serviceWorker.register("sw.js")
.then(() => console.log("Service Worker Registered"))
}