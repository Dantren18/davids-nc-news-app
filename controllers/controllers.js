const {
  getTopicsModel,
  getArticleByIDModel,

  updateArticleByIdModel,
  getUsersModel,
} = require("../models/models.js");

const db = require("../db/connection");


exports.getTopicsController = (req, res, next) => {
  getTopicsModel()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => next(err));
};

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

exports.getUsersController = (req, res, next) => {
  getUsersModel()
    .then((users) => {
      res.status(200).send({ users });

    })
    .catch((err) => next(err));
};

exports.patchArticleByIDController = (req, res) => {
  console.log(req.params, "request here");
};
