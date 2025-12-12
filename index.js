// index.js
class Validator {
  number() {
    return new NumberValidator();
  }

  array() {
    return new ArrayValidator();
  }

  object() {
    return new ObjectValidator();
  }
}

class NumberValidator {
  constructor() {
    this.checks = [(value) => typeof value === 'number' && !isNaN(value)];
  }

  integer() {  // для чисел: integer() - единственное число
    this.checks.push((value) => Number.isInteger(value));
    return this;
  }

  isValid(value) {
    return this.checks.every(check => check(value));
  }
}

class ArrayValidator {
  constructor() {
    this.checks = [(value) => Array.isArray(value)];
  }

  integers() {  // для массивов: integers() - множественное число
    this.checks.push((arr) => arr.every(item => typeof item === 'number' && Number.isInteger(item)));
    return this;
  }

  custom(validateFunction) {
    this.checks.push((arr) => arr.every(item => validateFunction(item)));
    return this;
  }

  isValid(value) {
    return this.checks.every(check => check(value));
  }
}

class ObjectValidator {
  constructor() {
    this.schema = {};
  }

  shape(fields) {
    this.schema = fields;
    return this;
  }

  isValid(object) {
    if (typeof object !== 'object' || object === null || Array.isArray(object)) {
      return false;
    }

    for (const [key, validator] of Object.entries(this.schema)) {
      if (!object.hasOwnProperty(key)) {
        return false;
      }

      if (!validator.isValid(object[key])) {
        return false;
      }
    }

    return true;
  }
}

export default Validator;