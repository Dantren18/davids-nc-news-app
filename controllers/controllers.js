const { getTopicsModel } = require("../models/models.js");

exports.getTopicsController = (req, res) => {
  getTopicsModel()
    .then((topics) => {
      res.status(200).send(topics);
    })
    .catch((err) => next(err));
};
