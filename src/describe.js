const results = require('./results');
const report = require('./report');

const describe = (unit, tests) => {
  results.results[unit] = [];
  results.currentUnit = unit;

  tests();

  console.log(report(results.results));
}

module.exports = describe;
