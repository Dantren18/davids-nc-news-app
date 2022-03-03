const app = require("../app.js");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const request = require("supertest");
const jestSorted = require("jest-sorted");

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
    test("Status 200: Each object in the array should have the keys of slug and description. Ttheir values should be strings", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          topics.forEach((topic) => {
            expect(Object.keys(topic).length).toEqual(2);
            expect(topic).toEqual(
              expect.objectContaining({
                description: expect.any(String),
                slug: expect.any(String),
              })
            );
          });
        });
    });
    test("Status 200: Should return correct data", () => {
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
    test("Status 400: Should recieve a status 400 error message when inputting an invalid article id", () => {
      return request(app)
        .get("/api/articles/sausages")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toEqual("Invalid ID");
        });
    });
    test("Status 404: Should recieve a status 404 error message when inputting an valid article id that doesn't exist", () => {
      return request(app)
        .get("/api/articles/999999")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toEqual("ID Doesn't Exist");
        });
    });
    test("Status 200: Item should be object of length 7 in an array", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(Object.keys(body.article).length).toEqual(8);
          expect(typeof body).toEqual("object");
          expect(typeof body.article).toEqual("object");
        });
    });
    test("Status 200: Correct data should be returned for ID 1", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual({
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
    test("Status 200: Article with 0 comments correctly returns", () => {
      return request(app)
        .get("/api/articles/4")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual({
            article_id: 4,
            author: "rogersop",
            body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
            comment_count: "0",
            created_at: "2020-05-06T02:14:00.000Z",
            title: "Student SUES Mitch!",
            topic: "mitch",
            votes: 0,
          });
        });
    });
    test("Status 200: Correct data should be returned for ID 3", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual({
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
  describe("PATCH /api/articles/:article_id", () => {
    test("Status 200: Should increase vote count by 1 returning update article and 200 status code.", () => {
      const incVotes = { inc_votes: 1 };
      return request(app)
        .patch("/api/articles/1")
        .send(incVotes)
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual({
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
    test("Status 200: Should decrease vote count by 1 returning update article and 200 status code", () => {
      const incVotes = { inc_votes: -1 };
      return request(app)
        .patch("/api/articles/3")
        .send(incVotes)
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual({
            article_id: 3,
            author: "icellusedkars",
            body: "some gifs",
            created_at: "2020-11-03T09:12:00.000Z",
            title: "Eight pug gifs that remind me of mitch",
            topic: "mitch",
            votes: -1,
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
    test("Status 404 - patch to an valid article id, but the article doesnt exist", () => {
      return request(app)
        .patch("/api/articles/5000000")
        .send({ inc_votes: 0 })
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toEqual("Not Found");
        });
    });
    test("Status 200: Returned item should be a single article with correct properties", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual({
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
    test("Status 400 - request api is invalid", () => {
      return request(app)
        .patch("/api/articles/sausages")
        .send({ inc_votes: 0, favouritePet: "dogs" })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toEqual("Bad Request");
        });
    });
  });
  describe("GET /api/articles", () => {
    test("Status 200: should return array of correct length and keys, sorted by ascending date", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toEqual(12);
          expect(typeof articles[0]).toEqual("object");
          expect(articles).toBeSortedBy("created_at", {
            descending: true,
          });
          expect(Array.isArray(articles)).toEqual(true);
          articles.forEach((article) => {
            expect(Object.keys(article).length).toEqual(7);
            expect(article).toEqual(
              expect.objectContaining({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(String),
              })
            );
          });
        });
    });
    test("Status: 200 sorts by sort_by", () => {
      return request(app)
        .get("/api/articles?sort_by=title&order=asc&topic=cats")
        .expect(200)
        .then(({ body }) => {
          body.articles.forEach((article) => {
            expect(Object.keys(article).length).toEqual(7);
            expect(article).toEqual(
              expect.objectContaining({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: "cats",
                author: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(String),
              })
            );
          });
          expect([{ body }]).toBeSortedBy("title", {
            ascending: true,
          });
        });
    });
    test("Status: 400 invalid order", () => {
      return request(app)
        .get("/api/articles?sort_by=title&order=XXXXXX")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe(
            "Invalid order query - choose between asc and desc"
          );
        });
    });
    test("Status: 400 invalid sort", () => {
      return request(app)
        .get("/api/articles?sort_by=XXXXXX")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe(
            "Invalid sort query - you can sort by title, topic, author, created_at, votes, or article_id"
          );
        });
    });
    test("Status: 200 valid topic but no data", () => {
      return request(app)
        .get("/api/articles?sort_by=title&topic=paper")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toEqual([]);
        });
    });
    test("Status: 404 topic not found for topic input that is not in the database", () => {
      return request(app)
        .get("/api/articles?sort_by=title&topic=XXXX")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual("Topic not found");
        });
    });
    test("Status 404: When inputting an valid article id that doesn't exist, should receive 404", () => {
      return request(app)
        .get("/api/articles/999999")
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "ID Doesn't Exist" });
        });
    });
  });
  describe("GET /articles/:article_id/comments", () => {
    test("Status 200 - responds with all comments on a given article", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(Array.isArray(comments)).toBe(true);
          expect(comments.length).toBe(11);
          comments.forEach((comment) => {
            expect(Object.keys(comment).length).toEqual(5);
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
              })
            );
          });
        });
    });
    test("Status 400: responds with an error 400 when passed invalid ID", () => {
      return request(app)
        .get("/api/articles/notAnID/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test("Status 404: responds with an error 404 when passed id does not exist", () => {
      return request(app)
        .get("/api/articles/20/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found!");
        });
    });
    test("Status 200: valid id but has no comments, respons with an empty array", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(Array.isArray(comments)).toBe(true);
          expect(comments.length).toBe(0);
          expect(comments).toEqual([]);
        });
    });
  });
  describe("POST /api/articles/:article_id/comments", () => {
    test("status 201: responds with the posted comment object", () => {
      const commentTest = { username: "icellusedkars", body: "test comment" };
      const article_id = 1;
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(commentTest)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toMatchObject({
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            article_id: expect.any(Number),
            created_at: expect.any(String),
          });
        });
    });
    test("status 201: responds with the posted comment object even if client sends object with unecessary keys", () => {
      const commentTest = {
        username: "icellusedkars",
        body: "test comment",
        besttutor: "Kev",
      };
      const article_id = 1;
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(commentTest)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toMatchObject({
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            article_id: expect.any(Number),
            created_at: expect.any(String),
          });
        });
    });
    test("status 404: responds with an error message if article id is valid but not in the database", () => {
      const commentTest = { username: "icellusedkars", body: "test comment" };
      const article_id = 999;
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(commentTest)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Requested ID not found");
        });
    });
    test("status 400: responds with an error message if article id is an invalid data type", () => {
      const commentTest = { username: "icellusedkars", body: "test comment" };
      const article_id = "notanid";
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(commentTest)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid ID type");
        });
    });
    test("status 400: responds with an error message if new comment does not have body or username properties", () => {
      const commentTest = {
        userGnome: "icellusedkars",
        body: "test comment",
      };
      const article_id = 1;
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(commentTest)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });
    test("status 404: responds with an error message if new comment username does not currently exist", () => {
      const commentTest = {
        username: "test_user",
        body: "3",
      };
      const article_id = 1;
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(commentTest)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("User does not exist");
        });
    });
  });
  describe("DELETE /api/comments/:comment_id", () => {
    test("Status 204: no response body, successfully deletes requested comment", () => {
      const commentToDelete = 1;
      return request(app)
        .delete(`/api/comments/${commentToDelete}`)
        .expect(204);
    });
    test("Status 404: responds with an error message if comment id is valid but not currently in the database", () => {
      const commentToDelete = 9999;
      return request(app)
        .delete(`/api/comments/${commentToDelete}`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("No comment found to delete");
        });
    });
    test("Status 400: responds with an error message if comment id is an invalid data type", () => {
      const commentToDelete = "DELETE_ME";
      return request(app)
        .delete(`/api/comments/${commentToDelete}`)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid ID type");
        });
    });
  });
  describe("GET /api", () => {
    test("Status 200: responds with a JSON object describing endpoints in the api", () => {
      return request(app).get(`/api`).expect(200);
      //unsure what I should be testing for on this one
    });
  });
});
