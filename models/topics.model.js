const db = require("../db/connection");

exports.getTopicsModel = () => {
    return db.query(`SELECT * from topics;`).then((result) => {
      return result.rows;
    });
  };

  exports.postTopicsModel = (topic) => {
    const { slug, description } = topic;
    if (
      slug === undefined ||
      description === undefined
    ) {
      return Promise.reject({
        status: 400,
        msg: `Body sent is not valid`,
      });
    }
    return db
      .query(
        "INSERT INTO topics ( slug, description ) VALUES ($1, $2) RETURNING *;",
        [slug, description]
      )
      .then(({ rows }) => {
        return rows[0];
      });
  };