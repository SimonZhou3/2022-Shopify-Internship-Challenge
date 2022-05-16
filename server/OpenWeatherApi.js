import 'dotenv/config';
import fetch from 'node-fetch';

// API call to fetch lon and lat of the city
async function getLonAndLatOfLocation(location) {
    return fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + location + '&appid='+ process.env.OPEN_WEATHER_API_KEY)
        .then((response) => response.json())
        .then((jsonResponse) => {
            let lat = jsonResponse[0]['lat'];
            let lon = jsonResponse[0]['lon'];
            return {
                lat,
                lon
            }
        })
}

// API call to fetch the weather description of the city
 export async function getWeatherDescription(location) {
    return getLonAndLatOfLocation(location)
        .then((coordinates) => {
                return fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + coordinates.lat + '&lon=' + coordinates.lon + '&appid='+ process.env.OPEN_WEATHER_API_KEY);
            }
        ).then((response) =>{
            return response.json();
        })
        .then((weatherResponse) => {
            return weatherResponse['weather'][0]['description'];
        });
}
