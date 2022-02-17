const { getTopicsModel, getArticleByIDModel } = require("../models/models.js");

exports.getTopicsController = (req, res) => {
  getTopicsModel()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => next(err));
};

exports.getArticleByIDController = (req, res) => {
  let id = req.params.article_id;
  getArticleByIDModel(id)
    .then((articles) => {
      console.log(articles, "articles in controller");
      res.status(200).send({ articles });
    })
    .catch((err) => next(err));
};

exports.patchArticleByIDController = (req, res) => {
  let id = req;
  console.log(id, "id is here");
};
