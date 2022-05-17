const db = require("../db/connection");

exports.getUsersModel = () => {
    return db.query(`SELECT username from users;`).then((result) => {
      return result.rows;
    });
  };

  exports.getUserByUsernameModel = (username) => {
    
    if (Number(username)) {
        return Promise.reject({status: 400, msg: "Bad request"})
    }
    return db.query(`
    SELECT * FROM users
    WHERE username = $1;
    `, [username])
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({status: 404, msg: "Path not found"})
            } else {
                return result.rows[0];
            };
        });
};