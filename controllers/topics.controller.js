const {
    getTopicsModel,
    postTopicsModel
  } = require("../models/topics.model.js");

exports.getTopicsController = (req, res, next) => {
    getTopicsModel()
      .then((topics) => {
        res.status(200).send({ topics });
      })
      .catch((err) => next(err));
  };

  exports.postTopicsController = (req, res, next) => {
    postTopicsModel(req.body)
      .then((topic) => {
        res.status(201).send({ topic });
      })
      .catch(next);
  };