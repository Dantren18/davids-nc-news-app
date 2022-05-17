
const express = require("express");
const {
    getTopicsController,
    postTopicsController
} = require("../controllers/topics.controller");

const topicsRouter = express.Router();

topicsRouter.get("/", getTopicsController);
topicsRouter.post("/", postTopicsController);


module.exports = topicsRouter;