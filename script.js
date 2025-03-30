// Déclaration des variables

const gpsData = document.querySelector("#gps");
const addCityName = document.querySelector("button");
const displayCityName = document.querySelector("#city");
const displayTemperature = document.querySelector("#temperature");
const displayDetails = document.querySelector("#details");
const displayPrecipitation = document.querySelector("#precipitation");
const precipitationDetails = document.querySelector("#precipitationDetails");
const displayHumidity = document.querySelector("#humidity");
const humidityDetails = document.querySelector("#humidityDetails");



// Déclaration des fonctions

function creationGraph(temperature, time) {
    let canvas = document.getElementById('myChart'); // Récupération de l'emplacement du HTML
    let options = {
        type: "bar", //Choix du type de graph
      
        data: {
            labels: time, // On positionne les données de temps en abscisse
            datasets: [{
                label: 'Températures des derniers jours',
                data: temperature, // On place les données de température
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
          }],
        },
      };
    let myChart = new Chart(canvas, options); // Création du graphique
}

function creationCoordinates(elem) {
    let coordinates = document.createElement("p"); // Création d'un élément p
    let latitude = elem.lat; // latitude prend la valeur de lattude retournée par l'API
    let longitude = elem.lon; // pareil pour la longitude
    coordinates.innerText = `Coordonnées GPS: ${latitude}, ${longitude}`; // On affiche ces données
    fetchWeather(latitude, longitude); // on lance la fonction qui récupère les détails météorologiques
    fetchForecast(latitude, longitude); // on lance la fonction qui récupère les données des jours précédents
    gpsData.appendChild(coordinates); // On lie coordinates à la div gsp
    displayDetails.innerText = "Température actuelle"; // on affiche le texte indiquant la température de la ville
    precipitationDetails.innerText = "Précipitations actuelles"; // pareil pour les précipitations
    humidityDetails.innerText = "Humidité actuelle"; // pareil pour l'humidité
}

async function fetchCoordinates(city) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${city}&format=json&addressdetails=1&limit=1`);
        const coordinatesDetails = await response.json(); // Récupération de la réonse de l'API
        if (coordinatesDetails.length !== 0) { // Si le nom de la ville existe, le retour est un tableau non vide
            coordinatesDetails.forEach(element => {
                creationCoordinates(element); // on lance la fonction de récupération des coordonnées de la ville
                displayCityName.innerText = city; // on indique le nom de la ville
            });
        } else { // Si la ville n'est pas connue
            displayCityName.innerText = "Ville non trouvée"; // Indique le problème
            displayDetails.innerText = "Vérifier le nom de la ville"; // Donner une indication à l'utilisateur
        }

    } catch (error) {
        console.error("Erreur de récupération des coordonnées:", error); // message d'erreur pour cette API
    }
};

async function fetchWeather(latitude, longitude) {
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation,relative_humidity_2m`)
        const weatherDetails = await response.json(); // Récupération de la réponse de le seconde API

        const detailsCurrent = weatherDetails.current; //Résupération des chemins
        const temperature = detailsCurrent.temperature_2m;
        const precipitation = detailsCurrent.precipitation;
        const humidity = detailsCurrent.relative_humidity_2m;

        displayTemperature.innerText = `${temperature} °C`; // Affichage de la température

        displayPrecipitation.innerText = `${precipitation} mm`; // pareil pour les précipitations

        displayHumidity.innerText = `${humidity} %`; // pareil pour l'humidité


    } catch (error) {
        console.error("Erreur de récupération de la température:", error); // Message d'erreur de la seconde API
    }
}

async function fetchForecast(latitude, longitude) {
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation&past_days=2`);
        const forecastData = await response.json();

        let data = forecastData.hourly;
        let temperatureForecast = data.temperature_2m;
        let temperatureLastDays = temperatureForecast.slice(0,58); // Récupération des données jusqu'à la date et l'heure du jour
        let forecastTime = data.time;
        let timeLastDays = forecastTime.slice(0,58);

        creationGraph(temperatureLastDays, timeLastDays); // Création du graphique

    } catch (error) {
        console.error("Erreur de récupération des données des jours précédents:", error); // Message d'erreur de la troisième API
    }

}

addCityName.addEventListener("click", () => {
    gpsData.innerHTML = ""; // on vide la ligne de coordonnées
    const cityName = document.querySelector("#cityInput").value; // on récupère le nom de la ville
    fetchCoordinates(cityName); // on lance la fonction asynchrone de la première API
})