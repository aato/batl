const results = require('./results');

async function beforeEach(beforeEachFunc) {
  const currentDescribe = results.getCurrentDescribe();

  currentDescribe.beforeEach = beforeEachFunc;
}

module.exports = beforeEach;
