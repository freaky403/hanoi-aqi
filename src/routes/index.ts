import {Router} from "express"
import stations from "./station.router"
import airs from "./airComponent.router"
import StationController from "../controllers/station.controller";

const router = Router();

router.use("/stations", stations);
router.use("/airs", airs);

router.get("/history-24h", StationController.getStationHistory24Hour);
router.get("/history-week", StationController.getStationHistoryWeek);

export default router;