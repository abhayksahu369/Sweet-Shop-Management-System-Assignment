const request = require("supertest");
const app = require("../app");
const Sweet = require("../models/sweet.model");
const dbHelper = require("./test-db");

let adminToken;
let userToken;
let sweetId;

beforeAll(async () => {
  await dbHelper.connect();
});

beforeEach(async () => {
  await dbHelper.clear();

  // Create admin user
  await request(app).post("/api/auth/register").send({
    name: "Admin Tester",
    email: "admin@test.com",
    password: "admin123",
    isAdmin: true
  });

  // Create regular user
  await request(app).post("/api/auth/register").send({
    name: "User Tester",
    email: "user@test.com",
    password: "user123",
    isAdmin: false
  });

  // Login admin
  const adminRes = await request(app).post("/api/auth/login").send({
    email: "admin@test.com",
    password: "admin123"
  });
  adminToken = adminRes.body.token;

  // Login user
  const userRes = await request(app).post("/api/auth/login").send({
    email: "user@test.com",
    password: "user123"
  });
  userToken = userRes.body.token;

  // Add a sweet for testing
  const sweet = await Sweet.create({
    name: "Ladoo",
    category: "Festival",
    price: 10,
    quantity: 5
  });
  sweetId = sweet._id;
});

afterAll(async () => {
  await dbHelper.close();
});

describe("Sweet Purchase & Restock API", () => {

  // ---------------- PURCHASE ----------------
  it("should allow a user to purchase a sweet with a specified amount", async () => {
  const res = await request(app)
    .post(`/api/sweets/${sweetId}/purchase`)
    .set("Authorization", `Bearer ${userToken}`)
    .send({ amount: 2 }); // purchase 2 sweets

  expect(res.status).toBe(200);
  expect(res.body.message).toBe("Successfully purchased 2 sweet(s)");
  expect(res.body.remainingQuantity).toBe(3); // assuming initial quantity was 5
});

it("should not allow purchase of more than available stock", async () => {
  const res = await request(app)
    .post(`/api/sweets/${sweetId}/purchase`)
    .set("Authorization", `Bearer ${userToken}`)
    .send({ amount: 10 }); // more than current stock

  expect(res.status).toBe(400);
  expect(res.body.error).toBe("Not enough stock available");
});

it("should not allow purchase with invalid amount", async () => {
  const res = await request(app)
    .post(`/api/sweets/${sweetId}/purchase`)
    .set("Authorization", `Bearer ${userToken}`)
    .send({ amount: 0 }); // invalid amount

  expect(res.status).toBe(400);
  expect(res.body.error).toBe("Invalid purchase amount");
});

it("should not allow purchase if sweet is out of stock", async () => {
  await Sweet.findByIdAndUpdate(sweetId, { quantity: 0 });

  const res = await request(app)
    .post(`/api/sweets/${sweetId}/purchase`)
    .set("Authorization", `Bearer ${userToken}`)
    .send({ amount: 1 });

  expect(res.status).toBe(400);
  expect(res.body.error).toBe("Not enough stock available");
});

it("should return 404 if sweet does not exist during purchase", async () => {
  const fakeId = "6530c2ddf1a12e1234567890";

  const res = await request(app)
    .post(`/api/sweets/${fakeId}/purchase`)
    .set("Authorization", `Bearer ${userToken}`)
    .send({ amount: 1 });

  expect(res.status).toBe(404);
  expect(res.body.error).toBe("Sweet not found");
});

  // ---------------- RESTOCK ----------------
  it("should allow admin to restock a sweet", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ amount: 10 });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Sweet restocked successfully");
    expect(res.body.newQuantity).toBe(15); // 5 + 10
  });

  it("should not allow non-admin to restock", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ amount: 5 });

    expect(res.status).toBe(403);
  });

  it("should return 400 if restock amount is invalid", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ amount: 0 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid restock amount");
  });

  it("should return 404 if sweet does not exist during restock", async () => {
    const fakeId = "6530c2ddf1a12e1234567890";

    const res = await request(app)
      .post(`/api/sweets/${fakeId}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ amount: 5 });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Sweet not found");
  });

});
