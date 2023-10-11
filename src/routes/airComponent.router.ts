import {Router} from "express"
import AirController from "../controllers/air.controller";

const router = Router();

router.get("/", AirController.getAirComponents);

export default router;