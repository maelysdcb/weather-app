let city = document.querySelector(".localisation h2");
let temp = document.querySelector(".localisation p");
let weather = document.querySelector(".localisation button");
let humidity = document.querySelector(".humidity p");
let pressure = document.querySelector(".pressure p");
let wind = document.querySelector(".wind p");
let sunrise = document.querySelector(".sun__rise");
let sunset = document.querySelector(".sun__set");
let today = document.querySelector("h4");
let hour = document.querySelectorAll(".hour");
let section = document.querySelector("#temp-hours");

// TEMP ICONS
let imgArrayDay = [
  "images/sun.png",
  "images/cloud.png",
  "images/cloudy.png",
  "images/rainy.png",
  "images/storm.png",
  "images/snowy.png",
];

// IS GEOLOCALISATION ON ?
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (location) => {
      const long = location.coords.longitude;
      const lat = location.coords.latitude;
      getWeatherData(long, lat);
    },
    () => {
      alert(
        "Vous avez refusé la géolocalisation, l'application ne peut fonctionner sans, veuillez l'activer."
      );
    }
  );
}

// FETCHING API'S DATAS
async function getWeatherData(long, lat) {
  const results = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=fe35c835835665f437392d7d087543f3&units=metric&cnt=40&lang=fr`
  );

  const data = await results.json();

  console.log(data);
  
  // INJECT DATA
  city.innerHTML = `${data.city.name}`;
  temp.innerHTML = Math.floor(`${data.list[0].main.temp}`) + "&deg;";
  weather.innerHTML = `${data.list[0].weather[0].main}`;
  humidity.innerHTML = `${data.list[0].main.humidity} %`;
  pressure.innerHTML = `${data.list[0].main.pressure} mBar`;
  wind.innerHTML = `${data.list[0].wind.speed} km`;


  // FUNCTION TO CONVERT UNIX TIME TO TIME FORMAT 
  const convertTime = function formatTime(unixTime) {
    let date = new Date(unixTime * 1000);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    if(date.getMinutes() === 0){
      date.getHours();
      return `${hours}h`;
    } else {
      return `${hours}h${minutes.toLocaleString()}`;
    }
  }

  // DISPLAY SUNRISE AND SUNSET TIME
  let sunriseTime = `${data.city.sunrise}` && convertTime(data.city.sunrise);
  let sunsetTime = `${data.city.sunset}` && convertTime(data.city.sunset);

  sunrise.innerHTML = sunriseTime || "N/A";
  sunset.innerHTML = sunsetTime || "N/A";

  // DISPLAY TODAY 
  today.innerHTML = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // DISPLAY EVERY NEXT 3 HOURS
  for (let i = 0; i < 5; i++) {
    let div = document.createElement("div");
    div.classList.add("hour");
    div.innerHTML = `
    <p>${convertTime(data.list[i].dt)}</p>
    <img src="./img/meteo.png" alt="">
    <p>${Math.floor(data.list[i].main.temp)}&deg;</p>
    `;
    section.append(div);
  }
}
