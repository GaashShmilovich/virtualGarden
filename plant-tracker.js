const plantList = [
    {
        name: 'Rose',
        image: 'https://example.com/rose.jpg',
        status: 'Healthy',
        watering: 'Every 2 days',
        sunlight: 'Full Sun'
    },
    {
        name: 'Tulip',
        image: 'https://example.com/tulip.jpg',
        status: 'Needs attention',
        watering: 'Once a week',
        sunlight: 'Partial Sun'
    },
    {
        name: 'Daisy',
        image: 'https://example.com/daisy.jpg',
        status: 'Healthy',
        watering: 'Every 3 days',
        sunlight: 'Full Sun'
    },
    {
        name: 'Lily',
        image: 'https://example.com/lily.jpg',
        status: 'In bloom',
        watering: 'Every 4 days',
        sunlight: 'Partial Sun'
    },
    {
        name: 'Rose',
        image: 'https://example.com/rose.jpg',
        status: 'Healthy',
        watering: 'Every 2 days',
        sunlight: 'Full Sun'
    },
    {
        name: 'Tulip',
        image: 'https://example.com/tulip.jpg',
        status: 'Needs attention',
        watering: 'Once a week',
        sunlight: 'Partial Sun'
    },
    {
        name: 'Daisy',
        image: 'https://example.com/daisy.jpg',
        status: 'Healthy',
        watering: 'Every 3 days',
        sunlight: 'Full Sun'
    },
    {
        name: 'Lily',
        image: 'https://example.com/lily.jpg',
        status: 'In bloom',
        watering: 'Every 4 days',
        sunlight: 'Partial Sun'
    },
    {
        name: 'Rose',
        image: 'https://example.com/rose.jpg',
        status: 'Healthy',
        watering: 'Every 2 days',
        sunlight: 'Full Sun'
    },
    {
        name: 'Tulip',
        image: 'https://example.com/tulip.jpg',
        status: 'Needs attention',
        watering: 'Once a week',
        sunlight: 'Partial Sun'
    },
    {
        name: 'Daisy',
        image: 'https://example.com/daisy.jpg',
        status: 'Healthy',
        watering: 'Every 3 days',
        sunlight: 'Full Sun'
    },
    {
        name: 'Lily',
        image: 'https://example.com/lily.jpg',
        status: 'In bloom',
        watering: 'Every 4 days',
        sunlight: 'Partial Sun'
    },
    {
        name: 'Rose',
        image: 'https://example.com/rose.jpg',
        status: 'Healthy',
        watering: 'Every 2 days',
        sunlight: 'Full Sun'
    },
    {
        name: 'Tulip',
        image: 'https://example.com/tulip.jpg',
        status: 'Needs attention',
        watering: 'Once a week',
        sunlight: 'Partial Sun'
    },
    {
        name: 'Daisy',
        image: 'https://example.com/daisy.jpg',
        status: 'Healthy',
        watering: 'Every 3 days',
        sunlight: 'Full Sun'
    },
    {
        name: 'Lily',
        image: 'https://example.com/lily.jpg',
        status: 'In bloom',
        watering: 'Every 4 days',
        sunlight: 'Partial Sun'
    }
];

let currentPage = 1;
const plantsPerPage = 9;
const plantContainer = document.getElementById('plant-container');

function displayPlants(plantList, page = 1) {
    plantContainer.innerHTML = '';

    const startIndex = (page - 1) * plantsPerPage;
    const endIndex = startIndex + plantsPerPage;
    const plantsToDisplay = plantList.slice(startIndex, endIndex);

    plantsToDisplay.forEach((plant) => {
        const plantDiv = document.createElement('div');
        plantDiv.classList.add('plant-card');
        plantDiv.innerHTML = `
            <img src="${plant.image}" alt="${plant.name}">
            <h3>${plant.name}</h3>
            <p class="status">Status: ${plant.status}</p>
            <p class="watering">Watering: ${plant.watering}</p>
            <p class="sunlight">Sunlight: ${plant.sunlight}</p>
            <div class="delete-details">
            <div class="details">Details</div>
            <div class="delete">Delete</div>
            </div>
        `;
        plantContainer.appendChild(plantDiv);
    });

    displayPaginationControls(plantList);
}

function displayPaginationControls(plantList) {
    const totalPages = Math.ceil(plantList.length / plantsPerPage);
    const paginationContainer = document.querySelector('.pagination-container');
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.innerText = i;
        button.classList.add('pagination-button');
        if (i === currentPage) button.classList.add('active');

        button.addEventListener('click', () => {
            currentPage = i;
            displayPlants(plantList, currentPage);
        });

        paginationContainer.appendChild(button);
    }
}


displayPlants(plantList, currentPage);
displayPaginationControls(plantList);




document.body.addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('delete')) {
      
      const grandparentDiv = event.target.parentElement.parentElement;
      
      
      grandparentDiv.remove();
    }
  });
