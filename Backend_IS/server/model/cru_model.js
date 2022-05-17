const db = require('../util/db');
function checkQueryResult(result) {
  if (result.affectedRows > 0) {
    return { code: 200, status: 'query job finished.' };
  } else {
    return {
      code: 500,
      status: 'query job failed.',
      error: 'query error',
    };
  }
}
const insert = async (table, obj) => {
  try {
    let columns = [];
    let values = [];
    let variables = [];
    for (target in obj) {
      columns.push(`${target}`);
      values.push('?');
      variables.push(obj[`${target}`]);
    }
    const query =
      'INSERT INTO ' +
      table +
      ' (' +
      columns.join(',') +
      ') VALUES ( ' +
      values.join(',') +
      ' )';
    const [result] = await db.query(query, variables);
    console.log('result before function');
    return checkQueryResult(result);
  } catch (err) {
    return {
      code: 500,
      status: 'db failed.',
      error: 'db error',
    };
  }
};
const update = async (table, obj, where) => {
  try {
    let columns = [];
    let variables = [];
    let whereColumns = [];
    let whereVariables = [];
    for (target in obj) {
      columns.push(`${target}`);
      variables.push(obj[`${target}`]);
    }
    for (target in where) {
      whereColumns.push(target);
      whereVariables.push(where[`${target}`]);
    }
    let querySet = [];
    for (target in columns) {
      querySet.push(columns[`${target}`] + ' = ? ');
    }
    let queryWhere = [];
    for (target in whereColumns) {
      queryWhere.push(whereColumns[`${target}`] + ' = ? ');
    }
    const query =
      'UPDATE ' +
      table +
      ' SET ' +
      querySet.join(',') +
      ' WHERE ' +
      queryWhere.join(',');
    variables.push(...whereVariables);
    const [result] = await db.query(query, variables);
    return checkQueryResult(result);
  } catch (err) {
    return {
      code: 500,
      status: 'db failed.',
      error: 'db error',
    };
  }
};
const select = async (table, column, where) => {
  let columns = [];
  let values = [];
  let variables = [];
};
const cru = { insert, update, select };
module.exports = cru;
