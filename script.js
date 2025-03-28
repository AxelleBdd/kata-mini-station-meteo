const gpsData = document.querySelector("#gps");
const addCityName = document.querySelector("button");
const displayCityName = document.querySelector("#city");
const displayTemperature = document.querySelector("#temperature");
const displayDetails = document.querySelector("#details");
const displayPrecipitation = document.querySelector("#precipitation");
const precipitationDetails = document.querySelector("#precipitationDetails");
const displayHumidity = document.querySelector("#humidity");
const humidityDetails = document.querySelector("#humidityDetails");

function creationCoordinates(elem) {
    let coordinates = document.createElement("p");
    let latitude = elem.lat;
    let longitude = elem.lon;
    coordinates.innerText = `Coordonnées GPS: ${latitude}, ${longitude}`;
    fetchWeather(latitude, longitude);
    gpsData.appendChild(coordinates);
    displayDetails.innerText = "Température actuelle";
    precipitationDetails.innerText = "Précipitations actuelles";
    humidityDetails.innerText = "Humidité actuelle";
}

async function fetchCoordinates(city) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${city}&format=json&addressdetails=1&limit=1`);
        const coordinatesDetails = await response.json();
        if (coordinatesDetails.length !==0){
            coordinatesDetails.forEach(element => {
                creationCoordinates(element);
                displayCityName.innerText = city;
            });
        } else {
            displayCityName.innerText = "Ville non trouvée";
            displayDetails.innerText = "Vérifier le nom de la ville";
        }
        
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
        const precipitation = detailsCurrent.precipitation;
        const  humidity = detailsCurrent.relative_humidity_2m;

        displayTemperature.innerText = `${temperature} °C`;

        displayPrecipitation.innerText = `${precipitation} mm`;

        displayHumidity.innerText = `${humidity} %`;


    } catch (error) {
        console.error("Erreur de récupération de la température:", error);
    }
}

addCityName.addEventListener("click", () => {
    gpsData.innerHTML = "";
    const cityName = document.querySelector("#cityInput").value;
    fetchCoordinates(cityName);
})