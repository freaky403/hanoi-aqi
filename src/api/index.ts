import dayjs from "dayjs"
import {aqiInstance, weatherInstance} from "../utils/axios"
import {ILastWeekForecast, ILocationHistory, IMonitorResponse} from "../types";

export const getMonitorsByCity = (city: string): Promise<IMonitorResponse> => {
    return aqiInstance.get("/getMonitorsByCity", {
        headers: {
            cityname: city
        }
    }).then(res => res.data);
}

export const getLocationHistory24h = async (locationId: string, sendevId: string = "aqi"): Promise<ILocationHistory> => {
    const res = await aqiInstance.get("/getLocationHistory24Hour", {
        headers: {
            locationid: locationId,
            searchtype: "locationId",
            sendevId: sendevId
        }
    });
    return res.data;
}

export const getLocationHistoryWeek = async (locationId: string, sendevId: string = "aqi"): Promise<ILocationHistory> => {
    const res = await aqiInstance.get("/getLocationHistoryWeek", {
        headers: {
            locationid: locationId,
            searchtype: "locationId",
            sendevId: sendevId
        }
    });
    return res.data;
}

export const getLastWeekForecast = async (locationId: string, sendevId: string = "aqi"): Promise<ILastWeekForecast> => {
    const res = await aqiInstance.get("/getlastweekforecastData", {
        headers: {
            locationid: locationId,
            searchtype: "locationId",
            sendevId: sendevId
        }
    });
    return res.data;
}

export const getCurrentWeather = (latlng: string) => {
    return weatherInstance.get("/current.json", {
        params: {
            q: latlng,
        }
    }).then(res => res.data);
}

export const getForecastWeather = (latlng: string) => {
    return weatherInstance.get("/forecast.json", {
        params: {
            q: latlng,
            days: 8,
            aqi: "yes",
            alerts: "yes"
        }
    }).then(res => res.data);
}

export const getAstronomyWeather = (latlng: string) => {
    return weatherInstance.get("/astronomy.json", {
        params: {
            q: latlng,
            dt: dayjs().format("YYYY/MM/DD")
        }
    }).then(res => res.data);
}

