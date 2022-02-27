const db = require("../db/connection");

// TOPICS MODELS
exports.getTopicsModel = () => {
  return db.query(`SELECT * from topics;`).then((result) => {
    return result.rows;
  });
};

// ARTICLE MODELS

exports.getArticleByIDModel = (id) => {
  if (isNaN(id)) {
    return Promise.reject({ status: 400, msg: "Invalid ID" });
  }
  return db
    .query(
      ` SELECT articles.*,
        COUNT(comments.article_id) AS comment_count
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;`,
      [id]
    )
    .then((result) => {
      if (result.rows.length != 0) {
        return result.rows;
      } else return Promise.reject({ status: 404, msg: "ID Doesn't Exist" });
    });
};

exports.getArticlesModel = () => {
  return db
    .query(
      `SELECT author, title, article_id, topic, created_at, votes from articles ORDER BY created_at DESC;`
    )
    .then((result) => {
      if (result.rows.length != 0) {
        return result.rows;
      } else return Promise.reject({ status: 404, msg: "ID Doesn't Exist" });
    });
};

exports.updateArticleByIdModel = (article_id, newVote) => {
  if (Object.keys(newVote).length > 1) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

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
    Number.isNaN(newVote.inc_votes)
  ) {
    return Promise.reject({ status: 422, msg: "Unprocessable Entity" });
  }

  if (Number.isNaN(Number.parseInt(newVote.inc_votes))) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  return db

    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
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

// COMMENTS MODELS

exports.getCommentsModel = async (article_id) => {
  if (
    !article_id ||
    Number.isNaN(Number.parseInt(article_id)) ||
    Number.parseInt(article_id) <= 0
  ) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  const maxId = await db.query(
    `SELECT articles.article_id FROM articles
        ORDER BY articles.article_id desc
        LIMIT 1;`
  );
  if (article_id > maxId.rows[0].article_id) {
    return Promise.reject({ status: 404, msg: "Not Found!" });
  }
  const comments = await db.query(
    `SELECT comments.comment_id, comments.votes, comments.created_at,
         comments.author, comments.body FROM comments
         WHERE article_id = $1;`,
    [article_id]
  );
  return comments.rows;
};

exports.postCommentsModel = (articleid, comment) => {
  const { username, body } = comment;

  if (!username || !body) {
    return Promise.reject({ status: 400, msg: "Invalid input" });
  }
  if (
    ![
      "tickle122",
      "grumpy19",
      "happyamy2016",
      "cooljmessy",
      "weegembump",
      "jessjelly",
      "butter_bridge",
      "icellusedkars",
      "rogersop",
      "lurker",
    ].includes(username)
  ) {
    return Promise.reject({ status: 404, msg: "User does not exist" });
  }
  return db
    .query(
      `INSERT INTO comments (author, article_id, body)
			VALUES ($1, $2, $3)
			RETURNING *;`,
      [username, articleid, body]
    )
    .then(({ rows }) => {
      return rows;
    });
};

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
