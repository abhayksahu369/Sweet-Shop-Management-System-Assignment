const request = require("supertest");
const app = require("../app");
const Sweet = require("../models/sweet.model");
const dbHelper = require("./test-db");

let adminToken;
let userToken;
let sweetItemId;

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

  // Login regular user
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
  sweetItemId = sweet._id;
});

afterAll(async () => {
  await dbHelper.close();
});

describe("Sweets API - Protected Routes", () => {

  // ---------------- CREATE ----------------
  it("should allow admin to create a new sweet", async () => {
    const sweetData = {
      name: "Jalebi",
      category: "Special",
      price: 25,
      quantity: 15
    };

    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(sweetData);

    expect(res.status).toBe(201);
    expect(res.body.name).toBe("Jalebi");

    sweetItemId = res.body._id; 
  });

  it("non-admin cannot create a sweet", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "Jalebi", category: "Special", price: 25, quantity: 10 });

    expect(res.status).toBe(403);
  });

  it("should reject creation with missing fields", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Kaju Katli" }); // missing price, quantity, category

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Failed to add sweet");
  });

  // ---------------- GET ALL ----------------
  it("should fetch all available sweets", async () => {
    await Sweet.create({ name: "Laddu", category: "Festival", price: 10, quantity: 30 });

    const res = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // ---------------- SEARCH ----------------
  it("should find sweets by partial name match", async () => {
    await Sweet.create({ name: "Rasgulla", category: "Bengali", price: 40, quantity: 20 });

    const res = await request(app)
      .get("/api/sweets/search")
      .set("Authorization", `Bearer ${userToken}`)
      .query({ name: "ras" });

    expect(res.status).toBe(200);
    expect(res.body[0].name).toBe("Rasgulla");
  });

  // ---------------- UPDATE ----------------
  it("should update sweet details", async () => {
    const sweet = await Sweet.create({ name: "Barfi", category: "Dry", price: 50, quantity: 10 });

    const res = await request(app)
      .put(`/api/sweets/${sweet._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ price: 60, quantity: 12, name: "Barfi", category: "Dry" });

    expect(res.status).toBe(200);
    expect(res.body.price).toBe(60);
  });

  it("should return 404 for updating non-existent sweet", async () => {
    const res = await request(app)
      .put(`/api/sweets/6530c2ddf1a12e1234567890`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ price: 100, name: "NonExist", category: "Special", quantity: 5 });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Sweet not found");
  });

  // ---------------- DELETE ----------------
  it("should delete a sweet successfully", async () => {
    const sweet = await Sweet.create({ name: "Peda", category: "Milk", price: 20, quantity: 3 });
    const res = await request(app)
      .delete(`/api/sweets/${sweet._id}`)
      .set("Authorization", `Bearer ${adminToken}`);
    console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Sweet deleted successfully");
  });

  it("should return 404 when deleting a non-existent sweet", async () => {
    const res = await request(app)
      .delete(`/api/sweets/6530c2ddf1a12e1234567890`)
      .set("Authorization", `Bearer ${adminToken}`);
    console.log(res.body);
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Sweet not found");
  });

  it("non-admin cannot delete a sweet", async () => {
    const res = await request(app)
      .delete(`/api/sweets/${sweetItemId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(403);
  });


});
