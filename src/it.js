const results = require('./results');

async function it(description, test) {
  results.currentIt = description;
  results.files[results.currentFile].describes[results.currentDescribe].its[results.currentIt] = {
    description,
    test,
    expects: []
  }
}

module.exports = it;
