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
