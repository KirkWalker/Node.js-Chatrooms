const request = require("supertest");
const app = require("../server.js");

describe("Router tesing functions", () => {
  test("Unauthorized - Should respond with 401 status code", async () => {
    await request(app)
      .get("/badpath")
      .set("Content-Type", "application/json")
      .expect(401);
  });
});
