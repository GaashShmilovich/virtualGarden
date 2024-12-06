function getPlantIdFromUrl() {
    const params = new URLSearchParams(window.location.search)
    return params.get('plantId')
}

const displayPlantDetails = async () => {
    const plantId = getPlantIdFromUrl() // Extract plantId from the URL
    if (!plantId) {
        console.error('Plant ID not found in URL!')
        document.getElementById('plant-details').innerHTML = '<p>Plant ID is missing!</p>'
        return
    }

    const apiKey = 'sk-vyul675055b67af1b7886'

    // Retrieve cached plants data from localStorage
    const cachedDetails = JSON.parse(localStorage.getItem('cachedPlantDetails')) || {}

    // Check if the plant details are already cached
    if (cachedDetails[plantId]) {
        console.log('Plant details loaded from cache:', cachedDetails[plantId])
        renderPlantDetails(cachedDetails[plantId])
        window.plantDetails = cachedDetails[plantId] // Store the full object in window
        return
    }

    try {
        // Fetch detailed plant data from API
        const response = await fetch(`https://perenual.com/api/species/details/${plantId}?key=${apiKey}`)
        if (!response.ok) {
            throw new Error(`Failed to fetch plant details: ${response.statusText}`)
        }

        const plantDetails = await response.json()
        console.log('API Response:', plantDetails) // Log the entire response

        const details = plantDetails.data || plantDetails // Fallback to root object if data is missing
        if (!details) {
            console.error('No plant details found in API response.')
            document.getElementById('plant-details').innerHTML = '<p>Unable to load plant details from the API.</p>'
            return
        }

        // Save the full plant details in the global window object for later use
        window.plantDetails = details

        // Save plant details in the cache
        cachedDetails[plantId] = details
        localStorage.setItem('cachedPlantDetails', JSON.stringify(cachedDetails))

        // Display plant details
        renderPlantDetails(details)
    } catch (err) {
        console.error('Error fetching plant details:', err)
        document.getElementById('plant-details').innerHTML = '<p>Error loading plant details. Please try again later.</p>'
    }
}

// Helper function to render plant details in the HTML
const renderPlantDetails = (details) => {
    const {
        common_name,
        default_image,
        type,
        watering,
        sunlight,
        maintenance,
        edible_fruit,
    } = details

    document.getElementById('plant-name').textContent = common_name || 'Unknown'
    document.getElementById('plant-image').src = default_image
        ? default_image.regular_url
        : 'https://via.placeholder.com/150'
    document.getElementById('plant-description').innerHTML = `
        <p><strong>Type:</strong> ${type || 'Unknown'}</p>
        <p><strong>Watering:</strong> ${watering || 'Unknown'}</p>
        <p><strong>Sunlight:</strong> ${sunlight || 'Unknown'}</p>
        <p><strong>Maintenance:</strong> ${maintenance || 'Unknown'}</p>
        <p><strong>Edible Fruit:</strong> ${edible_fruit ? 'Yes' : 'No'}</p>
    `
}

document.getElementById('add-to-tracker-link').addEventListener('click', function (e) {
    e.preventDefault()

    const plantDetails = {
        ...window.plantDetails
    }

    console.log('Full plant object:', plantDetails)

    localStorage.setItem('plantDetails', JSON.stringify(plantDetails))

})





// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    displayPlantDetails()
})