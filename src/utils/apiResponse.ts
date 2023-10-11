import {Response} from "express"

export interface IApiResponse<T> {
    httpCode: number
    status: "success" | "error"
    msg: string
    data?: T
}

class ApiResponse {
    public send = <T>(res: Response, params: IApiResponse<T>) => {
        return res.status(params.httpCode).json({
            status: params.status,
            msg: params.msg,
            ...params.data
        });
    }
}

export default ApiResponse;