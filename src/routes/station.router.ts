import {Router} from "express"
import StationController from "../controllers/station.controller";

const router = Router();

router.get("/", StationController.getAllStations);
router.get("/:id", StationController.getStationById);
router.get("/last-week-forecast", StationController.getLastWeekForecast);

export default router;