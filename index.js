"use strict";

/**!
 * fy.js
 * 一个自用的 JavaScript类型测试库
 *
 * @copyright 2016-2023 By zoeblow
 * @license MIT
 */

var objProto = Object.prototype;
var owns = objProto.hasOwnProperty;
var toStr = objProto.toString;
var symbolValueOf;
if (typeof Symbol === "function") {
  symbolValueOf = Symbol.prototype.valueOf;
}
var bigIntValueOf;
if (typeof BigInt === "function") {
  bigIntValueOf = BigInt.prototype.valueOf;
}
var isActualNaN = function (value) {
  return value !== value;
};
var NON_HOST_TYPES = {
  boolean: 1,
  number: 1,
  string: 1,
  undefined: 1,
};

var base64Regex =
  /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/;
var hexRegex = /^[A-Fa-f0-9]+$/;

/**
 * Expose `fy`
 */

var fy = {};

/**
 * Test general.
 */
/**
 * is.type
 * Test if `value` is a type of `type`.
 *
 * @param {*} value value to test
 * @param {String} type type
 * @return {Boolean} true if `value` is a type of `type`, false otherwise
 * @api public
 */

is.a = is.type = function (value, type) {
  return typeof value === type;
};

/**
 * fy.defined
 * Test if `value` is defined.
 *
 * @param {*} value value to test
 * @return {Boolean} true if 'value' is defined, false otherwise
 * @api public
 */

fy.defined = function (value) {
  return typeof value !== "undefined";
};

/**
 * fy.empty
 * Test if `value` is empty.
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is empty, false otherwise
 * @api public
 */

fy.empty = function (value) {
  var type = toStr.call(value);
  var key;

  if (
    type === "[object Array]" ||
    type === "[object Arguments]" ||
    type === "[object String]"
  ) {
    return value.length === 0;
  }

  if (type === "[object Object]") {
    for (key in value) {
      if (owns.call(value, key)) {
        return false;
      }
    }
    return true;
  }

  return !value;
};

/**
 * fy.equal
 * Test if `value` is equal to `other`.
 *
 * @param {*} value value to test
 * @param {*} other value to compare with
 * @return {Boolean} true if `value` is equal to `other`, false otherwise
 */

fy.equal = function equal(value, other) {
  if (value === other) {
    return true;
  }

  var type = toStr.call(value);
  var key;

  if (type !== toStr.call(other)) {
    return false;
  }

  if (type === "[object Object]") {
    for (key in value) {
      if (!fy.equal(value[key], other[key]) || !(key in other)) {
        return false;
      }
    }
    for (key in other) {
      if (!fy.equal(value[key], other[key]) || !(key in value)) {
        return false;
      }
    }
    return true;
  }

  if (type === "[object Array]") {
    key = value.length;
    if (key !== other.length) {
      return false;
    }
    while (key--) {
      if (!fy.equal(value[key], other[key])) {
        return false;
      }
    }
    return true;
  }

  if (type === "[object Function]") {
    return value.prototype === other.prototype;
  }

  if (type === "[object Date]") {
    return value.getTime() === other.getTime();
  }

  return false;
};

/**
 * fy.hosted
 * Test if `value` is hosted by `host`.
 *
 * @param {*} value to test
 * @param {*} host host to test with
 * @return {Boolean} true if `value` is hosted by `host`, false otherwise
 * @api public
 */

fy.hosted = function (value, host) {
  var type = typeof host[value];
  return type === "object" ? !!host[value] : !NON_HOST_TYPES[type];
};

/**
 * fy.instance
 * Test if `value` is an instance of `constructor`.
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is an instance of `constructor`
 * @api public
 */

fy.instance = is["instanceof"] = function (value, constructor) {
  return value instanceof constructor;
};

/**
 * fy.nil / fy.null
 * Test if `value` is null.
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is null, false otherwise
 * @api public
 */

fy.nil = is["null"] = function (value) {
  return value === null;
};

/**
 * fy.undef / fy.undefined
 * Test if `value` is undefined.
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is undefined, false otherwise
 * @api public
 */

fy.undef = fy.undefined = function (value) {
  return typeof value === "undefined";
};

