const express = require("express");
const commentsRouter = require("./comments.router")
const articlesRouter = require("./articles.router");
const usersRouter = require("./users.router");
const topicsRouter = require('./topics.router');
const { getApi } = require("../controllers/api.controller");

const apiRouter = express.Router();

// apiRouter.get("/api", getApiController);

apiRouter.get("/", getApi);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/comments", commentsRouter)


module.exports = apiRouter;