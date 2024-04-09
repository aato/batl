const results = require('./results');

async function afterAll(afterAllFunc) {
  const currentDescribe = results.getCurrentDescribe();

  currentDescribe.afterAll = afterAllFunc;
}

module.exports = afterAll;
