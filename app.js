const express = require("express");
const {
  getTopicsController,
  getArticleByIDController,

  patchArticleByIdController,
  getUsersController,
  getArticlesController,
} = require("./controllers/controllers.js");
const app = express();

app.use(express.json());

///API/TOPICS
app.get("/api/topics", getTopicsController);

///API/ARTICLES
app.get("/api/articles/:article_id", getArticleByIDController);

app.patch("/api/articles/:article_id", patchArticleByIdController);

///API/USERS
app.get("/api/users", getUsersController);

///ERRORS


app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Something Internal Went Wrong" });

});

module.exports = app;
