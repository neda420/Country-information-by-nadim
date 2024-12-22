

const countryList = document.getElementById('countryList');

function fetchCountries() {
    fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(countries => displayCountries(countries))
        .catch(error => console.error('Error fetching countries:', error));
}


function displayCountries(countries) {
    countryList.innerHTML = '';
    countries.forEach(country => {
        const card = `
            <div class="col-md-4 my-3">
                <div class="card">
                    <img src="${country.flags.svg}" class="card-img-top" alt="Flag">
                    <div class="card-body">
                        <h5 class="card-title">${country.name.common}</h5>
                        <p class="card-text"><strong>Population:</strong> ${country.population}</p>
                        <p class="card-text"><strong>Capital:</strong> ${country.capital}</p>
                        <button class="btn btn-primary" onclick="showWeatherDetails('${country.capital}', '${country.name.common}')">More Details</button>
                    </div>
                </div>
            </div>
        `;
        countryList.innerHTML += card;
    });
}

fetchCountries();
