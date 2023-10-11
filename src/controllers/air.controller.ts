import {Request, Response} from "express"
import prisma from "../utils/prisma"
import ApiResponse from "../utils/apiResponse"

class AirController {
    public getAirComponents = async (req: Request, res: Response) => {
        const airComponents = await prisma.air_components.findMany();

        return new ApiResponse().send(res, {
            httpCode: 200,
            status: "success",
            msg: "Air components fetched successfully",
            data: {
                airComponents
            }
        });
    }
}

export default new AirController();