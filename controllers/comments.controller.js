const {
    deleteCommentsModel, patchCommentByIdModel
  } = require("../models/comments.model.js");

  exports.deleteCommentsController = (req, res, next) => {
    const { comment_id } = req.params;
    deleteCommentsModel(comment_id)
      .then(() => {
        res.status(204).send();
      })
      .catch(next);
  };

  exports.patchCommentByIdController = (req, res, next) => {
    const {comment_id} = req.params;
    const { inc_votes} = req.body;
    patchCommentByIdModel(comment_id, inc_votes).then((comment)=>{
    res.status(200).send({comment})
  }).catch((err)=> {
    next(err)
  })
  }