/**
 * Test arguments.
 */

/**
 * fy.args
 * Test if `value` is an arguments object.
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is an arguments object, false otherwise
 * @api public
 */

fy.args = fy.arguments = function (value) {
  var isStandardArguments = toStr.call(value) === "[object Arguments]";
  var isOldArguments =
    !fy.array(value) &&
    fy.arraylike(value) &&
    fy.object(value) &&
    fy.fn(value.callee);
  return isStandardArguments || isOldArguments;
};

/**
 * Test array.
 */

/**
 * fy.array
 * Test if 'value' is an array.
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is an array, false otherwise
 * @api public
 */

fy.array =
  Array.isArray ||
  function (value) {
    return toStr.call(value) === "[object Array]";
  };

/**
 * fy.arguments.empty
 * Test if `value` is an empty arguments object.
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is an empty arguments object, false otherwise
 * @api public
 */
fy.args.empty = function (value) {
  return fy.args(value) && value.length === 0;
};

/**
 * fy.array.empty
 * Test if `value` is an empty array.
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is an empty array, false otherwise
 * @api public
 */
fy.array.empty = function (value) {
  return fy.array(value) && value.length === 0;
};

/**
 * fy.arraylike
 * Test if `value` is an arraylike object.
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is an arguments object, false otherwise
 * @api public
 */

fy.arraylike = function (value) {
  return (
    !!value &&
    !fy.bool(value) &&
    owns.call(value, "length") &&
    isFinite(value.length) &&
    fy.number(value.length) &&
    value.length >= 0
  );
};

/**
 * Test boolean.
 */

/**
 * fy.bool
 * Test if `value` is a boolean.
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is a boolean, false otherwise
 * @api public
 */

fy.bool = is["boolean"] = function (value) {
  return toStr.call(value) === "[object Boolean]";
};

/**
 * fy.false
 * Test if `value` is false.
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is false, false otherwise
 * @api public
 */

is["false"] = function (value) {
  return fy.bool(value) && Boolean(Number(value)) === false;
};

/**
 * fy.true
 * Test if `value` is true.
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is true, false otherwise
 * @api public
 */

is["true"] = function (value) {
  return fy.bool(value) && Boolean(Number(value)) === true;
};

/**
 * Test date.
 */

/**
 * fy.date
 * Test if `value` is a date.
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is a date, false otherwise
 * @api public
 */

fy.date = function (value) {
  return toStr.call(value) === "[object Date]";
};

/**
 * fy.date.valid
 * Test if `value` is a valid date.
 *
 * @param {*} value value to test
 * @returns {Boolean} true if `value` is a valid date, false otherwise
 */
fy.date.valid = function (value) {
  return fy.date(value) && !isNaN(Number(value));
};

/**
 * Test element.
 */

/**
 * fy.element
 * Test if `value` is an html element.
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is an HTML Element, false otherwise
 * @api public
 */

fy.element = function (value) {
  return (
    value !== undefined &&
    typeof HTMLElement !== "undefined" &&
    value instanceof HTMLElement &&
    value.nodeType === 1
  );
};

/**
 * Test error.
 */

/**
 * fy.error
 * Test if `value` is an error object.
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is an error object, false otherwise
 * @api public
 */

fy.error = function (value) {
  return toStr.call(value) === "[object Error]";
};

/**
 * Test function.
 */

/**
 * fy.fn / fy.function (deprecated)
 * Test if `value` is a function.
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is a function, false otherwise
 * @api public
 */

fy.fn = is["function"] = function (value) {
  var isAlert = typeof window !== "undefined" && value === window.alert;
  if (isAlert) {
    return true;
  }
  var str = toStr.call(value);
  return (
    str === "[object Function]" ||
    str === "[object GeneratorFunction]" ||
    str === "[object AsyncFunction]"
  );
};

/**
 * Test number.
 */

/**
 * fy.number
 * Test if `value` is a number.
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is a number, false otherwise
 * @api public
 */

fy.number = function (value) {
  return toStr.call(value) === "[object Number]";
};

/**
 * fy.infinite
 * Test if `value` is positive or negative infinity.
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is positive or negative Infinity, false otherwise
 * @api public
 */
