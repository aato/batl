const normalizeObject = require('./normalize-object');

function report(results) {
  let str = '';

  for(const unit of Object.keys(results)) {
    str += `${unit}\n`

    results[unit] = results[unit].sort((a, b) => b.success - a.success)

    for(const result of results[unit]) {
      const { description, success, expected, actual } = result;
      
      if(success) {
        str += `PASS: ${description}\n`;
      } else {
        str += `FAIL: ${description}\n`;
        str += `  expected: ${JSON.stringify(normalizeObject(expected))}\n`;
        str += `  actual:   ${JSON.stringify(normalizeObject(actual))}\n`;
      }
    }
  }

  return str;
}

module.exports = report;
