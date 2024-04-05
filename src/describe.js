const results = require('./results');

const describe = async (describe, registerTests) => {
  results.currentDescribe = describe;
  results.files[results.currentFile].describes[results.currentDescribe] = {
    its: {},
    beforeAll: null,
  }

  registerTests();
}

module.exports = describe;
