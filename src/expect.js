const recordSuccess = require('./record-success')
const recordFailure = require('./record-failure');

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

module.exports = expect;
