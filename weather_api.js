const WEATHER_API_KEY = '1e3b85e050384eb5a6135658240312';
const WEATHER_API_URL = 'https://api.weatherapi.com/v1/current.json';

async function fetchWeather(city) {
    try {
        const response = await fetch(`${WEATHER_API_URL}?key=${WEATHER_API_KEY}&q=${city}`);
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        const weatherData = await response.json();
        return weatherData;
    } catch (error) {
        console.error(`Error fetching weather data: ${error.message}`);
        throw error;
    }
}

export { fetchWeather };
