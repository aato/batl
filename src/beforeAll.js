const results = require('./results');

async function beforeAll(beforeAllFunc) {
  const currentDescribe = results.getCurrentDescribe();

  currentDescribe.beforeAll = beforeAllFunc;
}

module.exports = beforeAll;
