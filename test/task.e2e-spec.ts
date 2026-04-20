import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import cookieParser from "cookie-parser";

import { AppModule } from "src/app.module";
import { PrismaService } from "src/common/db/prisma/prisma.service";
import { makeHash } from "src/common/functions/make-hash";

describe("Task E2E", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let cookie: string;
  let taskId: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.use(cookieParser());
    await app.init();

    prisma = app.get(PrismaService);

    await prisma.task.deleteMany();
    await prisma.user.deleteMany();

    const hashedPassword = await makeHash("123456");

    await prisma.user.create({
      data: {
        email: "test@test.com",
        password: hashedPassword,
        name: "Teste",
      },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it("login", async () => {
    const res = await request(app.getHttpServer())
      .post("/auth/login")
      .send({
        email: "test@test.com",
        password: "123456",
      })
      .expect(200);

    expect(res.body).toEqual({ success: true });

    const cookies = res.headers["set-cookie"];
    cookie = cookies[0].split(";")[0];
  });

  it("should fail without auth", async () => {
    await request(app.getHttpServer()).get("/task").expect(401);
  });

  it("create task", async () => {
    const res = await request(app.getHttpServer())
      .post("/task")
      .set("Cookie", cookie)
      .send({
        status: "PROGRESS",
        description: "Task 1",
      })
      .expect(201);

    expect(res.body.task).toMatchObject({
      status: "PROGRESS",
      description: "Task 1",
    });

    expect(res.body.task.id).toEqual(expect.any(String));

    taskId = res.body.task.id;
  });

  it("get tasks", async () => {
    const res = await request(app.getHttpServer())
      .get("/task")
      .set("Cookie", cookie)
      .expect(200);

    expect(Array.isArray(res.body.tasks)).toBe(true);
    expect(res.body.tasks.length).toBeGreaterThan(0);

    expect(res.body.tasks[0]).toMatchObject({
      id: expect.any(String),
      status: expect.any(String),
      description: expect.any(String),
    });
  });

  it("get task by id", async () => {
    const res = await request(app.getHttpServer())
      .get(`/task/${taskId}`)
      .set("Cookie", cookie)
      .expect(200);

    expect(res.body.task).toMatchObject({
      id: taskId,
      status: "PROGRESS",
      description: "Task 1",
    });
  });

  it("update task", async () => {
    const res = await request(app.getHttpServer())
      .patch(`/task/${taskId}`)
      .set("Cookie", cookie)
      .send({ description: "updated" })
      .expect(200);

    expect(res.body.task.description).toBe("updated");
  });

  it("delete task", async () => {
    const res = await request(app.getHttpServer())
      .delete(`/task/${taskId}`)
      .set("Cookie", cookie)
      .expect(200);

    expect(res.body.task.id).toBe(taskId);
  });
});