import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import cookieParser from "cookie-parser";

import { AppModule } from "src/app.module";
import { PrismaService } from "src/common/db/prisma/prisma.service";

describe("User E2E", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let cookie: string;

  const userData = {
    name: "Teste",
    email: "user@test.com",
    password: "Abcde12345@",
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.use(cookieParser());
    await app.init();

    prisma = app.get(PrismaService);

    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should create user", async () => {
    const res = await request(app.getHttpServer())
      .post("/user")
      .send(userData)
      .expect(201);

    expect(res.body.user).toMatchObject({
      name: userData.name,
      id: expect.any(String),
    });

    expect(res.body.user.email).not.toBe(userData.email);
  });

  it("should not allow duplicate email", async () => {
    await request(app.getHttpServer())
      .post("/user")
      .send(userData)
      .expect(400);
  });

  it("should login", async () => {
    const res = await request(app.getHttpServer())
      .post("/auth/login")
      .send({
        email: userData.email,
        password: userData.password,
      })
      .expect(200);

    expect(res.body).toEqual({ success: true });

    const cookies = res.headers["set-cookie"];
    cookie = cookies[0].split(";")[0];
  });

  it("should not access /user/me without auth", async () => {
    await request(app.getHttpServer()).get("/user/me").expect(401);
  });

  it("should get current user", async () => {
    const res = await request(app.getHttpServer())
      .get("/user/me")
      .set("Cookie", cookie)
      .expect(200);

    expect(res.body.user).toMatchObject({
      id: expect.any(String),
      name: userData.name,
    });
  });

  it("should update user", async () => {
    const res = await request(app.getHttpServer())
      .patch("/user")
      .set("Cookie", cookie)
      .send({ name: "Novo Nome" })
      .expect(200);

    expect(res.body.user.name).toBe("Novo Nome");
  });

  it("should delete user", async () => {
    const res = await request(app.getHttpServer())
      .delete("/user")
      .set("Cookie", cookie)
      .expect(200);

    expect(res.body.user).toHaveProperty("id");
  });

  it("should not access after delete", async () => {
    await request(app.getHttpServer())
      .get("/user/me")
      .set("Cookie", cookie)
      .expect(404);
  });
});