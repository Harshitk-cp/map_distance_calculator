import { DirectionsResponseStatus } from "@googlemaps/google-maps-services-js";
import chai from "chai";
import chaiHttp from "chai-http";

import app from "../src/app.js";

if (!process.env.GOOGLE_MAPS_API_KEY) {
  console.error("Environment variable GOOGLE_MAPS_API_KEY not found.");
  process.exit(-1);
}

const { expect } = chai;
chai.use(chaiHttp);

it("testing -> /getDistance", async function () {
  this.timeout(1e4);
  const requester = chai.request(app).keepOpen();

  const promises = [
    requester.post("/getDistance").send({
      origin: { lat: 52.3675734, lng: 4.9041389 },
      destination: { lat: 52.48698419999999, lng: 4.6574468 },
    }),
    requester.post("/getDistance").send({
      origin: { lat: 0, lng: 0 },
      destination: { lat: 0, lng: 0 },
    }),
  ];
  const responses = await Promise.all(promises);
  responses.forEach((res) => {
    expect(res).to.have.status(200);
  });
  requester.close();
});

it("testing -> /getDistance", async function () {
  this.timeout(1e4);
  const requester = chai.request(app).keepOpen();

  const promises = [
    requester.post("/getDistance").send({
      origin: { lng: -10 },
      destination: { lat: 52.4869841999999 },
    }),
    requester.post("/getDistance").send({}),
  ];
  const responses = await Promise.all(promises);
  responses.forEach((res) => {
    expect(res).to.have.status(400);
  });
  requester.close();
});

// it("testing -> /getDistance", async function () {
//   this.timeout(1e4);
//   const req = chai.request(app).post("/getDistance");
//   const res = await req.send({
//     origin: { lat: 52.3675734, lng: 4.9041389 },
//     destination: { lat: 52.48698419999999, lng: 4.6574468 },
//   });
//   expect(res).to.have.status(200);
// });
