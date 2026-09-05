/**
 * Create an object composed of the picked object properties.
 * Arrays become `{ $in: value }` so list filters match HeyCarla query style.
 */
const pick = <T extends Record<string, unknown>>(object: T | undefined, keys: string[]) => {
  return keys.reduce<Record<string, unknown>>((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      const value = object[key];
      if (value !== undefined && value !== null && value !== '') {
        obj[key] = Array.isArray(value) ? { $in: value } : value;
      }
    }
    return obj;
  }, {});
};

export default pick;