fy.infinite = function (value) {
  return value === Infinity || value === -Infinity;
};

/**
 * fy.decimal
 * Test if `value` is a decimal number.
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is a decimal number, false otherwise
 * @api public
 */

fy.decimal = function (value) {
  return (
    fy.number(value) &&
    !isActualNaN(value) &&
    !fy.infinite(value) &&
    value % 1 !== 0
  );
};

/**
 * fy.divisibleBy
 * Test if `value` is divisible by `n`.
 *
 * @param {Number} value value to test
 * @param {Number} n dividend
 * @return {Boolean} true if `value` is divisible by `n`, false otherwise
 * @api public
 */

fy.divisibleBy = function (value, n) {
  var isDividendInfinite = fy.infinite(value);
  var isDivisorInfinite = fy.infinite(n);
  var isNonZeroNumber =
    fy.number(value) &&
    !isActualNaN(value) &&
    fy.number(n) &&
    !isActualNaN(n) &&
    n !== 0;
  return (
    isDividendInfinite ||
    isDivisorInfinite ||
    (isNonZeroNumber && value % n === 0)
  );
};

/**
 * fy.integer
 * Test if `value` is an integer.
 *
 * @param value to test
 * @return {Boolean} true if `value` is an integer, false otherwise
 * @api public
 */

fy.integer = is["int"] = function (value) {
  return fy.number(value) && !isActualNaN(value) && value % 1 === 0;
};

/**
 * fy.maximum
 * Test if `value` is greater than 'others' values.
 *
 * @param {Number} value value to test
 * @param {Array} others values to compare with
 * @return {Boolean} true if `value` is greater than `others` values
 * @api public
 */

fy.maximum = function (value, others) {
  if (isActualNaN(value)) {
    throw new TypeError("NaN is not a valid value");
  } else if (!fy.arraylike(others)) {
    throw new TypeError("second argument must be array-like");
  }
  var len = others.length;

  while (--len >= 0) {
    if (value < others[len]) {
      return false;
    }
  }

  return true;
};

/**
 * fy.minimum
 * Test if `value` is less than `others` values.
 *
 * @param {Number} value value to test
 * @param {Array} others values to compare with
 * @return {Boolean} true if `value` is less than `others` values
 * @api public
 */

fy.minimum = function (value, others) {
  if (isActualNaN(value)) {
    throw new TypeError("NaN is not a valid value");
  } else if (!fy.arraylike(others)) {
    throw new TypeError("second argument must be array-like");
  }
  var len = others.length;

  while (--len >= 0) {
    if (value > others[len]) {
      return false;
    }
  }

  return true;
};

/**
 * fy.nan
 * Test if `value` is not a number.
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is not a number, false otherwise
 * @api public
 */

fy.nan = function (value) {
  return !fy.number(value) || value !== value;
};

/**
 * fy.even
 * Test if `value` is an even number.
 *
 * @param {Number} value value to test
 * @return {Boolean} true if `value` is an even number, false otherwise
 * @api public
 */

fy.even = function (value) {
  return (
    fy.infinite(value) ||
    (fy.number(value) && value === value && value % 2 === 0)
  );
};

/**
 * fy.odd
 * Test if `value` is an odd number.
 *
 * @param {Number} value value to test
 * @return {Boolean} true if `value` is an odd number, false otherwise
 * @api public
 */

fy.odd = function (value) {
  return (
    fy.infinite(value) ||
    (fy.number(value) && value === value && value % 2 !== 0)
  );
};

/**
 * fy.ge
 * Test if `value` is greater than or equal to `other`.
 *
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean}
 * @api public
 */

fy.ge = function (value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError("NaN is not a valid value");
  }
  return !fy.infinite(value) && !fy.infinite(other) && value >= other;
};

/**
 * fy.gt
 * Test if `value` is greater than `other`.
 *
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean}
 * @api public
 */

fy.gt = function (value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError("NaN is not a valid value");
  }
  return !fy.infinite(value) && !fy.infinite(other) && value > other;
};

/**
 * fy.le
 * Test if `value` is less than or equal to `other`.
 *
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean} if 'value' is less than or equal to 'other'
 * @api public
 */

