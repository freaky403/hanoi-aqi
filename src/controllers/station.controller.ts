import {Request, Response} from "express"
import prisma from "../utils/prisma"
import ApiResponse from "../utils/apiResponse"
import {getLastWeekForecast, getLocationHistory24h, getLocationHistoryWeek} from "../api";
import {ILastWeekForecast} from "../types";

class StationController {
    public getAllStations = async (req: Request, res: Response) => {
        const stations = await prisma.stations.findMany({
            include: {
                air_components: {
                    include: {
                        air_component: true
                    }
                }
            }
        });

        return new ApiResponse().send(res, {
            httpCode: 200,
            status: "success",
            msg: "All stations fetched successfully",
            data: {
                stations
            }
        });
    }

    public getStationById = async (req: Request, res: Response) => {
        const {id} = req.params;
        const station = await prisma.stations.findUnique({
            where: {
                id: parseInt(id)
            },
            include: {
                air_components: {
                    include: {
                        air_component: true
                    }
                }
            }
        });

        if (!station) {
            return new ApiResponse().send(res, {
                httpCode: 404,
                status: "error",
                msg: "Station not found!"
            });
        }

        return new ApiResponse().send(res, {
            httpCode: 200,
            status: "success",
            msg: "Station fetched successfully",
            data: {
                station
            }
        });
    }

    public getLastWeekForecast = async (req: Request, res: Response) => {
        const {locationId, sensorId} = req.query;

        if (!locationId) {
            return new ApiResponse().send(res, {
                httpCode: 400,
                status: "error",
                msg: "Location ID is required!"
            });
        }

        const data: ILastWeekForecast = await getLastWeekForecast(<string>locationId, <string>sensorId);
        const forecasts = data.Data.map(forecast => {
            return {
                ...forecast,
                sensor: sensorId || "aqi"
            }
        });

        return new ApiResponse().send(res, {
            httpCode: 200,
            status: "success",
            msg: "Last week forecast fetched successfully",
            data: {
                forecasts
            }
        });
    }

    public getStationHistory24Hour = async (req: Request, res: Response) => {
        const {locationId, sensorId} = req.query;

        if (!locationId) {
            return new ApiResponse().send(res, {
                httpCode: 400,
                status: "error",
                msg: "Location ID is required!"
            });
        }

        const data = await getLocationHistory24h(<string>locationId, <string>sensorId);
        const history = data.Table;

        return new ApiResponse().send(res, {
            httpCode: 200,
            status: "success",
            msg: "Station history fetched successfully",
            data: {
                history
            }
        });
    }

    public getStationHistoryWeek = async (req: Request, res: Response) => {
        const {locationId, sensorId} = req.query;

        if (!locationId) {
            return new ApiResponse().send(res, {
                httpCode: 400,
                status: "error",
                msg: "Location ID is required!"
            });
        }

        const data = await getLocationHistoryWeek(<string>locationId, <string>sensorId);
        const history = data.Table;

        return new ApiResponse().send(res, {
            httpCode: 200,
            status: "success",
            msg: "Station history fetched successfully",
            data: {
                history
            }
        });
    }
}

export default new StationController();