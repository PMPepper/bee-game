
export const Helpers = {
  mapObject: (object, callback) => {
    if(!object) {
      return null;
    }

    return Object.keys(object).map(function (key) {
      return callback(key, object[key]);
    });
  }
}

Object.freeze(Helpers);
