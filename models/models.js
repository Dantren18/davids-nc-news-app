const db = require("../db/connection");

exports.getTopicsModel = () => {
  return db.query(`SELECT * from topics;`).then((result) => {
    return result.rows;
  });
};

exports.getArticleByIDModel = (id) => {
  if (isNaN(id)) {
    return Promise.reject({ status: 400, msg: "Invalid ID" });
  }
  return db
    .query(`SELECT *  from articles WHERE article_id = $1;`, [id])
    .then((result) => {
      if (result.rows.length != 0) {
        return result.rows;
      } else return Promise.reject({ status: 404, msg: "ID Doesn't Exist" });
    });
};

exports.patchArticleByIDModel = (id) => {};
