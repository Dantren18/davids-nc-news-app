const express = require("express");
const {
  getTopicsController,
  getArticleByIDController,
} = require("./controllers/controllers.js");
const app = express();

app.get("/api/topics", getTopicsController);
app.get("/api/articles/:article_id", getArticleByIDController);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.sendStatus(500);
});

module.exports = app;
