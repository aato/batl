const results = require('./results');

async function afterAll(afterAllFunc) {
  results.files[results.currentFile].describes[results.currentDescribe].afterAll = afterAllFunc;
}

module.exports = afterAll;
