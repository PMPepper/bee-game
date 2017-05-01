export function Enum (...values) {
  const obj = {};

  values.forEach((value) => {
    value = value.toString();

    if(value === 'isValid') {
      throw new Error('Enum may not have a value of "isValid"');
    }

    obj[value] = value;
  });

  Object.defineProperty(
    obj,
    'isValid',
    {
      value: (value) => {
        value = value.toString();

        return value != 'isValid' && (value in obj)
      }
    });

  return Object.freeze(obj);
}
