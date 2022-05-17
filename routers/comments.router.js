const express = require('express')

const {deleteCommentsController, patchCommentByIdController} = require("../controllers/comments.controller")

const commentsRouter = express.Router();

commentsRouter.delete("/:comment_id", deleteCommentsController);

commentsRouter.patch("/:comment_id", patchCommentByIdController);


module.exports = commentsRouter