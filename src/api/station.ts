import axios from "../utils/axios.ts"
import {IAirComponent, IResponse, IStation, IStationResponse, ITable} from "../types";

export const getAllStations = async (): Promise<IStationResponse> => {
    const res = await axios.get("/stations");
    return res.data;
}

export const getStationById = async (id: string): Promise<IResponse & { station: IStation }> => {
    const res = await axios.get(`/stations/${id}`);
    return res.data;
}

export const getAirComponents = async (): Promise<IResponse & { airComponents: IAirComponent[] }> => {
    const res = await axios.get("/airs");
    return res.data;
}

export const getLocationHistory24Hour = async (locationId: string, sensorId: string): Promise<IResponse & {history: ITable}> => {
    const res = await axios.get("/history-24h", {
        params: {
            locationId,
            sensorId
        }
    });

    return res.data;
}

export const getLocationHistoryWeek = async (locationId: string, sensorId: string): Promise<IResponse & {history: ITable}> => {
    const res = await axios.get("/history-week", {
        params: {
            locationId,
            sensorId
        }
    });

    return res.data;
}

