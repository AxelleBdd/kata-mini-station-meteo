const gpsData = document.querySelector("#gps");
const addCityName = document.querySelector("button");
const displayCityName = document.querySelector("#city");
const displayTemperature = document.querySelector("#temperature");
const displayDetails = document.querySelector("#details");

function creationCoordinates(elem) {
    let coordinates = document.createElement("p");
    let latitude = elem.lat;
    let longitude = elem.lon;
    coordinates.innerText = `Coordonnées GPS: ${latitude}, ${longitude}`;
    fetchWeather(latitude, longitude);
    gpsData.appendChild(coordinates);
    displayDetails.innerText = "Température actuelle";
}

async function fetchCoordinates(city) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${city}&format=json&addressdetails=1&limit=1`);
        const coordinatesDetails = await response.json();

        coordinatesDetails.forEach(element => {
            creationCoordinates(element);
        });
    } catch (error) {
        console.error("Erreur de récupération des coordonnées:", error);
    }
};

async function fetchWeather(latitude, longitude) {
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation,relative_humidity_2m`)
        const weatherDetails = await response.json();

        const detailsCurrent = weatherDetails.current;
        const temperature = detailsCurrent.temperature_2m;

        displayTemperature.innerText = `${temperature} °C`;


    } catch (error) {
        console.error("Erreur de récupération de la température:", error);
    }
}

addCityName.addEventListener("click", () => {
    const cityName = document.querySelector("#cityInput").value;
    displayCityName.innerText = cityName;
    fetchCoordinates(cityName);
})