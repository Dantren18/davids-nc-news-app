const db = require("../db/connection");

exports.getTopicsModel = () => {
  return db.query(`SELECT * from topics;`).then((result) => {
    return result.rows;
  });
};

exports.getArticleByIDModel = (id) => {
  return db
    .query(`SELECT *  from articles WHERE article_id = $1;`, [id])
    .then((result) => {
      console.log(result.rows, "RESULT HERE");
      return result.rows;
    });
};

exports.updateArticleByIdModel = (article_id, newVote) => {
  // Validate input parameters
  if (
    !article_id ||
    Number.isNaN(Number.parseInt(article_id)) ||
    Number.parseInt(article_id) <= 0
  ) {
    return Promise.reject({ status: 400, message: "Bad Request" });
  }
  if (
    !newVote ||
    !newVote.hasOwnProperty("inc_votes") ||
    Number.isNaN(Number.parseInt(newVote.inc_votes))
  ) {
    return Promise.reject({ status: 422, message: "Unprocessable Entity" });
  }

  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((result) => {
      return db.query(
        `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
        [newVote.inc_votes, article_id]
      );
    })
    .then(({ rows }) => rows);
};
