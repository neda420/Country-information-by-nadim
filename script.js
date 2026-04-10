import { fetchWeather } from './weather_api.js';

const countryList = document.getElementById('countryList');
const statusMsg   = document.getElementById('statusMsg');
const resultMeta  = document.getElementById('resultMeta');

// ─── helpers ────────────────────────────────────────────────────────────────

function setLoading(msg = 'Fetching data…') {
    statusMsg.className = 'alert alert-info d-flex align-items-center gap-2';
    statusMsg.innerHTML = `
        <div class="spinner-border spinner-border-sm" role="status"></div>
        <span>${msg}</span>`;
    countryList.innerHTML = '';
    resultMeta.className = 'text-muted small mb-2 d-none';
}

function setError(msg) {
    statusMsg.className = 'alert alert-danger';
    statusMsg.innerHTML = `<i class="fa-solid fa-circle-exclamation me-2"></i>${msg}`;
    countryList.innerHTML = '';
    resultMeta.className = 'text-muted small mb-2 d-none';
}

function clearStatus() {
    statusMsg.className = 'd-none';
    statusMsg.innerHTML = '';
}

function triggerSearch() {
    // Check both the navbar and hero inputs
    const navVal  = document.getElementById('searchInput').value.trim();
    const heroVal = document.getElementById('heroSearchInput').value.trim();
    const query   = navVal || heroVal;
    if (query) {
        fetchCountriesByName(query);
    } else {
        setError('Please enter a country name.');
    }
}

// ─── event listeners ────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('searchButton').addEventListener('click', triggerSearch);
    document.getElementById('heroSearchButton').addEventListener('click', triggerSearch);
    document.getElementById('homeLink').addEventListener('click', (e) => {
        e.preventDefault();
        clearStatus();
        countryList.innerHTML = '';
        resultMeta.className = 'text-muted small mb-2 d-none';
        document.getElementById('searchInput').value = '';
        document.getElementById('heroSearchInput').value = '';
        // Remove active region highlighting
        document.querySelectorAll('.region-btn').forEach(b => b.classList.remove('active'));
    });

    // Enter-key support for both inputs
    ['searchInput', 'heroSearchInput'].forEach(id => {
        document.getElementById(id).addEventListener('keydown', (e) => {
            if (e.key === 'Enter') triggerSearch();
        });
    });

    // Region filter buttons
    document.querySelectorAll('.region-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.region-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            fetchCountriesByRegion(btn.dataset.region);
        });
    });
});

// ─── API calls ──────────────────────────────────────────────────────────────

function fetchCountriesByName(query) {
    setLoading(`Searching for "${query}"…`);
    fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(query)}`)
        .then(r => {
            if (!r.ok) throw new Error('Country not found. Check the spelling and try again.');
            return r.json();
        })
        .then(countries => {
            clearStatus();
            displayCountries(countries, `${countries.length} result${countries.length !== 1 ? 's' : ''} for "${query}"`);
        })
        .catch(err => setError(err.message));
}

function fetchCountriesByRegion(region) {
    setLoading(`Loading countries in ${region}…`);
    fetch(`https://restcountries.com/v3.1/region/${encodeURIComponent(region)}`)
        .then(r => {
            if (!r.ok) throw new Error('Could not load region data.');
            return r.json();
        })
        .then(countries => {
            clearStatus();
            // Sort alphabetically
            countries.sort((a, b) => a.name.common.localeCompare(b.name.common));
            displayCountries(countries, `${countries.length} countries in ${region}`);
        })
        .catch(err => setError(err.message));
}

// ─── display cards ──────────────────────────────────────────────────────────

function displayCountries(countries, metaText) {
    countryList.innerHTML = '';

    if (!countries || countries.length === 0) {
        setError('No countries found.');
        return;
    }

    if (metaText) {
        resultMeta.textContent = metaText;
        resultMeta.className = 'text-muted small mb-2';
    }

    countries.forEach(country => {
        const capital    = country.capital ? country.capital[0] : 'N/A';
        const region     = country.region  || 'N/A';
        const subregion  = country.subregion || '';
        const area       = country.area ? country.area.toLocaleString() + ' km²' : 'N/A';
        const languages  = country.languages
            ? Object.values(country.languages).slice(0, 3).join(', ')
            : 'N/A';
        const currencies = country.currencies
            ? Object.values(country.currencies)
                .map(c => `${c.name}${c.symbol ? ' (' + c.symbol + ')' : ''}`)
                .join(', ')
            : 'N/A';

        const card = document.createElement('div');
        card.className = 'col';
        card.innerHTML = `
            <div class="card h-100 country-card shadow-sm">
                <div class="flag-wrapper">
                    <img src="${country.flags.svg}"
                         class="card-img-top flag-img"
                         alt="${country.flags.alt || country.name.common + ' flag'}">
                </div>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title mb-0">${country.name.common}</h5>
                    <p class="text-muted small mb-2">${country.name.official}</p>

                    <div class="info-grid flex-grow-1">
                        <div class="info-item">
                            <span class="info-label"><i class="fa-solid fa-map-location-dot"></i> Region</span>
                            <span>${region}${subregion ? ' · ' + subregion : ''}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label"><i class="fa-solid fa-users"></i> Population</span>
                            <span>${country.population.toLocaleString()}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label"><i class="fa-solid fa-building-columns"></i> Capital</span>
                            <span>${capital}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label"><i class="fa-solid fa-ruler-combined"></i> Area</span>
                            <span>${area}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label"><i class="fa-solid fa-language"></i> Languages</span>
                            <span>${languages}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label"><i class="fa-solid fa-coins"></i> Currency</span>
                            <span>${currencies}</span>
                        </div>
                    </div>

                    <button class="btn btn-primary more-details-btn mt-3 w-100">
                        <i class="fa-solid fa-circle-info me-1"></i>Full Details &amp; Weather
                    </button>
                </div>
            </div>`;

        card.querySelector('.more-details-btn').addEventListener('click', () => {
            showCountryDetails(country);
        });

        countryList.appendChild(card);
    });
}

