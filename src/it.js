const results = require('./results');

async function it(description, test) {
  results.currentIt = description;

  const curDescribe = results.getCurrentDescribe();

  curDescribe.its[results.currentIt] = {
    description,
    test,
    expects: []
  }
}

module.exports = it;
