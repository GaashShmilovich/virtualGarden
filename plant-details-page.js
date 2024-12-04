import { hello } from './homepage'

// returns the plant id that recently clicked
function getPlantIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('plantId');
}

// returns a plant info for a given plant id
function getPlantFromLocalStorage(plantId) {
    const cachedPlants = localStorage.getItem('cachedPlants');
    if (!cachedPlants) {
        console.error('No cached plants found in localStorage.');
        return null;
    }

    const plants = JSON.parse(cachedPlants);
    return plants.find((plant) => plant.id == plantId); // Ensure matching ID
}

// display details of a given plant
function displayPlantDetails(plant) {
    if (!plant) {
        document.body.innerHTML = '<p>Plant details not found. Please try again.</p>';
        return;
    }

    document.querySelector('#plant-name').textContent = plant.name || 'Unknown';
    document.querySelector('#plant-image').src = plant.image || 'https://via.placeholder.com/150';
    // This line should be changed logically
    document.querySelector('#plant-description').textContent = `Details for ${plant.name}`;
}

const plantId = getPlantIdFromUrl();
if (plantId) {
    const plant = getPlantFromLocalStorage(plantId);
    displayPlantDetails(plant);
}
else {
    console.error('No plant ID provided in the URL.');
}