const recordSuccess = require('./record-success')
const recordFailure = require('./record-failure');
const { isAsyncFunction } = require('util/types');
const fs = require('fs')

const expect = (actual) => {
  this.actual = actual;
  this.functionArgs = [];

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

  this.toThrow = async function(regExp) {
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
      if(regExp) {
        if(err.message.match(regExp)) {
          recordSuccess();
        } else {
          recordFailure(
            `${toThrowToString(this.actual.name, this.functionArgs)} to throw with error message matching ${regExp.toString()}`,
            `${toThrowToString(this.actual.name, this.functionArgs)} threw but error message (${err.message}) didn't match ${regExp.toString()}`
          )
        }
      } else {
        recordSuccess();
      }
    }
  }

  this.toMatch = function(expected) {
    if(!this.actual.match(expected)) {
      recordFailure(
        `${this.actual} to match ${expected.toString()}`,
        `${this.actual} didn't match ${expected.toString()}`,
      );
    } else {
      recordSuccess();
    }
  }

  this.toNotExistInFileSystem = function() {
    if(!fs.existsSync(this.actual)) {
      recordSuccess();
    } else {
      recordFailure(
        `${this.actual} to not exist in filesystem`,
        `${this.actual} exists in filesystem`
      )
    }
  }

  this.toExistInFileSystem = function() {
    if(!fs.existsSync(this.actual)) {
      recordFailure(
        `${this.actual} to exist in filesystem`,
        `${this.actual} doesn't exist in filesystem`
        )
      } else {
      recordSuccess();
    }
  }

  this.toExist = function() {
    if(this.actual !== undefined && this.actual !== null) {
      recordSuccess();
    } else {
      recordFailure(
        `${this.actual} to exist`,
        `${this.actual} doesn't exist`
      );
    }
  }

  this.toNotExist = function() {
    if(this.actual === undefined || this.actual === null) {
      recordSuccess();
    } else {
      recordFailure(
        `${this.actual} to not exist`,
        `${this.actual} exists`
      );
    }
  }

  this.toBeInstanceOf = function(cls) {
    if(this.actual instanceof cls) {
      recordSuccess();
    } else {
      recordFailure(
        `${this.actual} to be of class ${cls.name}`,
        `${this.actual} was not of class ${cls.name}`,
      )
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
