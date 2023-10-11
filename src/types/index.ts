export type AirComponent = {
    name: string
    unit: string
    description: string
}

export type Station = {
    name: string
    latitude: string
    longitude: string
    locationId: string
}

export interface IMonitorResponse {
    status: number
    Locations: ILocation[]
}

export interface ILocation {
    locationName: string
    locationId: string
    lat: string
    lon: string
    timeStamp: string
    updated_at: string
    timeago: string
    cityName: string
    sensorcount: number
    airComponents: IAirComponent[]
}

export interface IAirComponent {
    sensorName: string
    sensorData: number
    senDevId: string
    sensorUnit: string
}

export interface ILastWeekForecast {
    status: number
    Data: { day: string, value: number }[]
}

export interface ILocationHistory {
    Table: {
        locationId: string
        sensorName: string
        Data: {
            maxValue: number,
            minValue: number,
            avgValue: number,
            chartName: string,
            averageArray: number[],
            timeArray: string[],
            timeArray2: string[]
        }[]
    }
}