const expect = (actual) => {
  this.actual = this.actual || null;

  this.actual = actual;

  this.toBe = function(expected) {
    if(this.actual !== expected) {
      throw new Error(JSON.stringify({ actual: this.actual, expected: expected }));
    }
  }

  this.toEqual = function(expected) {
    if(Object.keys(expected).length !== Object.keys(this.actual).length) {
      throw new Error(JSON.stringify({ actual: this.actual, expected: expected }));
    }

    for(const key of Object.keys(expected)) {
      const value = expected[key];

      if(this.actual[key] !== value) {
        throw new Error(JSON.stringify({ actual: this.actual, expected: expected }));
      }
    }
  }

  return this;
}

module.exports = expect;
