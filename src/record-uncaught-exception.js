const results = require('./results')

function recordUncaughtException(err) {
  results.files[results.currentFile].describes[results.currentDescribe].its[results.currentIt].expects.push({
    success: false,
    exception: err.message
  });
}

module.exports = recordUncaughtException;
