import axios from "axios"

const WEATHER_API_KEY = process.env.WEATHER_API_KEY
const AQI_API_KEY = process.env.AQI_API_KEY

const weatherInstance = axios.create({
    baseURL: "https://api.weatherapi.com/v1",
    params: {
        key: WEATHER_API_KEY
    }
});

const aqiInstance = axios.create({
    baseURL: "https://api.aqi.in/api/v1/",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": AQI_API_KEY
    }
});

export { weatherInstance, aqiInstance };