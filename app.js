const stationID = "172718"
const token = "44d18b63-f6c1-4b2e-b1bd-f50254360fd1"



async function loadWeather(){

const response = await fetch(
`https://swd.weatherflow.com/swd/rest/observations/station/${stationID}?token=${token}`
)

const data = await response.json()

const obs = data.obs[0]


const tempC = obs.air_temperature
const temp = Math.round((tempC * 9/5) + 32)

document.getElementById("temp").innerText = temp


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
obs.solar_radiation + " W/m²"


document.getElementById("rain").innerText =
obs.precip + " in"

}



async function loadHourly(){

const res = await fetch(
`https://swd.weatherflow.com/swd/rest/better_forecast?station_id=${stationID}&token=${token}`
)

const data = await res.json()

const hours = data.forecast.hourly.slice(0,12)

let html=""

hours.forEach(h => {

const date = new Date(h.time * 1000)

const hour = date.getHours()

const tempF = Math.round((h.air_temperature * 9/5) + 32)

html += `
<div class="hour">

<div class="hour-time">${hour}:00</div>

<div class="hour-icon">☀️</div>

<div class="hour-temp">${tempF}°</div>

</div>
`

})

document.getElementById("hourly").innerHTML = html

}



function buildForecast(){

const days=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

let html=""

for(let i=1;i<=7;i++){

const d=new Date()
d.setDate(d.getDate()+i)

html+=`
<div class="day">
<div>${days[d.getDay()]}</div>
<div>☀️</div>
<div>-- / --</div>
</div>
`
}

document.getElementById("forecast").innerHTML=html

}



function updateTime(){

const now = new Date()

document.getElementById("date").innerText =
now.toLocaleString()

}



loadWeather()
loadHourly()
buildForecast()
updateTime()


setInterval(loadWeather,60000)
setInterval(updateTime,1000)
setInterval(loadHourly,3600000)