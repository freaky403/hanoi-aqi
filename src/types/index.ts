export interface IResponse {
    status: string
    msg: string
}

export interface IStation {
    id: string
    name: string
    latitude: string
    longitude: string
    locationId: string
    air_components: { data: number, updatedAt: string, air_component: IAirComponent }[]
}

export interface IAirComponent {
    id: string
    name: string
    unit: string
    description: string
}

export interface IStationResponse extends IResponse {
    stations: IStation[]
}

export interface ITable {
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

