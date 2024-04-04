const normalizeObject = require('./normalize-object');

function report(results) {
  const lines = [];

  for(const file of Object.keys(results.files)) {
    lines.push(file);

    for(const describe of Object.keys(results.files[file].describes)) {
      const { its } = results.files[file].describes[describe];

      lines.push(describe)
      for(const { description, result: { success, expected, actual } } of its) {
        if(success) {
          lines.push(`PASS: ${description}`);
        } else {
          lines.push(`FAIL: ${description}`);
          lines.push(`  expected: ${JSON.stringify(normalizeObject(expected))}`);
          lines.push(`  actual:   ${JSON.stringify(normalizeObject(actual))}`);
        }
      }
    }

    lines.push('')
  }

  return lines.join('\n');
}

module.exports = report;
