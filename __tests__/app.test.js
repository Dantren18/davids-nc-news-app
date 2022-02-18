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
  describe("GET /api/topics", () => {
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
  describe("GET /api/articles/:article_id", () => {
    describe("Status 400: bad request", () => {
      test("Should recieve a status 400 error message when inputting an invalid article id", () => {
        return request(app)
          .get("/api/articles/sausages")
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toEqual("Invalid ID");
          });
      });
    });
    describe("Status 404: Not Found", () => {
      test("Should recieve a status 404 error message when inputting an valid article id that doesn't exist", () => {
        return request(app)
          .get("/api/articles/999999")
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toEqual("ID Doesn't Exist");
          });
      });
    });
    describe("Should return an article object with correct properties", () => {
      test("Item should be object of length 7 in an array", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            expect(Object.keys(body).length).toEqual(8);
            expect(typeof body).toEqual("object");
          });
      });
    });
    describe("Should return correct article data for given ID", () => {
      test("Correct data should be returned for ID 1", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            expect(body).toEqual({
              article_id: 1,
              author: "butter_bridge",
              body: "I find this existence challenging",
              comment_count: "11",
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
          .then(({ body }) => {
            expect(body).toEqual({
              article_id: 3,
              author: "icellusedkars",
              body: "some gifs",
              comment_count: "2",
              created_at: "2020-11-03T09:12:00.000Z",
              title: "Eight pug gifs that remind me of mitch",
              topic: "mitch",
              votes: 0,
            });
          });
      });
    });
  });
  describe("PATCH /api/articles/:article_id", () => {
    test("Status 200: Should increase vote count by 1 returning update article and 200 status code.", () => {
      const incVotes = { inc_votes: 1 };
      return request(app)
        .patch("/api/articles/3")
        .send(incVotes)
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({
            article_id: 3,
            title: "Eight pug gifs that remind me of mitch",
            body: "some gifs",
            votes: 1,
            topic: "mitch",
            author: "icellusedkars",
            created_at: "2020-11-03T09:12:00.000Z",
          });
        });
    });
    test("Status 200: Should decrease vote count by 1 returning update article and 200 status code", () => {
      const incVotes = { inc_votes: -1 };
      return request(app)
        .patch("/api/articles/3")
        .send(incVotes)
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({
            article_id: 3,
            title: "Eight pug gifs that remind me of mitch",
            body: "some gifs",
            votes: -1,
            topic: "mitch",
            author: "icellusedkars",
            created_at: "2020-11-03T09:12:00.000Z",
          });
        });
    });
    test("Status 400 - inc_vote value is not a number in request body", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "dog" })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad Request");
        });
    });
    test("Status 400 - inc_vote value is not included in request body", () => {
      return request(app)
        .patch("/api/articles/2")
        .send({ inc_votes: "" })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad Request");
        });
    });
    test("Status 400 - request body includes other unrelated property", () => {
      return request(app)
        .patch("/api/articles/5")
        .send({ inc_votes: 0, favouritePet: "dogs" })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toEqual("Bad Request");
        });
    });
    test("Status 422 - key is wrong name / spelled incorrectly", () => {
      return request(app)
        .patch("/api/articles/5")
        .send({ inc_votessssss: 1 })
        .expect(422)
        .then((res) => {
          expect(res.body.msg).toEqual("Unprocessable Entity");
        });
    });
  });
  describe("GET /api/users", () => {
    test("Status 200: response to be an array of objects of length 3", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users.length).toEqual(4);
          expect(typeof users[0]).toEqual("object");
          expect(Array.isArray(users)).toEqual(true);
        });
    });
    test("Each object in the array should have the keys of slug and description. Ttheir values should be strings", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          users.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
              })
            );
          });
        });
    });
    describe("Status 400: bad request", () => {
      test("Should recieve a status 404 error message when inputting an valid article id that doesn't exist", () => {
        return request(app)
          .get("/api/articles/999999")
          .expect(404)
          .then(({ body }) => {
            expect(body).toEqual({ msg: "ID Doesn't Exist" });
          });
      });
    });
  });
  describe("PATCH /api/articles/:article_id", () => {
    describe("Properties of response should be correct", () => {
      test("Returned item should be a single article with correct properties", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 1 })
          .expect(200)
          .then((articles) => {
            expect(articles.body).toEqual({
              article_id: 1,
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: "2020-07-09T21:11:00.000Z",
              title: "Living in the shadow of a great man",
              topic: "mitch",
              votes: 101,
            });
          });
      });
    });
    test("Should return correct data", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          const usersData = [
            { username: "butter_bridge" },
            { username: "icellusedkars" },
            { username: "rogersop" },
            { username: "lurker" },
          ];
          expect(users).toEqual(usersData);
        });
    });
  });
});
