const results = require('./results')

function recordFailure(expected, actual) {
  results.files[results.currentFile].describes[results.currentDescribe].its[results.currentIt].expects.push({
    success: false,
    expected,
    actual
  });
}

module.exports = recordFailure;
