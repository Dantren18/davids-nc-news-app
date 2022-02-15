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
  describe.only("/api/topics", () => {
    describe("GET Request", () => {
      test("Status 200: response to be an array of objects of length 3", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body: { rows } }) => {
            expect(rows.length).toEqual(3);
            expect(typeof rows[0]).toEqual("object");
            expect(Array.isArray(rows)).toEqual(true);
          });
      });
      test("Each object in the array should have the keys of slug and description. Ttheir values should be strings", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body: { rows } }) => {
            rows.forEach((topic) => {
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
          .then(({ body: { rows } }) => {
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
            expect(rows).toEqual(topics);
          });
      });
    });
  });
  describe("GET /api/articles/:article:id", () => {
    test("Should return yahdsahdsa", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {});
    });
  });
});
