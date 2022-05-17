const cru = require('./server/model/cru_model');

const obj = { test_name: 'yoder', test_num: 99, test_ref: 'xxx' };
const where = { test_id: 1 };
console.log(obj);
function test() {
  // const test = () => {
  const testy = async () => {
    let columns = [];
    let values = [];
    let variables = [];
    for (e in obj) {
      //    console.log('e', e);
      columns.push(`${e}`);
      values.push('?');
      variables.push(obj[`${e}`]);
    }
    const result = await cru.update('test', obj, where);
    console.log('result', result);
  };
  testy();
}
test();
