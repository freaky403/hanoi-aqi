import "flowbite"
import L, {LatLngTuple} from "leaflet"
import "leaflet/dist/leaflet.css"
import dayjs from "dayjs"
import Chart, {ChartItem} from "chart.js/auto";
import './style.css'
import {
    getAirComponents,
    getAllStations,
    getLocationHistory24Hour,
    getLocationHistoryWeek,
    getStationById
} from "./api/station.ts"
import {checkAqi} from "./utils/checkAqi.ts";
import {getCurrentWeather} from "./api/weather.ts";

const stationSelectEl = document.querySelector("#stations");
const aqiCardEl: HTMLDivElement | null = document.querySelector(".aqi-card");
const aqiCardTitleEl: HTMLSpanElement | null = document.querySelector(".aqi-card-header__title");
const aqiCardDescriptionEl: HTMLSpanElement | null = document.querySelector(".aqi-card-header__description");
const aqiCardUpdatedAtEl: HTMLSpanElement | null = document.querySelector(".aqi-card__updatedAt");
const aqiCardStatusEl: HTMLSpanElement | null = document.querySelector(".aqi-card__status");
const aqiCardValueEl: HTMLSpanElement | null = document.querySelector(".aqi-card__value");
const aqiCardImageEl: HTMLImageElement | null = document.querySelector(".aqi-card__image");
const aqiPm25El: HTMLSpanElement | null = document.querySelector("#pm25-value");
const aqiPm25ProgressEl: HTMLDivElement | null = document.querySelector("#pm25-prg");
const aqiPm10El: HTMLSpanElement | null = document.querySelector("#pm10-value");
const aqiPm10ProgressEl: HTMLDivElement | null = document.querySelector("#pm10-prg");
const aqiCoEl: HTMLSpanElement | null = document.querySelector("#co-value");
const aqiCoProgressEl: HTMLDivElement | null = document.querySelector("#co-prg");
const aqiSo2El: HTMLSpanElement | null = document.querySelector("#so2-value");
const aqiSo2ProgressEl: HTMLDivElement | null = document.querySelector("#so2-prg");
const aqiNo2El: HTMLSpanElement | null = document.querySelector("#no2-value");
const aqiNo2ProgressEl: HTMLDivElement | null = document.querySelector("#no2-prg");
const aqiO3El: HTMLSpanElement | null = document.querySelector("#o3-value");
const aqiO3ProgressEl: HTMLDivElement | null = document.querySelector("#o3-prg");

const airSelectEl = document.querySelector("#pollutants");
const timeSelectEl = document.querySelector("#time");

const weatherLocationEl = document.querySelector(".weather__location");
const weatherUpdatedAtEl = document.querySelector(".weather__updatedAt");
const weatherTemperatureEl = document.querySelector(".weather__temperature");
const weatherFeelsLikeEl = document.querySelector(".weather__feel_temperature");
const weatherIconEl = document.querySelector(".weather__icon");
const weatherConditionEl = document.querySelector(".weather__condition");
const humidityEl = document.querySelector("#humidity-value");
const windSpeedEl = document.querySelector("#wind-value");
const pressureEl = document.querySelector("#pressure-value");

const map = L.map('map').setView([21.028511, 105.804817], 12);

L.tileLayer.wms("http://localhost:9000/geoserver/HaNoi/wms?", {
    layers: "HaNoi:hanoi",
    format: 'image/png',
    transparent: true,
    version: "1.1.0",
}).addTo(map);

L.tileLayer.wms("http://localhost:9000/geoserver/HaNoi/wms?", {
    layers: "HaNoi:hanoibuildings",
    format: "image/png",
    transparent: true,
    version: "1.1.0",
}).addTo(map);

L.tileLayer.wms("http://localhost:9000/geoserver/HaNoi/wms?", {
    layers: "HaNoi:hanoiplaces",
    format: "image/png",
    transparent: true,
    version: "1.1.0",
}).addTo(map);

