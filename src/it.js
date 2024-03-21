const results = require('./results');

function it(description, test) {
  try {
    test()
    results.results[results.currentUnit].push({ 
      description,
      success: true
    });
  } catch(err) {
    const { actual, expected } = JSON.parse(err.message);

    results.results[results.currentUnit].push({ 
      description,
      success: false,
      expected,
      actual
    });
  }
}

module.exports = it;
