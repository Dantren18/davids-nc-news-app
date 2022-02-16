const {
  getTopicsModel,
  getArticleByIDModel,
  patchArticleByIDModel,
} = require("../models/models.js");

const db = require("../db/connection");

exports.getTopicsController = (req, res) => {
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
      res.status(200).send({ articles });
    })
    .catch((err) => next(err));
};

exports.patchArticleByIDController = (req, res) => {
  console.log(req.params, "request here");
};
