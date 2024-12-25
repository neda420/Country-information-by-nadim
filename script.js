import { fetchWeather } from './weather_api.js';

var countryList = document.getElementById('countryList');


document.addEventListener('DOMContentLoaded', () => {
    var searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', () => {
        const searchInput = document.getElementById('searchInput').value.trim();
        if (searchInput) {
            fetchCountries(searchInput);
        } else {
            alert('Please enter a country name.');
        }
    });
});


function fetchCountries(searchInput) {
    fetch(`https://restcountries.com/v3.1/name/${searchInput}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Country not found');
            }
            return response.json();
        })
        .then(countries => displayCountries(countries))
        .catch(error => alert(`Error: ${error.message}`));
}

function displayCountries(countries) {
    countryList.innerHTML = ''; 

    if (countries.length === 0) {
        countryList.innerHTML = `<p class="text-center">No countries found.</p>`;
        return;
    }

    countries.forEach(country => {
        const capital = country.capital ? country.capital[0] : 'N/A';
        const card = document.createElement('div');
        card.className = 'col-md-4 my-3 d-flex justify-content-center';
        card.innerHTML = `
            <div class="card h-100">
                <img src="${country.flags.svg}" class="card-img-top" alt="${country.name.common} Flag">
                <div class="card-body">
                    <h5 class="card-title">${country.name.common}</h5>
                    <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                    <p><strong>Capital:</strong> ${capital}</p>
                    <button class="btn btn-primary more-details-btn">
                        More Details
                    </button>
                </div>
            </div>
        `;

        
        const moreDetailsButton = card.querySelector('.more-details-btn');
        moreDetailsButton.addEventListener('click', () => {
            if (capital !== 'N/A') {
                showWeatherDetails(capital, country.name.common);
            } else {
                alert('Weather data is not available for this location.');
            }
        });

        countryList.appendChild(card);
    });
}

async function showWeatherDetails(capital, countryName) {
    try {
        console.log(`Fetching weather for ${capital}, ${countryName}`);
        const weather = await fetchWeather(capital);
        console.log('Weather data received:', weather);

        const weatherDetails = document.createElement('div');
        weatherDetails.className = 'weather-details';
        weatherDetails.innerHTML = `
            <h3>${countryName}</h3>
            <p><strong>Capital:</strong> ${capital}</p>
            <p><strong>Weather:</strong> ${weather.current?.condition?.text || 'N/A'}</p>
            <p><strong>Temperature:</strong> ${weather.current?.temp_c || 'N/A'}°C</p>
            <p><strong>Humidity:</strong> ${weather.current?.humidity || 'N/A'}%</p>
        `;

        
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.tabIndex = -1;
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${countryName} - Weather Details</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        ${weatherDetails.innerHTML}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    } catch (error) {
        console.error('Error in showWeatherDetails:', error);
        alert(`Could not fetch weather data: ${error.message}`);
    }
}