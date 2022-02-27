const express = require("express");
const {
  getTopicsController,
  getArticleByIDController,
  getCommentsController,
  patchArticleByIdController,
  getUsersController,
  getArticlesController,
  postCommentController,
  deleteCommentsController,
  getApiController,
} = require("./controllers/controllers.js");
const app = express();

const {
  handleCustomError,
  handleServerError,
  handle400Error,
  handle404Error,
} = require("./errors");

app.use(express.json());

app.get("/api", getApiController);

///API/TOPICS
app.get("/api/topics", getTopicsController);

///API/ARTICLES
app.get("/api/articles/:article_id", getArticleByIDController);
app.get("/api/articles", getArticlesController);

app.patch("/api/articles/:article_id", patchArticleByIdController);

///API/USERS
app.get("/api/users", getUsersController);

////COMMENTS
app.get("/api/articles/:article_id/comments", getCommentsController);
app.post("/api/articles/:article_id/comments", postCommentController);
app.delete("/api/comments/:comment_id", deleteCommentsController);

///ERRORS

app.use(handleCustomError);
app.use(handle400Error);
app.use(handle404Error);
app.use(handleServerError);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Something Internal Went Wrong" });
});

module.exports = app;
