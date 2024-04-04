const results = require('./results');

async function beforeAll(beforeAllFunc) {
  results.files[results.currentFile].describes[results.currentDescribe].beforeAll = beforeAllFunc;
}

module.exports = beforeAll;
