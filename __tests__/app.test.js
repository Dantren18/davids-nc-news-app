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
          .then(({ body: { topics } }) => {
            expect(topics.length).toEqual(3);
            expect(typeof topics[0]).toEqual("object");
            expect(Array.isArray(topics)).toEqual(true);
          });
      });
      test("Each object in the array should have the keys of slug and description. Ttheir values should be strings", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body: { topics } }) => {
            topics.forEach((topic) => {
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
          .then(({ body: { topics } }) => {
            const topicsData = [
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
            expect(topics).toEqual(topicsData);
          });
      });
    });
  });
  describe("GET /api/articles/:article_id", () => {});
  describe("Should return an article object with correct properties", () => {
    test("Item should be object of length 7 in an array", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toEqual(1);
          expect(Object.keys(articles[0]).length).toEqual(7);
          expect(typeof articles[0]).toEqual("object");
        });
    });
    test("Item should have correct keys", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { articles } }) => {
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                article_id: expect.any(Number),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                title: expect.any(String),
                topic: expect.any(String),
                votes: expect.any(Number),
              })
            );
          });
        });
    });
  });
  describe("Should return correct article data for given ID", () => {
    test("Correct data should be returned for ID 1", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles[0]).toEqual({
            article_id: 1,
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T21:11:00.000Z",
            title: "Living in the shadow of a great man",
            topic: "mitch",
            votes: 100,
          });
        });
    });
    test("Correct data should be returned for ID 3", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles[0]).toEqual({
            article_id: 3,
            author: "icellusedkars",
            body: "some gifs",
            created_at: "2020-11-03T09:12:00.000Z",
            title: "Eight pug gifs that remind me of mitch",
            topic: "mitch",
            votes: 0,
          });
        });
    });
  });
});
