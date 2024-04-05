const results = require('./results')

const expect = (actual) => {
  this.actual = this.actual || null;

  this.actual = actual;

  this.toBe = function(expected) {

    if(this.actual !== expected) {
      recordFailure(expected, actual)
    } else {
      recordSuccess();
    }
  }

  this.toEqual = function(expected) {
    if(Object.keys(expected).length !== Object.keys(this.actual).length) {
      recordFailure(expected, actual)
      return;
    }

    for(const key of Object.keys(expected)) {
      const value = expected[key];

      if(this.actual[key] !== value) {
        recordFailure(expected, actual)
        return;
      }
    }

    recordSuccess();
  }

  return this;
}

function recordSuccess() {
  results.files[results.currentFile].describes[results.currentDescribe].its[results.currentIt].expects.push({
    success: true
  });
}

function recordFailure(expected, actual) {
  results.files[results.currentFile].describes[results.currentDescribe].its[results.currentIt].expects.push({
    success: false,
    expected,
    actual
  });
}

module.exports = expect;
