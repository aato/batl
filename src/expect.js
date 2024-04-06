const recordSuccess = require('./record-success')
const recordFailure = require('./record-failure');
const { isAsyncFunction } = require('util/types');

const expect = (actual) => {
  this.actual = this.actual || null;

  this.actual = actual;

  this.toBe = function(expected) {
    if(this.actual !== expected) {
      recordFailure(toBeToString(this.actual, expected), this.actual)
    } else {
      recordSuccess();
    }
  }

  this.toBeArray = function() {
    if(!(this.actual instanceof Array)) {
      recordFailure(toBeArrayToString(this.actual), `${this.actual} is not an array`)
    } else {
      recordSuccess();
    }
  }

  this.toBeObject = function() {
    if(!(this.actual instanceof Object)) {
      recordFailure(toBeObjectToString(this.actual), `${this.actual} is not an object`)
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

      recordFailure(
        `${toThrowToString(this.actual.name, this.functionArgs)} to throw`,
        `${toThrowToString(this.actual.name, this.functionArgs)} didn't throw`
      )
      return;
    } catch(err) {
      recordSuccess();
    }
  }

  return this;
}

function toThrowToString(funcName, funcArgs) {
  return `${funcName}(${funcArgs.join(', ')})`
}

function toBeToString(expected, actual) {
  return `expect(${JSON.stringify(expected)}).toBe(${JSON.stringify(actual)})`;
}

function toBeArrayToString(expected, actual) {
  return `expect(${JSON.stringify(expected)}).toBeArray()`;
}

function toBeObjectToString(expected, actual) {
  return `expect(${JSON.stringify(expected)}).toBeObject()`;
}

module.exports = expect;
