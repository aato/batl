const results = require('./results')

function recordUncaughtException(err) {
  const currentDescribe = results.getCurrentDescribe();

  currentDescribe.its[results.currentIt].expects.push({
    success: false,
    exception: err.message
  });
}

module.exports = recordUncaughtException;