// ─── detail modal ────────────────────────────────────────────────────────────

async function showCountryDetails(country) {
    const capital      = country.capital ? country.capital[0] : null;
    const languages    = country.languages
        ? Object.values(country.languages).join(', ') : 'N/A';
    const currencies   = country.currencies
        ? Object.values(country.currencies)
            .map(c => `${c.name}${c.symbol ? ' (' + c.symbol + ')' : ''}`)
            .join(', ')
        : 'N/A';
    const tld          = country.tld ? country.tld.join(', ') : 'N/A';
    const callingCode  = country.idd
        ? (country.idd.root || '') +
          (country.idd.suffixes && country.idd.suffixes.length === 1
              ? country.idd.suffixes[0]
              : (country.idd.suffixes && country.idd.suffixes.length > 1
                  ? country.idd.root
                  : ''))
        : 'N/A';
    const drivingSide  = country.car?.side
        ? country.car.side.charAt(0).toUpperCase() + country.car.side.slice(1)
        : 'N/A';
    const timezones    = country.timezones ? country.timezones.join(', ') : 'N/A';
    const borders      = country.borders   || [];
    const googleMaps   = country.maps?.googleMaps   || null;
    const openStreet   = country.maps?.openStreetMaps || null;
    const continents   = (country.continents || []).join(', ') || 'N/A';
    const startOfWeek  = country.startOfWeek
        ? country.startOfWeek.charAt(0).toUpperCase() + country.startOfWeek.slice(1)
        : 'N/A';

    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.tabIndex = -1;
    modal.innerHTML = `
        <div class="modal-dialog modal-lg modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header modal-header-country">
                    <div class="d-flex align-items-center gap-3">
                        <img src="${country.flags.svg}"
                             class="modal-flag-img shadow-sm"
                             alt="${country.name.common} flag">
                        <div>
                            <h5 class="modal-title mb-0 fw-bold">${country.name.common}</h5>
                            <div class="text-white-50 small">${country.name.official}</div>
                        </div>
                    </div>
                    <button type="button" class="btn-close btn-close-white ms-auto"
                            data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">

                    <!-- General -->
                    <h6 class="section-heading">
                        <i class="fa-solid fa-circle-info me-1"></i>General Information
                    </h6>
                    <div class="row g-3 mb-4">
                        <div class="col-md-6">
                            <table class="table table-sm detail-table">
                                <tbody>
                                    <tr><th>Region</th><td>${country.region || 'N/A'}</td></tr>
                                    <tr><th>Subregion</th><td>${country.subregion || 'N/A'}</td></tr>
                                    <tr><th>Continent</th><td>${continents}</td></tr>
                                    <tr><th>Capital</th><td>${capital || 'N/A'}</td></tr>
                                    <tr><th>Population</th><td>${country.population.toLocaleString()}</td></tr>
                                    <tr><th>Area</th><td>${country.area ? country.area.toLocaleString() + ' km²' : 'N/A'}</td></tr>
                                    <tr><th>Landlocked</th><td>${country.landlocked ? 'Yes' : 'No'}</td></tr>
                                    <tr><th>Start of Week</th><td>${startOfWeek}</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="col-md-6">
                            <table class="table table-sm detail-table">
                                <tbody>
                                    <tr><th>Languages</th><td>${languages}</td></tr>
                                    <tr><th>Currencies</th><td>${currencies}</td></tr>
                                    <tr><th>Calling Code</th><td>${callingCode}</td></tr>
                                    <tr><th>Internet TLD</th><td>${tld}</td></tr>
                                    <tr><th>Driving Side</th><td>${drivingSide}</td></tr>
                                    <tr><th>ISO Codes</th><td>${country.cca2} / ${country.cca3}</td></tr>
                                    <tr><th>Independent</th><td>${country.independent ? 'Yes' : 'No'}</td></tr>
                                    <tr><th>UN Member</th><td>${country.unMember ? 'Yes' : 'No'}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Timezones -->
                    <h6 class="section-heading">
                        <i class="fa-solid fa-clock me-1"></i>Timezones
                    </h6>
                    <p class="small text-muted mb-4">${timezones}</p>

                    <!-- Borders -->
                    ${borders.length > 0 ? `
                    <h6 class="section-heading">
                        <i class="fa-solid fa-map me-1"></i>Bordering Countries
                        <span class="badge bg-secondary ms-1">${borders.length}</span>
                    </h6>
                    <div class="mb-4">
                        ${borders.map(b => `<span class="badge border-badge me-1 mb-1">${b}</span>`).join('')}
                    </div>` : ''}

                    <!-- Maps -->
                    ${(googleMaps || openStreet) ? `
                    <h6 class="section-heading">
                        <i class="fa-solid fa-location-dot me-1"></i>Maps
                    </h6>
                    <div class="mb-4 d-flex flex-wrap gap-2">
                        ${googleMaps ? `<a href="${googleMaps}" target="_blank" rel="noopener noreferrer"
                            class="btn btn-outline-primary btn-sm">
                            <i class="fa-brands fa-google me-1"></i>Google Maps
                        </a>` : ''}
                        ${openStreet ? `<a href="${openStreet}" target="_blank" rel="noopener noreferrer"
                            class="btn btn-outline-secondary btn-sm">
                            <i class="fa-solid fa-map me-1"></i>OpenStreetMap
                        </a>` : ''}
                    </div>` : ''}

                    <!-- Weather -->
                    ${capital ? `
                    <h6 class="section-heading">
                        <i class="fa-solid fa-cloud-sun me-1"></i>Current Weather in ${capital}
                    </h6>
                    <div id="weatherData" class="weather-box">
                        <div class="d-flex align-items-center gap-2 text-muted">
                            <div class="spinner-border spinner-border-sm" role="status"></div>
                            <span>Loading weather…</span>
                        </div>
                    </div>` : ''}

                </div>
            </div>
        </div>`;

    document.body.appendChild(modal);
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();

    // Fetch weather asynchronously after modal is shown
    if (capital) {
        try {
            const weather = await fetchWeather(capital);
            const wc = modal.querySelector('#weatherData');
            if (wc) {
                const icon  = weather.current?.condition?.icon
                    ? `https:${weather.current.condition.icon}` : null;
                const cond  = weather.current?.condition?.text  || 'N/A';
                const tempC = weather.current?.temp_c           ?? 'N/A';
                const tempF = weather.current?.temp_f           ?? 'N/A';
                const feels = weather.current?.feelslike_c      ?? 'N/A';
                const hum   = weather.current?.humidity         ?? 'N/A';
                const wind  = weather.current?.wind_kph         ?? 'N/A';
                const windD = weather.current?.wind_dir         || '';
                const uv    = weather.current?.uv               ?? 'N/A';
                const vis   = weather.current?.vis_km           ?? 'N/A';
                const press = weather.current?.pressure_mb      ?? 'N/A';
                const cloud = weather.current?.cloud            ?? 'N/A';

                wc.innerHTML = `
                    <div class="weather-header mb-3 d-flex align-items-center gap-3">
                        ${icon ? `<img src="${icon}" alt="${cond}" title="${cond}" class="weather-icon">` : ''}
                        <div>
                            <div class="fw-bold fs-5">${cond}</div>
                            <div class="text-muted small">As of now in ${capital}</div>
                        </div>
                    </div>
                    <div class="row text-center g-2">
                        ${weatherStat('<i class="fa-solid fa-temperature-half"></i>', `${tempC}°C / ${tempF}°F`, 'Temperature')}
                        ${weatherStat('<i class="fa-solid fa-face-smile-wink"></i>', `${feels}°C`, 'Feels Like')}
                        ${weatherStat('<i class="fa-solid fa-droplet"></i>', `${hum}%`, 'Humidity')}
                        ${weatherStat('<i class="fa-solid fa-wind"></i>', `${wind} km/h ${windD}`, 'Wind')}
                        ${weatherStat('<i class="fa-solid fa-sun"></i>', String(uv), 'UV Index')}
                        ${weatherStat('<i class="fa-solid fa-eye"></i>', `${vis} km`, 'Visibility')}
                        ${weatherStat('<i class="fa-solid fa-gauge-high"></i>', `${press} mb`, 'Pressure')}
                        ${weatherStat('<i class="fa-solid fa-cloud"></i>', `${cloud}%`, 'Cloud Cover')}
                    </div>`;
            }
        } catch {
            const wc = modal.querySelector('#weatherData');
            if (wc) {
                wc.innerHTML = `<p class="text-muted small mb-0">
                    <i class="fa-solid fa-triangle-exclamation me-1"></i>
                    Weather data is currently unavailable for this location.</p>`;
            }
        }
    }

    modal.addEventListener('hidden.bs.modal', () => modal.remove());
}

function weatherStat(icon, value, label) {
    return `
        <div class="col-6 col-sm-3">
            <div class="weather-stat">
                <div class="weather-stat-icon">${icon}</div>
                <div class="weather-stat-value">${value}</div>
                <div class="weather-stat-label">${label}</div>
            </div>
        </div>`;
}
