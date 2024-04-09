const results = require('./results')

function recordSuccess() {
  const currentDescribe = results.getCurrentDescribe();

  currentDescribe.its[results.currentIt].expects.push({
    success: true
  });
}

module.exports = recordSuccess;
