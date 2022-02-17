const {
  getTopicsModel,
  getArticleByIDModel,
  updateArticleByIdModel,
} = require("../models/models.js");

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

exports.patchArticleByIdController = (req, res, next) => {
  const { article_id } = req.params;
  const newVote = req.body;
  updateArticleByIdModel(article_id, newVote)
    .then((articles) => {
      const article = articles.find(
        (article) => article.article_id === Number.parseInt(article_id)
      );
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
