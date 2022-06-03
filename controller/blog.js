const { exec } = require("../db/mysql");
const xss = require("xss");

const getList = (params) => {
  try {
    let sql = `select * from blogs where 1=1 `;

    const { author, keyword } = params;

    if (author) {
      sql += `and author = '${author}' `;
    }

    if (keyword) {
      sql += `and title like '%${keyword}%' `;
    }

    sql += `order by createtime desc;`;

    return exec(sql);
  } catch (error) {
    return Promise.resolve({ error: error.toString() });
  }
};

const getDetail = (params) => {
  try {
    const { id } = params;
    const sql = `select * from blogs where id = '${id}'`;
    return exec(sql).then((rows) => rows[0]);
  } catch (error) {
    return Promise.resolve({ error: error.toString() });
  }
};

const newBlog = (blogData = {}) => {
  try {
    const { title, content, author } = blogData;
    const createtime = Date.now();

    const sql = `
      insert into blogs (title, content, author, createtime)
      values ('${xss(title)}', '${xss(content)}', '${author}', '${createtime}')`;

    return exec(sql).then((res) => {
      return {
        id: res.insertId,
      };
    });
  } catch (error) {
    return Promise.resolve({ error: error.toString() });
  }
};

const updateBlog = (params) => {
  try {
    const { id, title, content } = params;
    const sql = `
      update blogs set title = '${title}', content = '${content}' where id = ${id}
    `;
    return exec(sql).then((res) => {
      if (res.affectedRows > 0) {
        return true;
      }
      return false;
    });
  } catch (error) {
    return Promise.resolve({ error: error.toString() });
  }
};

const delBlog = (id, author) => {
  try {
    const sql = `delete from blogs where id = ${id} and author = '${author}'`;

    return exec(sql).then((res) => {
      if (res.affectedRows > 0) {
        return true;
      }
      return false;
    });
  } catch (error) {
    return Promise.resolve({ error: error.toString() });
  }
};

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog,
};
