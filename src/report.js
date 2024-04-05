const normalizeObject = require('./normalize-object');

function allPassed(expects) {
  return expects.every(e => e.success)
}

function report(results) {
  const lines = [];

  for(const file of Object.keys(results.files)) {
    lines.push(file);

    for(const describe of Object.keys(results.files[file].describes)) {
      const { its } = results.files[file].describes[describe];

      lines.push(describe)
      for(const it of Object.keys(its)) {
        const { description, expects } = its[it];

        if(allPassed(expects)) {
          lines.push(`PASS: ${description}`);
        } else {
          lines.push(`FAIL: ${description}`);
          for(const { expected, actual } of expects.filter(e => !e.success)) {
            lines.push(`  expected: ${JSON.stringify(normalizeObject(expected))}`);
            lines.push(`  actual:   ${JSON.stringify(normalizeObject(actual))}`);
          }
        }
      }
    }

    lines.push('')
  }

  return lines.join('\n');
}

module.exports = report;
