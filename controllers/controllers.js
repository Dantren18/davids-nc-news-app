const { getTopicsModel, getArticleByIDModel } = require("../models/models.js");

exports.getTopicsController = (req, res) => {
  getTopicsModel()
    .then((topics) => {
      res.status(200).send(topics);
    })
    .catch((err) => next(err));
};

exports.getArticleByIDController = (req, res) => {
  let id = req.params.article_id;
  getArticleByIDModel(id).then((articles) => {
    res.status(200).send(articles);
  });
};
