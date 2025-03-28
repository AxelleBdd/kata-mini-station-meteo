/**Je saisis une ville dans le champ texte
Je clique sur le bouton “OK”
Je vois alors s’afficher  sur la page les coordonnées GPS de la ville */

const gps = document.querySelector("#gps");
const addCityName = document.querySelector("button");
const affichageCityName = document.querySelector("#city");


async function getCoordinates(city) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${city}&format=json&addressdetails=1&limit=1`);
        const coordinatesDetails = await response.json();

        coordinatesDetails.forEach(element => {          
            let coordonnées = document.createElement("p");
            coordonnées.innerText = `Coordonnées GPS: ${element.lat}, ${element.lon}` 

            gps.appendChild(coordonnées);
        });
    } catch (error) {
        console.error("Erreur de récupération:", error);
    }
}

addCityName.addEventListener("click", () => {
    const cityName = document.querySelector("#cityInput").value;
    
    affichageCityName.innerText = cityName;    
    getCoordinates(cityName);
})