import prisma from "../src/utils/prisma"
import {AirComponent, ILocation, IMonitorResponse, Station} from "../src/types"
import {getMonitorsByCity} from "../src/api"
import {aqiDataSeeder} from "../src/utils/aqiDataSeeder"


const getAirComponents = (): AirComponent[] => {
    return [
        {
            name: "co",
            unit: "ppb",
            description: "Carbon monoxide"
        },
        {
            name: "dew",
            unit: "°C",
            description: "Dew point"
        },
        {
            name: "no2",
            unit: "ppb",
            description: "Nitrogen dioxide"
        },
        {
            name: "o3",
            unit: "ppb",
            description: "Ozone"
        },
        {
            name: "p",
            unit: "hPa",
            description: "Pressure"
        },
        {
            name: "pm25",
            unit: "ug/m3",
            description: "Particulate matter < 2.5 microns"
        },
        {
            name: "so2",
            unit: "ppb",
            description: "Sulfur dioxide"
        },
        {
            name: "w",
            unit: "s/m",
            description: "Wind speed"
        },
        {
            name: "t",
            unit: "°C",
            description: "Temperature"
        },
        {
            name: "h",
            unit: "%",
            description: "Humidity"
        },
        {
            name: "aqi",
            unit: "AQI-US",
            description: "Air Quality Index"
        },
        {
            name: "wg",
            unit: "s/m",
            description: "Wind gust"
        },
        {
            name: "pm10",
            unit: "ug/m3",
            description: "Particulate matter < 10 microns"
        }
    ]
}

const getAllStations = async (): Promise<Station[]> => {
    const res: IMonitorResponse = await getMonitorsByCity("Hanoi")
    return res.Locations.map((location: ILocation) => {
        return {
            name: location.locationName,
            latitude: location.lat,
            longitude: location.lon,
            locationId: location.locationId,
        }
    })
}

const airComponentSeeder = async (): Promise<void> => {
    const airComponents: AirComponent[] = getAirComponents();
    await prisma.air_components.createMany({
        data: [...airComponents]
    });
}

const stationSeeder = async (): Promise<void> => {
    const stations: Station[] = await getAllStations();
    await prisma.stations.createMany({
        data: [...stations]
    });
}

const seed = async (): Promise<void> => {
    await airComponentSeeder();
    await stationSeeder();
    await aqiDataSeeder();
}

seed();