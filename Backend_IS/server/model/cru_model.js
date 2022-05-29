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
// insert table columns : table: 'name', obj key-value pair
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
    return checkQueryResult(result);
  } catch (err) {
    console.error(err);
    return { error: 'db error ( cru_model.insert )' };
  }
};
//update table columns table: 'name', obj key-value pair, only one where condition
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
    return result;
  } catch (err) {
    console.error(err);
    return { error: 'db error ( cru_model.update )' };
  }
};
//update table columns table: 'name', column: array[], only one where condition
const select = async (table, column, where) => {
  try {
    let whereColumns = [];
    let whereVariables = [];
    for (target in where) {
      whereColumns.push(target);
      whereVariables.push(where[`${target}`]);
    }
    let queryWhere = [];
    for (target in whereColumns) {
      queryWhere.push(whereColumns[`${target}`] + ' = ? ');
    }
    const query =
      'SELECT ' + column.join(',') + ' FROM ' + table + ' WHERE ' + queryWhere;
    const [result] = await db.query(query, whereVariables.join(','));
    return result;
  } catch (err) {
    console.error(err);
    return { error: 'db error ( cru_model.select )' };
  }
};
const startTrans = async () => {
  try {
    await db.query('START TRANSACTION');
  } catch (err) {
    console.error(err);
    return { error: 'db error ( cru_model.startTrans )' };
  }
};
const commitTrans = async () => {
  try {
    await db.query('COMMIT');
  } catch (err) {
    console.error(err);
    return { error: 'db error ( cru_model.commitTrans )' };
  }
};

const rollbackTrans=async()=>{
  try {
    await db.query('ROLLBACK');
  } catch (err) {
    console.error(err);
    return { error: 'db error ( cru_model.rollbackTrans )' };
  }
}
const cru = { insert, update, select, startTrans, commitTrans, rollbackTrans };
module.exports = cru;
