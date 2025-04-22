const path = require('path')
const fs = require('fs')

const results = require('./results');
const report = require('./report')
const recordUncaughtException = require('./record-uncaught-exception');
const isAsyncFunction = require('./is-async-function');

function allPassed(results) {
  for(const file of Object.keys(results.files)) {
    if(!allPassedInDescribes(results.files[file].describes)) {
      return false;
    }
  }

  return true;
}

function allPassedInDescribes(topLevelDescribes) {
  for(const describe of Object.keys(topLevelDescribes)) {
    const { describes, its } = topLevelDescribes[describe];
    for(const it of Object.keys(its)) {
      const { expects } = its[it];
      if(!expects.every(e => e.success)) return false;
    }

    if(describes) return allPassedInDescribes(describes);
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

function processArgs(args) {
  const obj = {
    files: [],
    onlyFiles: []
  };

  const FLAGS = {
    FILES: 'f',
    ONLY_FILES: 'o'
  }

  function isFilesArgs(arg) {
    return arg.toLowerCase() === `-${FLAGS.FILES}`;
  }

  function isOnlyFilesArgs(arg) {
    return arg.toLowerCase() === `-${FLAGS.ONLY_FILES}`;
  }

  function isFlag(arg) {
    return isFilesArgs(arg) || isOnlyFilesArgs(arg);
  }

  function extractFiles(args) {
    const files = [];

    let insideFilesArg = false;
    for(const arg of args) {
      if(insideFilesArg) {
        if(isFlag(arg)) {
          break;
        } else {
          files.push(arg);
        }
      } else {
        if(isFilesArgs(arg)) {
          insideFilesArg = true;
          continue;
        }
      }
    }

    return files;
  }

  function extractOnlyFiles(args) {
    const files = [];

    let insideOnlyFilesArg = false;
    for(const arg of args) {
      if(insideOnlyFilesArg) {
        if(isFlag(arg)) {
          break;
        } else {
          files.push(arg);
        }
      } else {
        if(isOnlyFilesArgs(arg)) {
          insideOnlyFilesArg = true;
          continue;
        }
      }
    }

    return files;
  }

  obj.files = extractFiles(args);
  obj.onlyFiles = extractOnlyFiles(args);

  return obj;
}

async function main() {
  let { files, onlyFiles } = processArgs(process.argv.slice(2));

  if(onlyFiles.length) {
    files = onlyFiles;
  }

  files = files.map(f => path.resolve(process.cwd(), f))
  
  // If no files explicitly specified, check for all .test.js files in the current working directory..
  if(!files.length) {
    files = (await getAllFilePaths(path.resolve(process.cwd()))).filter(f => f.match(/.*\.test.js/))
  }

  for(const file of files) {
    if(!fs.existsSync(file)) {
      throw new Error(`batl error: ${file} doesn't exist`)
    }
  }

  for(const file of files) {
    results.currentFile = file;
    results.files[file] = {
      describes: {}
    }

    require(file);
  }
  results.currentFile = '';
  results.currentDescribe = [];
  results.currentIt = '';

  for(const file of files) {
    results.currentFile = file;

    await runDescribes(results.files[file].describes);
  }

  results.currentFile = '';
  results.currentDescribe = [];
  results.currentIt = '';

  console.log(report(results));

  const exitCode = allPassed(results) ? 0 : 1;
  process.exit(exitCode)
}

async function runDescribes(topLevelDescribes) {
  for(const topLevelDescribe of Object.keys(topLevelDescribes)) {
    results.currentDescribe.push(topLevelDescribe);

    const { describes, its, beforeAll, afterAll, beforeEach, afterEach } = topLevelDescribes[topLevelDescribe];

    if(beforeAll) {
      if(isAsyncFunction(beforeAll)) {
        await beforeAll();
      } else {
        beforeAll();
      }
    }
    // TODO: catch and record exceptions

    for(const it of Object.keys(its)) {
      const { test } = its[it];
      results.currentIt = it;

      if(beforeEach) {
        if(isAsyncFunction(beforeEach)) {
          await beforeEach();
        } else {
          beforeEach();
        }
      }
      // TODO: catch and record exceptions

      try {
        if(isAsyncFunction(test)) {
          await test()
        } else {
          test();
        }
      } catch(err) {
        recordUncaughtException(err)
      }

      if(afterEach) {
        if(isAsyncFunction(afterEach)) {
          await afterEach();
        } else {
          afterEach();
        }
      }
      // TODO: catch and record exceptions
    }

    if(afterAll) {
      if(isAsyncFunction(afterAll)) {
        await afterAll();
      } else {
        afterAll();
      }
    }
    // TODO: catch and record exceptions

    if(describes) {
      await runDescribes(describes);
    }

    results.currentDescribe.pop();
  }
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
