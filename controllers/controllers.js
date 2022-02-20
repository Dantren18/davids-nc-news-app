const {
  getTopicsModel,
  getArticleByIDModel,
  getCommentsModel,
  updateArticleByIdModel,
  getUsersModel,
  getArticlesModel,
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

exports.getCommentsController = (req, res, next) => {
  const id = req.params.article_id;
  getCommentsModel(id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => next(err));
};

// exports.getCommentsController = (req, res, next) => {
//   console.log(req.params, "req in controller");
//   console.log(req.query);
//   getCommentsModel(req.params, req.query)
//     .then((comments) => {
//       if (comments.length === 0) {
//         return Promise.all([comments, checkArticleExist(req.params)]);
//       } else {
//         return [comments, true];
//       }
//     })
//     .then(([comments, articleExists]) => {
//       if (!articleExists) {
//         return Promise.reject({ status: 404, msg: "Comments not found" });
//       } else {
//         res.status(200).send({ comments });
//       }
//     })
//     .catch(next);
// };

// USERS CONTROLLERS

exports.getUsersController = (req, res, next) => {
  getUsersModel()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => next(err));
};
