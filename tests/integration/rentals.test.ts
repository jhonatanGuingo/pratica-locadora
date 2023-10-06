import app from "app";
import supertest from "supertest";

describe("Rentals Service Unit Tests", () => {
  
  it("should return status 422 if movies <1 or >4", async () => {
    const body = {
      userId: 1,
      moviesId: [1,2,3,4,5]
    }
    const body2 = {
      userId: 1,
      moviesId: []
    }
    const result = await supertest(app).post("/rentals").send(body);
    const result2 = await supertest(app).post("/rentals").send(body2);
    expect(result.status).toBe(422);
    expect(result2.status).toBe(422);
  })
  
})