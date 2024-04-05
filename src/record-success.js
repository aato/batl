const results = require('./results')

function recordSuccess() {
  results.files[results.currentFile].describes[results.currentDescribe].its[results.currentIt].expects.push({
    success: true
  });
}

module.exports = recordSuccess;
