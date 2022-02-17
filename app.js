const express = require("express");
const {
  getTopicsController,
  getArticleByIDController,
  patchArticleByIdController,
} = require("./controllers/controllers.js");
const app = express();
app.use(express.json());

app.get("/api/topics", getTopicsController);
app.get("/api/articles/:article_id", getArticleByIDController);

app.patch("/api/articles/:article_id", patchArticleByIdController);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.sendStatus(err.status);
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ message: "Something Internal Went Wrong" });
});

module.exports = app;
