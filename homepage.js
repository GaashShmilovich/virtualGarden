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

        allFetchedPlants = allFetchedPlants.slice(0, 50)

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
    const searchWords = searchText.split(' ').filter(word => word.trim() !== '')

    let filteredPlants

    if (searchText === '') {
        filteredPlants = allPlants
    } else {
        filteredPlants = allPlants.filter((plant) => {
            const plantName = plant.name.toLowerCase()
            return searchWords.some(word => plantName.includes(word))
        })
    }

    currentPage = 1
    displayPlants(filteredPlants, currentPage)
})


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault()

        const target = document.querySelector(this.getAttribute("href"))
        target.scrollIntoView({
            behavior: "smooth",
            block: "start",
        })
    })
})

const fileInput = document.getElementById('plant-ai')
const resultContainer = document.getElementById('result-container')
const uploadText = document.getElementById('upload-text')

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0]

    if (file) {
        uploadText.textContent = `Image selected: ${file.name}`
        resultContainer.style.display = 'block'
        sendToPlantNetAPI(file)
    } else {
        uploadText.textContent = 'No image selected'
        resultContainer.style.display = 'none'
    }
})

async function sendToPlantNetAPI(imageFile) {
    const apiKey = '2b10Jt01kPIoRFvPEQKaIu90hO'
    const formData = new FormData()
    formData.append('images', imageFile)
    formData.append('organs', 'auto')

    const project = 'all'

    try {
        const response = await fetch(`https://my-api.plantnet.org/v2/identify/${project}?api-key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Origin': 'http://127.0.0.1:5500',
            },
            body: formData,
        })

        if (response.ok) {
            const result = await response.json()
            const plant = result.results[0]
            const commonName = plant.species.commonNames.length > 0 ? plant.species.commonNames[0] : "Unknown"


            searchBar.value = commonName.toLowerCase()
            searchBar.dispatchEvent(new Event('input'))
            displayCommonName(commonName)
        } else {
            console.error('Error from PlantNet API:', response.status, response.statusText)
        }
    } catch (err) {
        console.error('Error sending image to PlantNet API:', err)
    }
}

function displayCommonName(commonName) {
    const nameElement = document.createElement('p')
    nameElement.textContent = `${commonName}`

    resultContainer.innerHTML = ''
    resultContainer.appendChild(nameElement)
}



function viewPlantDetails(plantId) {
    window.location.href = `plant-details-page.html?plantId=${plantId}`
}

initialize()
