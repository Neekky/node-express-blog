const { exec, escape } = require("../db/mysql");

const login = (params) => {
  try {
    const username = escape(params.username);
    const password = escape(params.password);

    const sql = `
        select username, realname from users where username = ${username} and password = ${password}
    `;
    
    return exec(sql).then((rows) => {
      return rows[0] || {};
    });
  } catch (error) {
    return Promise.resolve({ error: error.toString() });
  }
};

module.exports = {
  login,
};
