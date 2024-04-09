const normalizeObject = require('./normalize-object');
const results = require('./results');

function allPassed(expects) {
  return expects.every(e => e.success)
}

function report(results) {
  let lines = [];

  for(const file of Object.keys(results.files)) {
    lines.push(`(${file})`);

    lines.push(...reportDescribes(results.files[file].describes))

    lines.push('')
  }

  lines = lines.slice(0, lines.length - 1);

  return lines.join('\n');
}

function reportDescribes(topLevelDescribes) {
  const lines = [];

  for(const topLevelDescribe of Object.keys(topLevelDescribes)) {
    results.currentDescribe.push(topLevelDescribe);

    const { describes, its } = topLevelDescribes[topLevelDescribe];

    lines.push(`${indent()}[${topLevelDescribe}]`)
    for(const it of Object.keys(its)) {
      const { description, expects } = its[it];

      if(allPassed(expects)) {
        lines.push(`${indent()}PASS: ${description}`);
      } else {
        lines.push(`${indent()}FAIL: ${description}`);
        for(const { expected, actual, exception } of expects.filter(e => !e.success)) {
          if(exception) {
            lines.push(`${indent()}uncaught exception: ${exception}`)
          } else {
            lines.push(`${indent()}expected: ${JSON.stringify(normalizeObject(expected))}`);
            lines.push(`${indent()}actual:   ${JSON.stringify(normalizeObject(actual))}`);
          }
        }
      }
    }

    if(describes) {
      lines.push(...reportDescribes(describes));
    }

    results.currentDescribe.pop();
  }

  return lines;
}

function indent() {
  return ' '.repeat(numIndents()*4)
}

function numIndents() {
  return results.currentDescribe.length - 1;
}

module.exports = report;
