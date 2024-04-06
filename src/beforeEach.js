const results = require('./results');

async function beforeEach(beforeEachFunc) {
  results.files[results.currentFile].describes[results.currentDescribe].beforeEach = beforeEachFunc;
}

module.exports = beforeEach;
