const API_KEY = 'KoDj13vnuf4T3Npp32-tlbLXl2iCCpQJ-JMcE8ABE3k'

const plantsContainer = document.getElementById('plants-container')
const searchBar = document.getElementById('search-bar')

let allPlants = []
let currentPage = 1
const plantsPerPage = 9

const fetchPlants = async () => {
    const cachedPlants = localStorage.getItem('cachedPlants')
    if (cachedPlants) {
        console.log('Using cached data')
        return JSON.parse(cachedPlants)
    }

    try {
        const response = await fetch(`https://cors-anywhere.herokuapp.com/trefle.io/api/v1/plants?token=${API_KEY}`)
        const plantsData = await response.json()

        const formattedPlants = plantsData.data.map(plant => ({
            name: plant.common_name || 'Unknown',
            image: plant.image_url || 'https://via.placeholder.com/150',
            id: plant.id,
        }))

        localStorage.setItem('cachedPlants', JSON.stringify(formattedPlants))
        return formattedPlants
    } catch (err) {
        console.error('Error fetching plants:', err)
        return []
    }
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
    const paginationContainer = document.getElementById('pagination-container')
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

function viewPlantDetails(plantId) {
    console.log(`View details for plant ID: ${plantId}`)
}

const initialize = async () => {
    allPlants = await fetchPlants()
    displayPlants(allPlants, currentPage)
}

initialize()
