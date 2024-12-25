export async function fetchWeather(city) {
    const WEATHER_API_KEY = '1e3b85e050384eb5a6135658240312';
    const WEATHER_API_URL = 'https://api.weatherapi.com/v1/current.json';

    try {
        console.log(`Fetching weather for city: ${city}`);
        const response = await fetch(`${WEATHER_API_URL}?key=${WEATHER_API_KEY}&q=${encodeURIComponent(city)}`);
        
        console.log('Weather API response status:', response.status);
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response text:', errorText);
            throw new Error('Failed to fetch weather data');
        }

        const weatherData = await response.json();
        console.log('Weather data:', weatherData);
        return weatherData;
    } catch (error) {
        console.error(`Error fetching weather data: ${error.message}`);
        throw error;
    }
}