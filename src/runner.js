const path = require('path')
const fs = require('fs')

const results = require('./results');
const report = require('./report')

function isAsyncFunction(func) {
  return func.constructor === (async function() {}).constructor;
}

function allPassed(results) {
  for(const file of Object.keys(results.files)) {
    for(const describe of Object.keys(results.files[file].describes)) {
      const { its } = results.files[file].describes[describe];
      for(const { result: { success } } of its) {
        if(!success) return false;
      }
    }
  }

  return true;
}

async function getAllFilePaths(dir) {
  let files = fs.readdirSync(dir, { withFileTypes: true });
  let paths = await Promise.all(files.map(async (file) => {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      return getAllFilePaths(filePath);
    } else {
      return filePath;
    }
  }));
  return paths.flat();
}

async function main() {
  let files = process.argv.length >= 2 ? process.argv.slice(2).map(f => path.resolve(process.cwd(), f)) : [];

  if(files.length === 0) {
    files = (await getAllFilePaths(path.resolve(process.cwd(), 'test'))).filter(f => f.match(/.*\.test.js/))
  }

  for(const file of files) {
    if(!fs.existsSync(file)) {
      throw new Error(`batf error: ${file} doesn't exist`)
    }
  }

  for(const file of files) {
    results.currentFile = file;
    results.files[file] = {
      describes: {}
    }

    require(file);
  }
  results.currentFile = null;
  results.currentDescribe = null;

  for(const file of files) {
    const { describes } = results.files[file];
    for(const describe of Object.keys(describes)) {
      const { its, beforeAll, results } = describes[describe];

      if(beforeAll) {
        if(isAsyncFunction(beforeAll)) {
          await beforeAll();
        } else {
          beforeAll();
        }
      }

      for(const it of its) {
        const { test } = it;
        try {
          if(isAsyncFunction(test)) {
            await test()
          } else {
            test();
          }

          it.result = { 
            success: true
          };
        } catch(err) {
          const { actual, expected } = JSON.parse(err.message);
      
          it.result = { 
            success: false,
            expected,
            actual
          };
        }
      }
    }
  }

  console.log(report(results));

  const exitCode = allPassed(results) ? 0 : 1;

  process.exit(exitCode)
}

async function runner() {
  try {
    main();
  } catch(err) {
    console.log(err.message);
    process.exit(1)
  }
}

module.exports = runner;
