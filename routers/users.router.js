const express = require("express");
const {
    getUsersController,
    getUserByUsernameController
} = require("../controllers/users.controller");

const usersRouter = express.Router();

usersRouter.get("/", getUsersController);
usersRouter.get("/:username", getUserByUsernameController);



module.exports = usersRouter;