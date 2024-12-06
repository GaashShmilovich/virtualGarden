const plantsContainer = document.querySelector('.plants-container')
const searchBar = document.querySelector('.search-bar')
const imageInput = document.querySelector('#plant-ai')

let allPlants = []
let currentPage = 1
const plantsPerPage = 8

const fetchPlants = async () => {
    const cachedPlants = localStorage.getItem('cachedPlants')
    if (cachedPlants) {
        console.log('Using cached data')
        return JSON.parse(cachedPlants)
    }

    const apiKey = 'sk-vyul675055b67af1b7886'
    let allFetchedPlants = []
    let page = 1

    try {
        while (allFetchedPlants.length < 100) {
            const response = await fetch(`https://perenual.com/api/species-list?key=${apiKey}&edible=1&page=${page}`)
            const plantsData = await response.json()

            // Check if 'data' exists before mapping
            if (!plantsData.data || plantsData.data.length === 0) {
                console.log('No more plants to fetch.')
                break
            }

            const formattedPlants = plantsData.data.map(plant => ({
                name: plant.common_name || 'Unknown',
                image: plant.default_image ? plant.default_image.regular_url : 'https://via.placeholder.com/150',
                id: plant.id,
            }))

            allFetchedPlants = allFetchedPlants.concat(formattedPlants)
            if (plantsData.data.length < 1) break

            page++
        }

        // Limit to 100 plants
        allFetchedPlants = allFetchedPlants.slice(0, 50)

        // Cache the results
        localStorage.setItem('cachedPlants', JSON.stringify(allFetchedPlants))
        return allFetchedPlants
    } catch (err) {
        console.error('Error fetching plants:', err)
        return []
    }
}

const initialize = async () => {
    allPlants = await fetchPlants()
    displayPlants(allPlants, currentPage)
}

function displayPlants(plantList, page = 1) {
    plantsContainer.innerHTML = ''

    const startIndex = (page - 1) * plantsPerPage
    const endIndex = startIndex + plantsPerPage
    const plantsToDisplay = plantList.slice(startIndex, endIndex)

    plantsToDisplay.forEach((plant) => {
        const plantCard = document.createElement('div')
        plantCard.classList.add('plant-card')
        plantCard.innerHTML = `
            <img src="${plant.image}" alt="${plant.name}">
            <h3>${plant.name}</h3>
            <button onclick="viewPlantDetails(${plant.id})">View Details</button>
        `
        plantsContainer.appendChild(plantCard)
    })

    displayPaginationControls(plantList)
}

function displayPaginationControls(plantList) {
    const totalPages = Math.ceil(plantList.length / plantsPerPage)
    const paginationContainer = document.querySelector('.pagination-container')
    paginationContainer.innerHTML = ''

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button')
        button.innerText = i
        button.classList.add('pagination-button')
        if (i === currentPage) button.classList.add('active')

        button.addEventListener('click', () => {
            currentPage = i
            displayPlants(plantList, currentPage)
        })

        paginationContainer.appendChild(button)
    }
}

searchBar.addEventListener('input', (e) => {
    const searchText = e.target.value.toLowerCase()
    const filteredPlants = allPlants.filter((plant) =>
        plant.name.toLowerCase().includes(searchText)
    )
    currentPage = 1
    displayPlants(filteredPlants, currentPage)
})

document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('plant-ai') // Make sure the ID matches

    if (imageInput) {
        imageInput.addEventListener('change', function () {
            const file = this.files[0] // Get the selected file
            if (file) {
                console.log('Selected file:', file)

                // Example: Send the file to the PlantNet API
                sendToPlantNetAPI(file)
            } else {
                console.error('No file selected!')
            }
        })
    } else {
        console.error('File input element not found!')
    }
})

// Function to send file to PlantNet API
async function sendToPlantNetAPI(imageFile) {
    const apiKey = '2b10Jt01kPIoRFvPEQKaIu90hO' // Replace with your PlantNet API key
    const formData = new FormData()
    formData.append('images', imageFile) // Add the image file
    formData.append('organs', 'auto') // Specify the plant organ (if required)
    formData.append('api-key', apiKey) // Add the API key

    try {
        const response = await fetch('https://my.plantnet.org/v2/identify', {
            method: 'POST',
            body: formData,
        })

        if (response.ok) {
            const result = await response.json()
            console.log('PlantNet API Response:', result)
        } else {
            console.error('Error from PlantNet API:', response.status, response.statusText)
        }
    } catch (err) {
        console.error('Error sending image to PlantNet API:', err)
    }
}

function viewPlantDetails(plantId) {
    window.location.href = `plant-details-page.html?plantId=${plantId}`
    console.log(plantId)
}

initialize()
