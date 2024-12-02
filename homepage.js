const plantsContainer = document.getElementById('plants-container')
const searchBar = document.getElementById('search-bar')

const plants = [
    { name: 'Monstera', image: 'https://via.placeholder.com/150', id: 1 },
    { name: 'Fern', image: 'https://via.placeholder.com/150', id: 2 },
    { name: 'Succulent', image: 'https://via.placeholder.com/150', id: 3 },
    { name: 'Bamboo', image: 'https://via.placeholder.com/150', id: 4 },
]

function displayPlants(plantList) {
    plantsContainer.innerHTML = ''
    plantList.forEach((plant) => {
        const plantCard = document.createElement('div')
        plantCard.classList.add('plant-card')
        plantCard.innerHTML = `
      <img src="${plant.image}" alt="${plant.name}">
      <h3>${plant.name}</h3>
      <button onclick="viewPlantDetails(${plant.id})">View Details</button>
    `
        plantsContainer.appendChild(plantCard)
    })
}

searchBar.addEventListener('input', (e) => {
    const searchText = e.target.value.toLowerCase()
    const filteredPlants = plants.filter((plant) =>
        plant.name.toLowerCase().includes(searchText)
    )
    displayPlants(filteredPlants)
})

function viewPlantDetails(plantId) {
    const plant = plantId
}

displayPlants(plants)
