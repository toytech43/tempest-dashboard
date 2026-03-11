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
borderColor:"#ff7b00",
backgroundColor:"rgba(255,123,0,0.2)",
fill:true,
tension:.4,
pointRadius:0
}]
},
options:{
plugins:{legend:{display:false}},
scales:{
x:{display:false},
y:{grid:{color:"#eee"}}
}
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

const days=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

let html=""

for(let i=1;i<=7;i++){

const d=new Date()
d.setDate(d.getDate()+i)

html+=`
<div class="day">
<div>${days[d.getDay()]}</div>
<div class="day-icon">☀️</div>
<div>72° / 55°</div>
</div>
`
}

document.getElementById("forecast").innerHTML=html

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