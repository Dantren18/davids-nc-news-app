const {
    getUsersModel,
    getUserByUsernameModel
  } = require("../models/users.model.js");

exports.getUsersController = (req, res, next) => {
    getUsersModel()
      .then((users) => {
        res.status(200).send({ users });
      })
      .catch((err) => next(err));
  };


exports.getUserByUsernameController = (req, res, next) => {
    const { username } = req.params;

    getUserByUsernameModel(username).then((user) => {
            res.status(200).send({ user: user })
        })
        .catch((err) => {
            next(err)
        });
};