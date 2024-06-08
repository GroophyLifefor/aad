const cache = {};
const cacheDEBUG = false;
const Cache = {
  set: function (key, value) {
    if (cacheDEBUG) console.log('Cache set', key, value);
    cache[key] = value;
  },
  get: function (key) {
    if (cacheDEBUG) console.log('Cache get', key);
    return cache.hasOwnProperty(key) ? cache[key] : null;
  },
  has: function (key) {
    if (cacheDEBUG) console.log('Cache has', key);
    return cache.hasOwnProperty(key);
  },
  remove: function (key) {
    if (cacheDEBUG) console.log('Cache remove', key);
    if (this.has(key)) {
      delete cache[key];
    }
  },
  clear: function () {
    if (cacheDEBUG) console.log('Cache clear');
    for (let key in cache) {
      if (cache.hasOwnProperty(key)) {
        delete cache[key];
      }
    }
  },
};