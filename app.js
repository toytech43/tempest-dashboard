const stationID = "172718"
const token = "44d18b63-f6c1-4b2e-b1bd-f50254360fd1"

let chart

async function loadWeather(){

const response = await fetch(
`https://swd.weatherflow.com/swd/rest/observations/station/${stationID}?token=${token}`
)

const data = await response.json()

const obs = data.obs[0]

const temp = Math.round(obs.air_temperature)

document.getElementById("temp").innerText = temp
document.getElementById("feels").innerText = temp

document.getElementById("humidity").innerText =
obs.relative_humidity + "%"

document.getElementById("wind").innerText =
obs.wind_avg + " mph"

document.getElementById("pressure").innerText =
obs.station_pressure + " mb"

document.getElementById("uv").innerText =
obs.uv

document.getElementById("visibility").innerText =
">10 mi"

document.getElementById("air").innerText =
"Good"

updateChart(temp)

}

function updateChart(temp){

const time = new Date().toLocaleTimeString()

if(!chart){

chart = new Chart(
document.getElementById("tempChart"),
{
type:'line',
data:{
labels:[time],
datasets:[{
data:[temp],
tension:.4
}]
},
options:{
plugins:{legend:{display:false}}
}
})

}else{

chart.data.labels.push(time)
chart.data.datasets[0].data.push(temp)

if(chart.data.labels.length>24){

chart.data.labels.shift()
chart.data.datasets[0].data.shift()

}

chart.update()

}

}

function buildForecast(){

const days=["Thu","Fri","Sat","Sun","Mon","Tue","Wed"]

let html=""

for(let d of days){

html+=`

<div class="day">
<div>${d}</div>
<div class="day-icon">☀️</div>
<div>65° / 50°</div>
</div>

`

}

document.getElementById("forecast").innerHTML=html

}

function updateTime(){

document.getElementById("date").innerText =
new Date().toLocaleString()

}

loadWeather()
buildForecast()
updateTime()

setInterval(loadWeather,60000)
setInterval(updateTime,60000)