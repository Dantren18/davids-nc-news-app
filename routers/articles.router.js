
const express = require("express");
const {
    getArticleByIDController,
    getArticlesController,
    patchArticleByIdController,
    getCommentsController,
    postCommentController,
    postArticleController,
    deleteArticleController
} = require("../controllers/articles.controller");

const articlesRouter = express.Router();

articlesRouter.get("/:article_id", getArticleByIDController);

articlesRouter.patch("/:article_id", patchArticleByIdController);

articlesRouter.get("/", getArticlesController);

articlesRouter.get("/:article_id/comments", getCommentsController);

articlesRouter.post("/:article_id/comments", postCommentController)

articlesRouter.post("/:article_id/comments", postCommentController)

articlesRouter.post("/", postArticleController)

articlesRouter.delete("/:article_id", deleteArticleController)

module.exports = articlesRouter;