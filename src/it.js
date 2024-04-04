const results = require('./results');

async function it(description, test) {
  results.files[results.currentFile].describes[results.currentDescribe].its.push({ description, test })
}

module.exports = it;
