const plantId = new URLSearchParams(window.location.search).get('plantId')
export let trackerPlants = []

const displayPlantDetails = () => {
    // Retrieve cached plants data from localStorage
    const cachedPlants = JSON.parse(localStorage.getItem('cachedPlants'))
    if (!cachedPlants) {
        console.error('No cached data found!')
        document.getElementById('plant-details').innerHTML = '<p>Unable to load plant details. Please try again later.</p>'
        return
    }

    // Find the plant by ID
    const plant = cachedPlants.find((p) => p.id == plantId)
    if (!plant) {
        console.error('Plant not found in cache!')
        document.getElementById('plant-details').innerHTML = '<p>Plant details not found.</p>'
        return
    }

    // Display plant details in the HTML
    document.getElementById('plant-name').textContent = plant.name
    document.getElementById('plant-image').src = plant.image
    document.getElementById('plant-description').textContent = `⁠ Its common name is ${plant.name} and it is a.Watering should be ${plant.watering}, in time. ⁠`

    return plant
}

if (plantId) {
    const plant = displayPlantDetails(plantId)
    displayPlantDetails(plant)

    const addToTrackerLink = document.getElementById('add-to-tracker-link')
    addToTrackerLink.addEventListener(('click'), addPlantToTracker(plant))

}
else {
    console.error('No plant ID provided in the URL.')
}

function addPlantToTracker(plant) {
    trackerPlants.push(plant)
}
// Load the plant details when the page is ready
window.onload = displayPlantDetails
