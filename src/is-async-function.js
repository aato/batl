function isAsyncFunction(func) {
  return func.constructor === (async function() {}).constructor;
}

module.exports = isAsyncFunction;
