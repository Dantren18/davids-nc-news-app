const {
    getArticleByIDModel,
    updateArticleByIdModel,
    getArticlesModel,
    getCommentsModel,
    postCommentsModel,
    postArticleModel, deleteArticleModel
  } = require("../models/articles.model.js");

exports.getArticleByIDController = (req, res, next) => {
    let id = req.params.article_id;
    getArticleByIDModel(id)
      .then((article) => {
        res.status(200).send({ article });
      })
      .catch((err) => {
        next(err);
      });
  };
  
  exports.getArticlesController = (req, res, next) => {
    const { sort_by, order, topic } = req.query;
    getArticlesModel(sort_by, order, topic)
      .then((articles) => {
        res.status(200).send({ articles });
      })
      .catch((err) => next(err));
  };
  
  exports.patchArticleByIdController = (req, res, next) => {
    const { article_id } = req.params;
    const newVote = req.body;
    updateArticleByIdModel(article_id, newVote)
      .then((article) => {
        res.status(200).send({ article });
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
  
  exports.postCommentController = (req, res, next) => {
    const { article_id } = req.params;
    const comment = req.body;
    postCommentsModel(article_id, comment)
      .then((comment) => {
        res.status(201).send({ comment });
      })
      .catch((err) => {
        next(err);
      });
  };

  exports.postArticleController = (req, res, next) => {
    const { author, title, body, topic } = req.body;
    postArticleModel(author, title, body, topic)
      .then((article) => {
        res.status(201).send({ article });
      })
      .catch(next);
  };

  exports.deleteArticleController = (req, res, next) => {
    ("in controller")
    const { article_id } = req.params;
    deleteArticleModel(article_id)
      .then((article) => {
        res.status(204).send({ article });
      })
      .catch(next);
  };