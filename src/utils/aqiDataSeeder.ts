import prisma from "./prisma"
import {IAirComponent, ILocation, IMonitorResponse} from "../types"
import {getMonitorsByCity} from "../api"
import dayjs from "dayjs";

const aqiDataSeeder = async (): Promise<void> => {
    const res: IMonitorResponse = await getMonitorsByCity("Hanoi");
    const locations: ILocation[] = res.Locations;

    for (const location of locations) {
        let station = await prisma.stations.findFirst({
            where: {
                locationId: location.locationId
            }
        });

        if (!station) {
            station = await prisma.stations.create({
                data: {
                    name: location.locationName,
                    latitude: location.lat,
                    longitude: location.lon,
                    locationId: location.locationId
                }
            });
        }

        const stationId = Number(station?.id);

        const airComponents: IAirComponent[] = location.airComponents;

        for (const airComponent of airComponents) {
            if (airComponent.sensorName === "AQI-IN") continue;

            const air = await prisma.air_components.findUnique({
                where: {
                    name: airComponent.sensorName
                }
            });

            const airId = Number(air?.id);

            const airComponentStation = await prisma.air_component_station.findFirst({
                where: {
                    stationId: stationId,
                    airComponentId: airId
                }
            });

            if (!airComponentStation) continue;

            await prisma.air_component_station.update({
                where: {
                    id: airComponentStation!.id,
                },
                data: {
                    data: airComponent.sensorData,
                    updatedAt: dayjs.unix(Number(location.timeStamp)).toDate()
                }
            });
        }
    }
}

export {aqiDataSeeder}