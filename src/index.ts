import "dotenv/config"
import express from "express"
import routes from "./routes"
import cors from "cors"
import "./utils/bigintToJson"
import {aqiDataSeeder} from "./utils/aqiDataSeeder"

const PORT = process.env.PORT || 8088;

const app = express();

app.use(cors());
app.use("/api/v1", routes);

app.listen(PORT, async () => {
    console.log(`Server is running at http://localhost:${PORT}`);

    console.log("Seeding AQI data...");
    await aqiDataSeeder();
    console.log("Seeding AQI data completed!");
});