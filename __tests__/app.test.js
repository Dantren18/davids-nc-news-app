const app = require("../app.js");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const request = require("supertest");

afterAll(() => db.end());

beforeEach(() => seed(data));

describe("App", () => {
  describe("Status 404", () => {
    test("should respond with error message for incorrect api path", () => {
      return request(app)
        .get("/api/notavalidpath")
        .expect(404)
        .then(({ body }) => {
          const response = { msg: "Route not found" };
          expect(body).toEqual(response);
        });
    });
  });
  describe("/api/topics", () => {
    describe("GET Request", () => {
      test("Status 200: response to be an array of objects of length 3", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body.length).toEqual(3);
            expect(typeof body[0]).toEqual("object");
            expect(Array.isArray(body)).toEqual(true);
          });
      });
      test("Each object in the array should have the keys of slug and description. Ttheir values should be strings", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            body.forEach((topic) => {
              expect(topic).toEqual(
                expect.objectContaining({
                  description: expect.any(String),
                  slug: expect.any(String),
                })
              );
            });
          });
      });
      test("Should return correct data", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            const topics = [
              {
                description: "The man, the Mitch, the legend",
                slug: "mitch",
              },
              {
                description: "Not dogs",
                slug: "cats",
              },
              {
                description: "what books are made of",
                slug: "paper",
              },
            ];
            expect(body).toEqual(topics);
          });
      });
    });
  });
});
