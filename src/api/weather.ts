import axios from "axios"

const BASE_URI = "https://api.weatherapi.com/v1/current.json";
const WEATHER_API_KEY = "2dbf726a758b40e2a4d101106202810";

export const getCurrentWeather = async (latlng: string) => {
    const res = await axios.get(BASE_URI, {
        params: {
            q: latlng,
            key: WEATHER_API_KEY
        }
    });
    return res.data;
}