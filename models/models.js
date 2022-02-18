const db = require("../db/connection");

// TOPICS MODELS
exports.getTopicsModel = () => {
  return db.query(`SELECT * from topics;`).then((result) => {
    return result.rows;
  });
};

// ARTICLE MODELS

exports.getArticleByIDModel = (id) => {
  return db
    .query(`SELECT *  from articles WHERE article_id = $1;`, [id])
    .then((result) => {
      return result.rows;
    });
};

exports.getArticlesModel = () => {
  return db
    .query(
      `SELECT author, title, article_id, topic, created_at, votes from articles ORDER BY created_at DESC;`
    )
    .then((result) => {
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
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  if (
    !newVote ||
    !newVote.hasOwnProperty("inc_votes") ||
    Number.isNaN(Number.parseInt(newVote.inc_votes))
  ) {
    return Promise.reject({ status: 422, msg: "Unprocessable Entity" });
  }
  console.log("inside controller");
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((rows) => {
      if ((rows.length = 0)) {
        console.log(result, "result is here");
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
    })
    .then((result) => {
      return db.query(
        `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
        [newVote.inc_votes, article_id]
      );
    })
    .then(({ rows }) => rows);
};

//USERS MODELS
exports.getUsersModel = () => {
  return db.query(`SELECT username from users;`).then((result) => {
    return result.rows;
  });
};
