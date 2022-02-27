exports.handleCustomError = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handle400Error = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid ID type" });
  } else if (err.code === "23502" || err.code === "22001") {
    res.status(400).send({ msg: "Invalid input" });
  } else next(err);
};

exports.handle404Error = (err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ msg: "Requested ID not found" });
  } else next(err);
};

exports.handleServerError = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
};
