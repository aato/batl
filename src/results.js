const results = {
  files: {},
  currentFile: '',
  currentDescribe: [],
  getCurrentDescribe,
  currentIt: ''
}

function getCurrentDescribe() {
  let currentDescribeObj = results.files[results.currentFile];
  
  for(const describe of results.currentDescribe) {
    currentDescribeObj = currentDescribeObj.describes[describe];
  }

  return currentDescribeObj;
}

module.exports = results
