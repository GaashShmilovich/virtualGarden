const plantList = []

let currentPage = 1
const plantsPerPage = 9
const plantContainer = document.getElementById('plant-container')

function displayPlants(plantList, page = 1) {
    plantContainer.innerHTML = ''

    const startIndex = (page - 1) * plantsPerPage
    const endIndex = startIndex + plantsPerPage
    const plantsToDisplay = plantList.slice(startIndex, endIndex)

    plantsToDisplay.forEach((plant) => {
        const plantDiv = document.createElement('div')
        plantDiv.classList.add('plant-card')
        plantDiv.setAttribute('data-id', plant.id)


        let wateringInterval
        switch (plant.watering) {
            case 'Frequent':
                wateringInterval = 24 * 60 * 60 * 1000
                break
            case 'Average':
                wateringInterval = 3 * 24 * 60 * 60 * 1000
                break
            case 'Minimum':
                wateringInterval = 7 * 24 * 60 * 60 * 1000
                break
            default:
                wateringInterval = 24 * 60 * 60 * 1000
        }


        function formatTime(ms) {
            const days = Math.floor(ms / (24 * 60 * 60 * 1000))
            const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
            const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000))
            const seconds = Math.floor((ms % (60 * 1000)) / 1000)
            return `${days}d ${hours}h ${minutes}m ${seconds}s`
        }


        function startTimer() {

            const lastWateringTime = localStorage.getItem(`lastWateringTime_${plant.id}`)
            let remainingTime = wateringInterval


            if (lastWateringTime) {
                const timeSinceLastWatering = Date.now() - parseInt(lastWateringTime)
                remainingTime = wateringInterval - timeSinceLastWatering
            }


            if (remainingTime <= 0) {
                remainingTime = 0
            }

            const timerElement = plantDiv.querySelector('.watering-timer')
            const waterButton = plantDiv.querySelector('.watered-button')


            const interval = setInterval(() => {
                if (remainingTime <= 0) {
                    clearInterval(interval)
                    timerElement.textContent = 'Time to water!'
                } else {
                    timerElement.textContent = formatTime(remainingTime)
                    remainingTime -= 1000
                }
            }, 1000)


            waterButton.addEventListener('click', () => {
                localStorage.setItem(`lastWateringTime_${plant.id}`, Date.now())
                remainingTime = wateringInterval
                clearInterval(interval)
                startTimer()
            })
        }

        plantDiv.innerHTML = `
            <img src="${plant.default_image.regular_url}" alt="${plant.common_name}">
            <h3 class="plant-name">${plant.common_name}</h3>
            <p class="sunlight">Sunlight: ${plant.sunlight}</p>
            <p class="watering">Watering: ${plant.watering}</p>
            <p id="needs-watering">needs watering in:</p>
            <p class="watering-timer">Timer: Loading...</p>  <!-- Timer for watering -->
            <button class="watered-button">Watered</button> <!-- Button to reset the timer -->
            <div class="delete-details">
                <div class="details">Details</div>
                <div class="delete">Delete</div>
            </div>
        `


        startTimer()


        const detailsButton = plantDiv.querySelector('.details')
        detailsButton.addEventListener('click', () => {

            window.location.href = `plant-details-page.html?plantId=${plant.id}`
        })

        plantContainer.appendChild(plantDiv)
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



document.body.addEventListener('click', function (event) {
    if (event.target && event.target.classList.contains('delete')) {
        const grandparentDiv = event.target.parentElement.parentElement
        const plantName = grandparentDiv.querySelector('h3').textContent
        const plantId = grandparentDiv.getAttribute('data-id')


        grandparentDiv.remove()


        let plantDetails = JSON.parse(localStorage.getItem('plantDetails')) || []


        plantDetails = plantDetails.filter(plant => plant.common_name !== plantName)

        localStorage.setItem('plantDetails', JSON.stringify(plantDetails))


        localStorage.removeItem(`lastWateringTime_${plantId}`)
    }
})




window.addEventListener('DOMContentLoaded', () => {
    let plantDetails = JSON.parse(localStorage.getItem('plantDetails')) || []

    if (plantDetails.length > 0) {
        console.log('Retrieved plant object:', plantDetails)
        plantDetails.forEach(plant => plantList.push(plant))
    } else {
        console.log('No plant details found in localStorage.')
    }


    displayPlants(plantList, currentPage)
    displayPaginationControls(plantList)
})