L.tileLayer.wms("http://localhost:9000/geoserver/HaNoi/wms?", {
    layers: "HaNoi:hanoipoints",
    format: "image/png",
    transparent: true,
    version: "1.1.0",
}).addTo(map);

const addMarker = (station: any) => {
    const marker = L.marker((station.latlng.split(",") as unknown as LatLngTuple), {
        icon: new L.DivIcon({
            className: "my-div-icon",
            html: `<span id="marker" class="marker" style="background-color: ${checkAqi(station.aqi).color}" data-locationId="${station.locationId}" data-latlng="${station.latlng}">${station.aqi}</span>`
        })
    }).addTo(map);

    const popupContent = document.createElement("div");
    popupContent.classList.add("popup-content");
    popupContent.innerHTML = `
        <span>${station.name}</span>
        <span>AQI: ${station.aqi}</span>
        <span>Status: ${checkAqi(station.aqi).status}</span>
    `;

    marker.bindPopup(popupContent);
}

const handleMarkerClick = async (e: Event) => {
    const locationId = (e.target as HTMLSpanElement).dataset.locationid;
    (stationSelectEl as HTMLSelectElement).selectedIndex = [...(stationSelectEl as HTMLSelectElement).options].findIndex(option => option.dataset.locationId === locationId);
    (airSelectEl as HTMLSelectElement).selectedIndex = 1;
    (timeSelectEl as HTMLSelectElement).selectedIndex = 0;
    await loadAqiData((stationSelectEl as HTMLSelectElement).value);
    await loadHistory24h(locationId);
    await loadWeather();
}

const loadStations = async () => {
    const res = await getAllStations();
    return res.stations.map(station => ({
        id: station.id,
        name: station.name,
        locationId: station.locationId,
        latlng: `${station.latitude},${station.longitude}`,
        aqi: station.air_components.find(airComponent => airComponent.air_component.name === "aqi")?.data
    }));
}

const renderStations = async () => {
    const stations = await loadStations();
    stations.forEach(station => {
        const option = document.createElement("option");
        option.value = station.id;
        option.text = station.name;
        option.dataset.locationId = station.locationId;
        option.dataset.latlng = station.latlng;

        if (option.value === "1") {
            option.selected = true;
        }

        stationSelectEl!.appendChild(option);
        addMarker(station);
    })
}

const loadHistory24h = async (locationId: string = "8641", sensorId: string = "aqi") => {
    const res = await getLocationHistory24Hour(locationId, sensorId);
    const data = res.history.Data[0];

    const backgroundColors = data.averageArray.map(value => {
        const {color} = checkAqi(value);
        return color;
    });

    const chartEl = document.querySelector("#historic-chart");
    chartEl!.remove();
    const newChartEl = document.createElement("canvas");
    newChartEl.id = "historic-chart";
    newChartEl.style.maxWidth = "100%";
    document.querySelector(".chart")!.appendChild(newChartEl);

    new Chart((document.querySelector("#historic-chart") as ChartItem), {
        type: "bar",
        data: {
            labels: data.timeArray2,
            datasets: [
                {
                    label: `Average ${data.chartName}`,
                    data: data.averageArray,
                    backgroundColor: backgroundColors,
                }
            ]
        }
    });
}

const loadHistoryWeek = async (locationId: string = "8641", sensorId: string = "aqi") => {
    const res = await getLocationHistoryWeek(locationId, sensorId);
    const data = res.history.Data[0];

    const backgroundColors = data.averageArray.map(value => {
        const {color} = checkAqi(value);
        return color;
    });

    const chartEl = document.querySelector("#historic-chart");
    chartEl!.remove();
    const newChartEl = document.createElement("canvas");
    newChartEl.id = "historic-chart";
    newChartEl.style.maxWidth = "100%";
    document.querySelector(".chart")!.appendChild(newChartEl);

    new Chart((document.querySelector("#historic-chart") as ChartItem), {
        type: "bar",
        data: {
            labels: data.timeArray2,
            datasets: [
                {
                    label: `Average ${data.chartName}`,
                    data: data.averageArray,
                    backgroundColor: backgroundColors,
                }
            ]
        }
    });
}