fy.le = function (value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError("NaN is not a valid value");
  }
  return !fy.infinite(value) && !fy.infinite(other) && value <= other;
};

/**
 * fy.lt
 * Test if `value` is less than `other`.
 *
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean} if `value` is less than `other`
 * @api public
 */

fy.lt = function (value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError("NaN is not a valid value");
  }
  return !fy.infinite(value) && !fy.infinite(other) && value < other;
};

/**
 * fy.within
 * Test if `value` is within `start` and `finish`.
 *
 * @param {Number} value value to test
 * @param {Number} start lower bound
 * @param {Number} finish upper bound
 * @return {Boolean} true if 'value' is is within 'start' and 'finish'
 * @api public
 */
fy.within = function (value, start, finish) {
  if (isActualNaN(value) || isActualNaN(start) || isActualNaN(finish)) {
    throw new TypeError("NaN is not a valid value");
  } else if (!fy.number(value) || !fy.number(start) || !fy.number(finish)) {
    throw new TypeError("all arguments must be numbers");
  }
  var isAnyInfinite =
    fy.infinite(value) || fy.infinite(start) || fy.infinite(finish);
  return isAnyInfinite || (value >= start && value <= finish);
};

/**
 * Test object.
 */

/**
 * fy.object
 * Test if `value` is an object.
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is an object, false otherwise
 * @api public
 */
fy.object = function (value) {
  return toStr.call(value) === "[object Object]";
};

/**
 * fy.primitive
 * Test if `value` is a primitive.
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is a primitive, false otherwise
 * @api public
 */
fy.primitive = function isPrimitive(value) {
  if (!value) {
    return true;
  }
  if (
    typeof value === "object" ||
    fy.object(value) ||
    fy.fn(value) ||
    fy.array(value)
  ) {
    return false;
  }
  return true;
};

/**
 * fy.hash
 * Test if `value` is a hash - a plain object literal.
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is a hash, false otherwise
 * @api public
 */

fy.hash = function (value) {
  return (
    fy.object(value) &&
    value.constructor === Object &&
    !value.nodeType &&
    !value.setInterval
  );
};

/**
 * Test regexp.
 */

/**
 * fy.regexp
 * Test if `value` is a regular expression.
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is a regexp, false otherwise
 * @api public
 */

fy.regexp = function (value) {
  return toStr.call(value) === "[object RegExp]";
};

/**
 * Test string.
 */

/**
 * fy.string
 * Test if `value` is a string.
 *
 * @param {*} value value to test
 * @return {Boolean} true if 'value' is a string, false otherwise
 * @api public
 */

fy.string = function (value) {
  return toStr.call(value) === "[object String]";
};

/**
 * Test base64 string.
 */

/**
 * fy.base64
 * Test if `value` is a valid base64 encoded string.
 *
 * @param {*} value value to test
 * @return {Boolean} true if 'value' is a base64 encoded string, false otherwise
 * @api public
 */

fy.base64 = function (value) {
  return fy.string(value) && (!value.length || base64Regex.test(value));
};

/**
 * Test base64 string.
 */

/**
 * fy.hex
 * Test if `value` is a valid hex encoded string.
 *
 * @param {*} value value to test
 * @return {Boolean} true if 'value' is a hex encoded string, false otherwise
 * @api public
 */

fy.hex = function (value) {
  return fy.string(value) && (!value.length || hexRegex.test(value));
};

/**
 * fy.symbol
 * Test if `value` is an ES6 Symbol
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is a Symbol, false otherise
 * @api public
 */

fy.symbol = function (value) {
  return (
    typeof Symbol === "function" &&
    toStr.call(value) === "[object Symbol]" &&
    typeof symbolValueOf.call(value) === "symbol"
  );
};

/**
 * fy.bigint
 * Test if `value` is an ES-proposed BigInt
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is a BigInt, false otherise
 * @api public
 */

fy.bigint = function (value) {
  return (
    typeof BigInt === "function" &&
    toStr.call(value) === "[object BigInt]" &&
    typeof bigIntValueOf.call(value) === "bigint"
  );
};

module.exports = is;
