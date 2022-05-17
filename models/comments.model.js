const db = require("../db/connection");
  
  exports.deleteCommentsModel = (commentId) => {
    return db
      .query(
        `
              DELETE FROM comments
              WHERE comment_id = $1;`,
        [commentId]
      )
      .then((deleteConf) => {
        const { rowCount } = deleteConf;
        if (rowCount === 0) {
          return Promise.reject({
            status: 404,
            msg: "No comment found to delete",
          });
        } else return;
      });
  };

  exports.patchCommentByIdModel = (comment_id, inc_votes) => {
    return db.query(`UPDATE comments SET votes = votes + ($2)
    WHERE comment_id = $1 RETURNING *;`, [comment_id, inc_votes])
    .then((result)=> {
      if(result.rows.length>0){
        return result.rows[0]
      } else {
        return Promise.reject({status:404, msg: "Path not found"})
      }
    })
    }