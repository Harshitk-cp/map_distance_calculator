import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { Client } from "@googlemaps/google-maps-services-js";
import { join } from "path";
import * as url from "url";

const CLIENT = new Client();
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const STATIC_FOLDER_PATH = join(__dirname, "..", "..", "frontend");

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(STATIC_FOLDER_PATH));

app.post("/getDistance", async (req, res) => {
  const { body } = req;
  if (!body || !body.origin || !body.destination) {
    res.sendStatus(400);
    return;
  }

  if (
    typeof body.origin.lat !== "number" ||
    typeof body.origin.lng !== "number"
  ) {
    res.sendStatus(400);
    return;
  }

  if (
    typeof body.destination.lat !== "number" ||
    typeof body.destination.lng !== "number"
  ) {
    res.sendStatus(400);
    return;
  }

  try {
    const { data } = await CLIENT.distancematrix({
      params: {
        origins: [body.origin],
        destinations: [body.destination],
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});
export default app;
