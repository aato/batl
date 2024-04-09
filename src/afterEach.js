const results = require('./results');

async function beforeEach(afterEachFunc) {
  const currentDescribe = results.getCurrentDescribe();

  currentDescribe.afterEach = afterEachFunc;
}

module.exports = beforeEach;
