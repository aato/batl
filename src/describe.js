const results = require('./results');

const describe = async (describe, registerTests) => {
  const curDescribe = results.getCurrentDescribe();
  curDescribe.describes[describe] = {
    describes: {},
    its: {},
    beforeAll: null,
    afterAll: null,
    beforeEach: null
  }
  results.currentDescribe.push(describe);

  registerTests();

  results.currentDescribe.pop();
}

module.exports = describe;
