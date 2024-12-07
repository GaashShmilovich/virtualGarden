function getPlantIdFromUrl() {
    const params = new URLSearchParams(window.location.search)
    return params.get('plantId')
}

const displayPlantDetails = async () => {
    const plantId = getPlantIdFromUrl()
    console.log('Plant ID from URL:', plantId)

    if (!plantId) {
        console.error('Plant ID not found in URL!')
        document.getElementById('plant-details').innerHTML = '<p>Plant ID is missing!</p>'
        return
    }

    const apiKey = 'sk-vyul675055b67af1b7886'

    const cachedDetails = JSON.parse(localStorage.getItem('cachedPlantDetails')) || {}

    if (cachedDetails[plantId]) {
        console.log('Plant details loaded from cache:', cachedDetails[plantId])
        renderPlantDetails(cachedDetails[plantId])
        window.plantDetails = cachedDetails[plantId]
        console.log('API Response:', plantDetails)

        return
    }

    try {
        // Fetch detailed plant data from API
        const response = await fetch(`https://perenual.com/api/species/details/${plantId}?key=${apiKey}`)
        if (!response.ok) {
            throw new Error(`Failed to fetch plant details: ${response.statusText}`)
        }

        const plantDetails = await response.json()
        console.log('API Response:', plantDetails)

        const details = plantDetails.data || plantDetails
        if (!details) {
            console.error('No plant details found in API response.')
            document.getElementById('plant-details').innerHTML = '<p>Unable to load plant details from the API.</p>'
            return
        }

        window.plantDetails = details

        cachedDetails[plantId] = details
        localStorage.setItem('cachedPlantDetails', JSON.stringify(cachedDetails))

        renderPlantDetails(details)
    } catch (err) {
        console.error('Error fetching plant details:', err)
        document.getElementById('plant-details').innerHTML = '<p>Error loading plant details. Please try again later.</p>'
    }
}

const renderPlantDetails = (details) => {
    console.log('Rendering details:', details)

    const {
        common_name,
        default_image,
        type,
        origin,
        dimension,
        watering,
        watering_general_benchmark,
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
                       <p><strong>Origin:</strong> ${origin || 'Unknown'}</p>
            <p><strong>Dimension:</strong> ${dimension || 'Unknown'}</p>
            <p><strong>Watering:</strong> ${watering || 'Unknown'}</p>
            <p><strong>timing:</strong> ${watering_general_benchmark.value + " " + watering_general_benchmark.unit || 'Unknown'}</p>
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

    let existingPlants = JSON.parse(localStorage.getItem('plantDetails')) || []
    const plantExists = existingPlants.some(plant => plant.id === plantDetails.id)

    if (plantExists) {
        console.log('This plant is already in the tracker.')
        return
    }

    existingPlants.push(plantDetails)
    localStorage.setItem('plantDetails', JSON.stringify(existingPlants))
})

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired')
    displayPlantDetails()
})


document.getElementById('back-button').addEventListener('click', () => {
    if (document.referrer) {
        // Navigate to the previous page if there is a referrer
        window.history.back()
    } else {
        // Fallback: Redirect to a default page
        window.location.href = 'index.html' // Replace 'index.html' with your desired fallback page
    }
})
