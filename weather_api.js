const WEATHER_API_KEY = '1e3b85e050384eb5a6135658240312';
const WEATHER_API_URL = 'https://api.weatherapi.com/v1/current.json';

async function fetchWeather(city) {
    if (!city) {
        throw new Error('City name is required to fetch weather data.');
    }

    try {
        const url = `${WEATHER_API_URL}?key=${WEATHER_API_KEY}&q=${encodeURIComponent(city)}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch weather data. Status: ${response.status}`);
        }

        const weatherData = await response.json();

        if (!weatherData || !weatherData.current || !weatherData.location) {
            throw new Error('Invalid weather data received.');
        }

        return weatherData;
    } catch (error) {
        console.error(`Error fetching weather data: ${error.message}`);
        throw error;
    }
}

export { fetchWeather };
