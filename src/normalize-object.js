function normalizeObject(obj) {
  if(typeof obj !== 'object') return obj;

  const integerKeys = Object.keys(obj).filter(key => String(Math.floor(Number(key))) === key && Number(key) >= 0).sort((a, b) => Number(a) - Number(b));
  const otherKeys = Object.keys(obj).filter(key => !(String(Math.floor(Number(key))) === key && Number(key) >= 0)).sort();

  const normalized = {};

  for (const key of integerKeys) {
    normalized[key] = obj[key];
  }

  for (const key of otherKeys) {
    normalized[key] = obj[key];
  }

  return normalized;
}

module.exports = normalizeObject;
