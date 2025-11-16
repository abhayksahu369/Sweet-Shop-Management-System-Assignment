const request = require("supertest");
const app = require("../app");
const User = require("../models/user.model");
const db = require("./test-db");


beforeAll(async () => db.connect());
afterEach(async () => db.clear());
afterAll(async () => db.close());

// ====================== REGISTER TESTS ======================
describe("Auth API - Register", () => {

  test("should register a new user successfully", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Abhay",
      email: "abhay@example.com",
      password: "password123",
    });

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe("abhay@example.com");
    expect(res.body.user).not.toHaveProperty("password"); 
  });

  test("should not allow duplicate email registration", async () => {
    await User.create({
      name: "Abhay",
      email: "abhay@example.com",
      password: "hashed",
    });

    const res = await request(app).post("/api/auth/register").send({
      name: "Abhay",
      email: "abhay@example.com",
      password: "password123",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Email already exists");
  });
});

// ====================== LOGIN TESTS ======================
describe("Auth API - Login", () => {

  beforeEach(async () => {
    await request(app).post("/api/auth/register").send({
      name: "Abhay",
      email: "abhay@example.com",
      password: "password123",
    });
  });

  test("should login successfully with valid credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "abhay@example.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token"); 
    expect(res.body.user.email).toBe("abhay@example.com");
  });

  test("should fail login with incorrect password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "abhay@example.com",
      password: "wrongPassword",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid email or password");
  });

  test("should fail if email does not exist", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "notexist@example.com",
      password: "password123",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid email or password");
  });

});
