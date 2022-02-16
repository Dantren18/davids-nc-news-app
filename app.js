const express = require("express");
const {
  getTopicsController,
  getArticleByIDController,
  patchArticleByIDController,
} = require("./controllers/controllers.js");
const app = express();

app.get("/api/topics", getTopicsController);
app.get("/api/articles/:article_id", getArticleByIDController);
app.patch("/api/articles/:article_id", patchArticleByIDController);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.sendStatus(500);
});

module.exports = app;
