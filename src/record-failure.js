const results = require('./results')

function recordFailure(expected, actual) {
  const currentDescribe = results.getCurrentDescribe();

  currentDescribe.its[results.currentIt].expects.push({
    success: false,
    expected,
    actual
  });
}

module.exports = recordFailure;
