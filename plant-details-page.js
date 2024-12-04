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

// Function to fetch plant details
const fetchPlantDetails = async () => {
    try {
        const response = await fetch(API_URL)
        const plantData = await response.json()

        document.getElementById('plant-name').textContent = plantData.data.common_name
        document.getElementById('plant-image').src = plantData.data.image_url
        document.getElementById('plant-description').textContent = plantData.data.main_species.distribution.native[0] || 'No description available.'
        // Display other plant details as needed
    } catch (err) {
        console.error('Error fetching plant details:', err)
    }
}

// const plantId = new URLSearchParams(window.location.search).get('plantId')

const API_URL = `http://localhost:3000/api/plants/${plantId}` // Using the new endpoint to fetch details

// Fetch and display plant details when page loads
window.onload = fetchPlantDetails

const plantId = getPlantIdFromUrl();
if (plantId) {
    const plant = getPlantFromLocalStorage(plantId);
    displayPlantDetails(plant);
}
else {
    console.error('No plant ID provided in the URL.');
}