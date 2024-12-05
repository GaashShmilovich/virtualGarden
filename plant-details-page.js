const API_URL = `http://localhost:3000/api/plants/${plantId}` // Using the new endpoint to fetch details
export let trackerPlants = []

// returns the plant id that recently clicked
function getPlantIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('plantId');
}

// returns a plant object for given plant id
function getPlantFromLocalStorage(plantId) {
    const cachedPlants = localStorage.getItem('cachedPlants');
    if (!cachedPlants) {
        console.error('No cached plants found in localStorage.');
        return null;
    }

    const plants = JSON.parse(cachedPlants);
    return plants.find((plant) => plant.id == plantId); // Ensure matching ID
}

function createDescriptionForPlant(plant){
    let str = `${description} Its common name is ${plant.name} and it is a ${type}. Watering should be ${watering}, in ${watering_period} time.`
    (plant.fruits) ? str += " This kind does have fruits." : str += "This kind does not have fruits."
    if (plant.edible_fruit) str += " Fruits are edible."
    str += ` People says its maintenance requirements are ${plant.maintenance}.`
    return str
}

// display details of a given plant
function displayPlantDetails(plant) {
    if (!plant) {
        document.body.innerHTML = '<p>Plant details not found. Please try again.</p>';
        return;
    }

    document.querySelector('#plant-name').textContent = plant.name || 'Unknown';
    document.querySelector('#plant-image').src = plant.image || 'https://via.placeholder.com/150';
    document.querySelector('#plant-description').textContent = createDescriptionForPlant(plant);
}

// // Function to fetch plant details
// const fetchPlantDetails = async () => {
//     try {
//         const response = await fetch(API_URL)
//         const plantData = await response.json()

//         document.getElementById('plant-name').textContent = plantData.data.common_name
//         document.getElementById('plant-image').src = plantData.data.image_url
//         document.getElementById('plant-description').textContent = plantData.data.main_species.distribution.native[0] || 'No description available.'
//         // Display other plant details as needed
//     } catch (err) {
//         console.error('Error fetching plant details:', err)
//     }
// }

function addPlantToTracker(plant){
    trackerPlants.push(plant)
}

// const plantId = new URLSearchParams(window.location.search).get('plantId')

// Fetch and display plant details when page loads
window.onload = fetchPlantDetails

const plantId = getPlantIdFromUrl();
if (plantId) {
    const plant = getPlantFromLocalStorage(plantId);
    displayPlantDetails(plant);

    const addToTrackerLink = document.getElementById('add-to-tracker-link')
    addToTrackerLink.addEventListener(('click'), addPlantToTracker(plant))
}
else {
    console.error('No plant ID provided in the URL.');
}