const loadAqiData = async (stationId: string = "1") => {
    const res = await getStationById(stationId);
    const station = res.station;

    const airComponents = station.air_components;

    const pm25 = airComponents.find(airComponent => airComponent.air_component.name === "pm25");
    const pm25Check = pm25 ? checkAqi(pm25.data) : {status: "N/A", color: ""};

    const pm10 = airComponents.find(airComponent => airComponent.air_component.name === "pm10");
    const pm10Check = pm10 ? checkAqi(pm10.data) : {status: "N/A", color: ""};

    const co = airComponents.find(airComponent => airComponent.air_component.name === "co");
    const coCheck = co ? checkAqi(co.data) : {status: "N/A", color: ""};

    const so2 = airComponents.find(airComponent => airComponent.air_component.name === "so2");
    const so2Check = so2 ? checkAqi(so2.data) : {status: "N/A", color: ""};

    const no2 = airComponents.find(airComponent => airComponent.air_component.name === "no2");
    const no2Check = no2 ? checkAqi(no2.data) : {status: "N/A", color: ""};

    const o3 = airComponents.find(airComponent => airComponent.air_component.name === "o3");
    const o3Check = o3 ? checkAqi(o3.data) : {status: "N/A", color: ""};

    const aqi = airComponents.find(airComponent => airComponent.air_component.name === "aqi");
    const aqiCheck = aqi ? checkAqi(aqi.data) : {status: "N/A", color: ""};

    const max = Math.max(pm25?.data || 0, pm10?.data || 0, co?.data || 0, so2?.data || 0, no2?.data || 0, o3?.data || 0);

    aqiCardTitleEl!.innerText = station.name;
    aqiCardDescriptionEl!.innerText = `Real-time PM2.5, PM10 air pollution level at ${station.name}`;
    aqiCardUpdatedAtEl!.innerText = `Updated at ${dayjs(aqi!.updatedAt).format("HH:mm DD/MM/YYYY")}`;
    aqiCardStatusEl!.innerText = aqiCheck.status;
    aqiCardStatusEl!.style.backgroundColor = aqiCheck.color;
    aqiCardEl!.style.setProperty("--aqi-card-background", `url(/src/assets/images/${aqiCheck.status.toLowerCase()}-air-quality-background-image.png)`);
    aqiCardValueEl!.innerText = aqi!.data.toString();
    aqiCardValueEl!.style.color = aqiCheck.color;
    aqiCardImageEl!.src = `/src/assets/images/${aqiCheck.status.toLowerCase()}.png`;

    aqiPm25El!.innerText = pm25 ? pm25.data.toString() : "N/A";
    aqiPm25ProgressEl!.style.width = pm25 ? `${pm25.data / max * 100}%` : "0";
    aqiPm25ProgressEl!.style.backgroundColor = pm25Check.color;

    aqiPm10El!.innerText = pm10 ? pm10.data.toString() : "N/A";
    aqiPm10ProgressEl!.style.width = pm10 ? `${pm10.data / max * 100}%` : "0";
    aqiPm10ProgressEl!.style.backgroundColor = pm10Check.color;

    aqiCoEl!.innerText = co ? co.data.toString() : "N/A";
    aqiCoProgressEl!.style.width = co ? `${co.data / max * 100}%` : "0";
    aqiCoProgressEl!.style.backgroundColor = coCheck.color;

    aqiSo2El!.innerText = so2 ? so2.data.toString() : "N/A";
    aqiSo2ProgressEl!.style.width = so2 ? `${so2.data / max * 100}%` : "0";
    aqiSo2ProgressEl!.style.backgroundColor = so2Check.color;

    aqiNo2El!.innerText = no2 ? no2.data.toString() : "N/A";
    aqiNo2ProgressEl!.style.width = no2 ? `${no2.data / max * 100}%` : "0";
    aqiNo2ProgressEl!.style.backgroundColor = no2Check.color;

    aqiO3El!.innerText = o3 ? o3.data.toString() : "N/A";
    aqiO3ProgressEl!.style.width = o3 ? `${o3.data / max * 100}%` : "0";
    aqiO3ProgressEl!.style.backgroundColor = o3Check.color;
}

