const db = require("../db/connection");

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
          return result.rows[0];
        } else return Promise.reject({ status: 404, msg: "ID Doesn't Exist" });
      });
  };
  
  exports.getArticlesModel = (sort_by = "created_at", order = "desc", topic) => {
    if (
      !["title", "topic", "author", "created_at", "votes", "article_id"].includes(
        sort_by
      )
    ) {
      return Promise.reject({
        status: 400,
        msg: "Invalid sort query - you can sort by title, topic, author, created_at, votes, or article_id",
      });
    }
  
    if (!["asc", "desc"].includes(order)) {
      return Promise.reject({
        status: 400,
        msg: "Invalid order query - choose between asc and desc",
      });
    }
    const queryValues = [];
    let queryStr = `
    SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes,
    COUNT(comments.article_id) AS comment_count FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id`;
  
    if (
      ["mitch", "cats", "paper", "coding", "football", "cooking"].includes(topic)
    ) {
      queryValues.push(topic);
      queryStr += ` WHERE topic = $1`;
    } else if (topic !== undefined) {
      return Promise.reject({ status: 404, msg: "Topic not found" });
    }
  
    order = order.toUpperCase();
    queryStr += ` GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order};`;
    return db.query(queryStr, queryValues).then(({ rows }) => {
      return rows;
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
  
      .then(({ rows }) => rows[0]);
  };

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
        return rows[0];
      });
  };


  exports.postArticleModel = async (author, title, body, topic) => {
    const votes = 0;
    const comment_count = 0;
    const created_at = new Date();
    const newArticle = await db.query(
      `INSERT INTO articles 
    (author, title, body, topic, votes, created_at)
    VALUES ($1, $2, $3, $4, $5, $6) 
    RETURNING *`,
      [author, title, body, topic, votes, created_at]
    );
    newArticle.rows[0].comment_count = 0;
    return newArticle.rows[0];
  };

  exports.deleteArticleModel = (article_id) => {
    return db
      .query("DELETE FROM articles WHERE article_id = $1 RETURNING *;", [
        article_id,
      ])
      .then(({ rows }) => { 
        if (rows.length === 0) {
          return Promise.reject({
            status: 404,
            msg: `The following article ID provided does not exist: ${article_id}`,
          });
        }
        return rows;
      });
  };