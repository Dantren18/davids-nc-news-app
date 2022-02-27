const {
  getTopicsModel,
  getArticleByIDModel,
  getCommentsModel,
  updateArticleByIdModel,
  getUsersModel,
  getArticlesModel,
  postCommentsModel,
  deleteCommentsModel,
} = require("../models/models.js");

//// TOPICS CONTROLLERS

const db = require("../db/connection");

exports.getTopicsController = (req, res, next) => {
  getTopicsModel()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => next(err));
};

///ARTICLES CONTROLLERS

exports.getArticleByIDController = (req, res, next) => {
  let id = req.params.article_id;
  getArticleByIDModel(id)
    .then((articles) => {
      res.status(200).send(articles[0]);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticlesController = (req, res, next) => {
  getArticlesModel()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => next(err));
};

exports.patchArticleByIdController = (req, res, next) => {
  const { article_id } = req.params;
  const newVote = req.body;
  updateArticleByIdModel(article_id, newVote)
    .then((articles) => {
      res.status(200).send(articles[0]);
    })
    .catch((err) => {
      next(err);
    });
};

// USERS CONTROLLERS

exports.getUsersController = (req, res, next) => {
  getUsersModel()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => next(err));
};

//COMMENTS CONTROLLERS
exports.getCommentsController = (req, res, next) => {
  const id = req.params.article_id;
  getCommentsModel(id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => next(err));
};

exports.postCommentController = (req, res, next) => {
  const { article_id } = req.params;
  const comment = req.body;
  postCommentsModel(article_id, comment)
    .then((insertComment) => {
      res.status(201).send({ insertComment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentsController = (req, res, next) => {
  const { comment_id } = req.params;
  deleteCommentsModel(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

//API
exports.getApiController = (req, res, next) => {
  console.log("Inside controller");
  res.status(200).send({
    "GET /api": {
      description:
        "serves up a json representation of all the available endpoints of the api",
    },
    "GET /api/topics": {
      description: "serves an array of all topics",
      exampleResponse: {
        topics: [{ slug: "football", description: "Footie!" }],
      },
    },
    "GET /api/articles/:article_id": {
      description:
        "serves an array containing a single object of the requested article object ",
      exampleResponse: {
        article: [
          {
            article_id: 1,
            title: "Creating an app",
            body: "This is how to create an app",
            votes: 0,
            topic: "coding",
            author: "mrsmith",
            created_at: "2020-11-07T06:03:00.000Z",
            comment_count: "4",
          },
        ],
      },
    },
    "PATCH /api/articles/:article_id": {
      description:
        "Updates the votes property of the mentioned article, returns an array containing the updated article object",
      exampleRequest: { inc_votes: 3 },
      exampleResponse: {
        article: [
          {
            article_id: 1,
            title: "Creating an app",
            body: "This is how to create an app",
            votes: 0,
            topic: "coding",
            author: "mrsmith",
            created_at: "2020-11-07T06:03:00.000Z",
            comment_count: "6",
          },
        ],
      },
    },
    "GET /api/articles": {
      description: "Returns an array of all topics",
      exampleResponse: {
        articles: [
          {
            author: "mistersmith",
            title: "Seafood substitutions are increasing",
            article_id: 31,
            topic: "cooking",
            author: "weegembump",
            created_at: "020-03-11T21:16:00.000Z",
            votes: 0,
            comment_count: "2",
          },
        ],
      },
    },
    "GET /api/articles/:article_id/comments": {
      description:
        "serves an array containing all the comment objects for the requested article",
      exampleResponse: {
        comments: [
          {
            comment_id: 12,
            votes: 4,
            created_at: "2020-09-26T17:16:00.000Z",
            author: "mrSmith",
            body: "I don't like this article",
          },
        ],
      },
    },
    "POST /api/articles/:article_id/comments": {
      description:
        "adds a new comment for the requested article, serves an array containing the new comment object",
      exampleRequest: { username: "icellusedkars", body: "test comment" },
      exampleResponse: {
        comment: [
          {
            article_id: 12,
            votes: 4,
            created_at: "2020-09-26T17:16:00.000Z",
            author: "mrSmith",
            body: "I don't like this article",
          },
        ],
      },
    },
    "DELETE /api/comments/:comment_id": {
      description: "deletes the request comment from the database",
    },
  });
};
