const recordSuccess = require('./record-success')
const recordFailure = require('./record-failure');
const { isAsyncFunction } = require('util/types');
const { log } = require('console');

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

  this.withArguments = function(...args) {
    this.functionArgs = args;

    return this;
  }

  this.toThrow = async function() {
    this.functionArgs = this.functionArgs || [];

    try {
      if(isAsyncFunction(this.actual)) {
        await this.actual(...this.functionArgs)
      } else {
        this.actual(...this.functionArgs)
      }

      recordFailure(`${this.actual.name}(${this.functionArgs.join(', ')}) to throw`, `${this.actual.name}(${this.functionArgs.join(', ')}) didn't throw`)
      return;
    } catch(err) {
      recordSuccess();
    }
  }

  return this;
}

module.exports = expect;
