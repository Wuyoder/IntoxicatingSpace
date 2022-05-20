require('dotenv').config();
const app = require('../app');
const chai = require('chai');
const deepEqualInAnyOrder = require('deep-equal-in-any-order');
const chaiHttp = require('chai-http');
const { truncateDate, insertFakeDate } = require('./fake_data_generator');
chai.use(chaiHttp);
chai.use(deepEqualInAnyOrder);

const assert = chai.assert;
const expect = chai.expect;
const requester = chai.request(app).keepOpen();

before(async () => {
  if (process.env.NODE_ENV !== 'test') {
    throw 'Not in test env';
  }
  await truncateDate();
  await insertFakeDate();
});

module.exports = {
  expect,
  assert,
  requester,
};