const handleStationChange = async (e: Event) => {
    (airSelectEl as HTMLSelectElement).selectedIndex = 1;
    (timeSelectEl as HTMLSelectElement).selectedIndex = 0;
    const stationId = (e.target as HTMLSelectElement).value;
    const locationId = (e.target as HTMLSelectElement).options[(e.target as HTMLSelectElement).selectedIndex].dataset.locationId;
    await loadAqiData(stationId);
    await loadHistory24h(locationId);
    await loadWeather();
}

const loadAirs = async () => {
    const res = await getAirComponents();
    return res.airComponents.map(air => ({
        id: air.id,
        name: air.name,
    }));
}

const renderAirs = async () => {
    const airs = await loadAirs();
    airs.forEach(air => {
        const option = document.createElement("option");
        option.value = air.name;
        option.text = air.name;

        if (option.value === "aqi") {
            option.selected = true;
        }

        airSelectEl!.appendChild(option);
    });
}

const handleAirChange = async (e: Event) => {
    const airName = (e.target as HTMLSelectElement).value;
    const locationId = (stationSelectEl as HTMLSelectElement).options[(stationSelectEl as HTMLSelectElement).selectedIndex].dataset.locationId;
    await loadHistory24h(locationId, airName);
}

const loadWeather = async () => {
    const latlng = (stationSelectEl as HTMLSelectElement).options[(stationSelectEl as HTMLSelectElement).selectedIndex].dataset.latlng;
    const res = await getCurrentWeather(latlng!);
    const {location, current} = res;
    (weatherLocationEl as HTMLSpanElement).innerText = location.name;
    (weatherUpdatedAtEl as HTMLSpanElement).innerText = `Updated at ${dayjs(current.last_updated).format("HH:mm DD/MM/YYYY")}`;
    (weatherTemperatureEl as HTMLSpanElement).innerText = `${current.temp_c}°C`;
    (weatherFeelsLikeEl as HTMLSpanElement).innerText = `Feel like: ${current.feelslike_c}°C`;
    (weatherIconEl as HTMLImageElement).src = `https:${current.condition.icon}`;
    (weatherConditionEl as HTMLSpanElement).innerText = current.condition.text;
    (humidityEl as HTMLSpanElement).innerText = `${current.humidity}`;
    (windSpeedEl as HTMLSpanElement).innerText = `${current.wind_kph}`;
    (pressureEl as HTMLSpanElement).innerText = `${current.pressure_mb}`;
}

document.addEventListener("DOMContentLoaded", async () => {
    await renderStations();
    await renderAirs();
    await loadAqiData();
    await loadHistory24h();
    await loadWeather();
    stationSelectEl!.addEventListener("change", handleStationChange);
    airSelectEl!.addEventListener("change", handleAirChange);
    timeSelectEl!.addEventListener("change", async (e: Event) => {
        const time = (e.target as HTMLSelectElement).value;
        const locationId = (stationSelectEl as HTMLSelectElement).options[(stationSelectEl as HTMLSelectElement).selectedIndex].dataset.locationId;
        if (time === "24h") {
            await loadHistory24h(locationId);
        } else {
            await loadHistoryWeek(locationId);
        }
    });
    const markers = document.querySelectorAll(".marker");
    markers.forEach(marker => marker.addEventListener("click", handleMarkerClick));
});


