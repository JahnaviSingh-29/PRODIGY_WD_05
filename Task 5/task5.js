const API_KEY = 'dedd63b1ac187ffb6460a7f4f42a03f4'; // Your OpenWeatherMap API key
const searchBtn = document.getElementById('search-btn');
const locationBtn = document.getElementById('location-btn');
const weatherInfo = document.getElementById('weather-info');

// Function to fetch weather data based on city name
const fetchWeather = async (query) => {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${API_KEY}`
        );

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Check if the city was found
        if (data.cod === 200) {
            displayWeather(data);
        } else {
            alert('City not found!');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error); // Log the error for debugging
        alert('Error fetching weather data. Please try again.');
    }
};

// Function to fetch weather data based on geolocation
const fetchWeatherByLocation = async (lat, lon) => {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error('Error fetching weather data by location:', error); // Log the error
        alert('Error fetching weather data. Please try again.');
    }
};

// Function to display weather information
const displayWeather = (data) => {
    document.getElementById('city-name').textContent = data.name;
    document.getElementById('description').textContent =
        data.weather[0].description;
    document.getElementById('temperature').textContent = Math.round(
        data.main.temp
    );
    document.getElementById('humidity').textContent = data.main.humidity;
    document.getElementById('wind-speed').textContent = data.wind.speed;

    weatherInfo.classList.remove('hidden');
};

// Event listener for the search button
searchBtn.addEventListener('click', () => {
    const query = document.getElementById('location-input').value.trim(); // Trim whitespace
    if (query) {
        fetchWeather(query);
    } else {
        alert('Please enter a city name.');
    }
});

// Event listener for the location button
locationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByLocation(latitude, longitude);
            },
            (error) => {
                console.error('Error getting location:', error); // Log geolocation errors
                alert('Unable to retrieve your location.');
            }
        );
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});