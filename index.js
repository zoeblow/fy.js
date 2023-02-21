"use strict";

/**!
 * fy.js
 *  一个通用的 JavaScript 类型测试库
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
 * 声明 `fy`
 */

var fy = {};

/**
 * Test general.
 */
/**
 * isType
 * Test if `value` is a type of `typeof`.
 *
 * @param {*} value value to test
 * @param {String} type type
 * @return {Boolean} true if `value` is a type of `type`, false otherwise
 * @api public
 */

fy.isA = fy.isType = function (value, type) {
  return typeof value === type;
};

/**
 * fy.isDefined
 * Test if `value` is defined.
 * 测试是否定义了`value`。
 *
 * @param {*} value value to test
 * @return {Boolean} true if 'value' is defined, false otherwise
 * @api public
 */

fy.isDefined = function (value) {
  return typeof value !== "undefined";
};

/**
 * fy.isEmpty
 * Test if `value` is empty.
 * 测试`value`是否为空。
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is empty, false otherwise
 * @api public
 */

fy.isEmpty = function (value) {
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
 * fy.isEqual
 * Test if `value` is equal to `other`.
 * 测试`value`是否等于`other`。
 *
 * @param {*} value value to test
 * @param {*} other value to compare with
 * @return {Boolean} true if `value` is equal to `other`, false otherwise
 */

fy.isEqual = function equal(value, other) {
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
      if (!fy.isEqual(value[key], other[key]) || !(key in other)) {
        return false;
      }
    }
    for (key in other) {
      if (!fy.isEqual(value[key], other[key]) || !(key in value)) {
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
      if (!fy.isEqual(value[key], other[key])) {
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
 * fy.isHosted
 * Test if `value` is hosted by `host`.
 * 测试`value`是否由`Host`托管。
 *
 * @param {*} value to test
 * @param {*} host host to test with
 * @return {Boolean} true if `value` is hosted by `host`, false otherwise
 * @api public
 */

fy.isHosted = function (value, host) {
  var type = typeof host[value];
  return type === "object" ? !!host[value] : !NON_HOST_TYPES[type];
};

/**
 * fy.isInstance
 * Test if `value` is an instance of `constructor`.
 * 测试`value`是否为`constructor`的实例。
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is an instance of `constructor`
 * @api public
 */

fy.isInstance = fy["instanceof"] = function (value, constructor) {
  return value instanceof constructor;
};

/**
 * fy.isNull / fy.null
 * Test if `value` is null.
 * 测试`value`是否 `null`。
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is null, false otherwise
 * @api public
 */

fy.isNull = fy["null"] = function (value) {
  return value === null;
};

/**
 * fy.isUndefined / fy.undefined
 * Test if `value` is undefined.
 * 测试`value`是否 `undefined`。
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is undefined, false otherwise
 * @api public
 */

fy.isUndefined = fy["undefined"] = function (value) {
  return typeof value === "undefined";
};

/**
 * Test arguments.
 */

/**
 * fy.isArgs
 * Test if `value` is an arguments object.
 * 测试`value`是否为参数对象。
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is an arguments object, false otherwise
 * @api public
 */

fy.isArgs = fy.isArguments = function (value) {
  var isStandardArguments = toStr.call(value) === "[object Arguments]";
  var isOldArguments =
    !fy.isArray(value) &&
    fy.isArrayLike(value) &&
    fy.isObject(value) &&
    fy.isFn(value.callee);
  return isStandardArguments || isOldArguments;
};

/**
 * Test array.
 */

/**
 * fy.isArray
 * Test if 'value' is an array.
 * 测试‘Value’是否为数组。
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is an array, false otherwise
 * @api public
 */

fy.isArray =
  Array.isArray ||
  function (value) {
    return toStr.call(value) === "[object Array]";
  };

/**
 * fy.isArguments.isEmpty
 * Test if `value` is an empty arguments object.
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is an empty arguments object, false otherwise
 * @api public
 */
fy.isArgs.isEmpty = function (value) {
  return fy.isArgs(value) && value.length === 0;
};

/**
 * fy.isArray.isEmpty
 * Test if `value` is an empty array.
 * 测试`value`是否为空数组。
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is an empty array, false otherwise
 * @api public
 */
fy.isArray.isEmpty = function (value) {
  return fy.isArray(value) && value.length === 0;
};

/**
 * fy.isArrayLike
 * Test if `value` is an arraylike object.
 * 测试`value`是否是类数组的对象。
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is an arguments object, false otherwise
 * @api public
 */

fy.isArrayLike = function (value) {
  return (
    !!value &&
    !fy.isBool(value) &&
    owns.call(value, "length") &&
    isFinite(value.length) &&
    fy.isNumber(value.length) &&
    value.length >= 0
  );
};

/**
 * Test boolean.
 */

/**
 * fy.isBool
 * Test if `value` is a boolean.
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is a boolean, false otherwise
 * @api public
 */

fy.isBool = fy["boolean"] = function (value) {
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

fy.isFalse = fy["false"] = function (value) {
  return fy.isBool(value) && Boolean(Number(value)) === false;
};

/**
 * fy.true
 * Test if `value` is true.
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is true, false otherwise
 * @api public
 */

fy.isTrue = fy["true"] = function (value) {
  return fy.isBool(value) && Boolean(Number(value)) === true;
};

/**
 * Test date.
 */

/**
 * fy.isDate
 * Test if `value` is a date.
 * 测试`value`是否为日期。
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is a date, false otherwise
 * @api public
 */

fy.isDate = function (value) {
  return toStr.call(value) === "[object Date]";
};

/**
 * fy.isDate.valid
 * Test if `value` is a valid date.
 *
 * @param {*} value value to test
 * @returns {Boolean} true if `value` is a valid date, false otherwise
 */
fy.isDate.valid = function (value) {
  return fy.isDate(value) && !isNaN(Number(value));
};

/**
 * Test element.
 */

/**
 * fy.isElement
 * Test if `value` is an html element.
 * 测试`value`是否为html元素。
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is an HTML Element, false otherwise
 * @api public
 */

fy.isElement = function (value) {
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
 * fy.isError
 * Test if `value` is an error object.
 * 测试`value`是否为`error`对象。
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is an error object, false otherwise
 * @api public
 */

fy.isError = function (value) {
  return toStr.call(value) === "[object Error]";
};

/**
 * Test function.
 */

/**
 * fy.isFn / fy.function (deprecated)
 * Test if `value` is a function.
 * 测试`value`是否为函数。
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is a function, false otherwise
 * @api public
 */

fy.isFn = fy["function"] = function (value) {
  var isAlert = typeof window !== "undefined" && value === window.isAlert;
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
 * fy.isNumber
 * Test if `value` is a number.
 * 测试`value`是否为数字。
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is a number, false otherwise
 * @api public
 */

fy.isNumber = function (value) {
  return toStr.call(value) === "[object Number]";
};

/**
 * fy.isInfinite
 * Test if `value` is positive or negative infinity.
 * 测试`value`是正无穷大还是负无穷大。
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is positive or negative Infinity, false otherwise
 * @api public
 */
fy.isInfinite = function (value) {
  return value === Infinity || value === -Infinity;
};

/**
 * fy.isDecimal
 * Test if `value` is a decimal number.
 * 测试`value`是否为十进制数。
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is a decimal number, false otherwise
 * @api public
 */

fy.isDecimal = function (value) {
  return (
    fy.isNumber(value) &&
    !isActualNaN(value) &&
    !fy.isInfinite(value) &&
    value % 1 !== 0
  );
};

/**
 * fy.isDivisibleBy
 * Test if `value` is divisible by `n`.
 * 测试`value`是否可以被`N`整除。
 *
 * @param {Number} value value to test
 * @param {Number} n dividend
 * @return {Boolean} true if `value` is divisible by `n`, false otherwise
 * @api public
 */

fy.isDivisibleBy = function (value, n) {
  var isDividendInfinite = fy.isInfinite(value);
  var isDivisorInfinite = fy.isInfinite(n);
  var isNonZeroNumber =
    fy.isNumber(value) &&
    !isActualNaN(value) &&
    fy.isNumber(n) &&
    !isActualNaN(n) &&
    n !== 0;
  return (
    isDividendInfinite ||
    isDivisorInfinite ||
    (isNonZeroNumber && value % n === 0)
  );
};

/**
 * fy.isInteger
 * Test if `value` is an integer.
 * 测试`value`是否为整数。
 *
 * @param value to test
 * @return {Boolean} true if `value` is an integer, false otherwise
 * @api public
 */

fy.isInteger = fy["int"] = function (value) {
  return fy.isNumber(value) && !isActualNaN(value) && value % 1 === 0;
};

/**
 * fy.isMaximum
 * Test if `value` is greater than 'others' values.
 * 测试`value`是否是`others`值中最大的。
 *
 * @param {Number} value value to test
 * @param {Array} others values to compare with
 * @return {Boolean} true if `value` is greater than `others` values
 * @api public
 */

fy.isMax = fy.isMaximum = function (value, others) {
  if (isActualNaN(value)) {
    throw new TypeError("NaN is not a valid value");
  } else if (!fy.isArrayLike(others)) {
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
 * fy.isMinimum
 * Test if `value` is less than `others` values.
 * 测试`value`是否小于`others`值。
 *
 * @param {Number} value value to test
 * @param {Array} others values to compare with
 * @return {Boolean} true if `value` is less than `others` values
 * @api public
 */

fy.isMin = fy.isMinimum = function (value, others) {
  if (isActualNaN(value)) {
    throw new TypeError("NaN is not a valid value");
  } else if (!fy.isArrayLike(others)) {
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
 * fy.isNaN
 * Test if `value` is not a number.
 * 测试`value`是否不是NaN。
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is not a number, false otherwise
 * @api public
 */

fy.isNaN = function (value) {
  return !fy.isNumber(value) || value !== value;
};

/**
 * fy.isEven
 * Test if `value` is an even number.
 * 测试`value`是否为偶数。
 *
 * @param {Number} value value to test
 * @return {Boolean} true if `value` is an even number, false otherwise
 * @api public
 */

fy.isEven = function (value) {
  return (
    fy.isInfinite(value) ||
    (fy.isNumber(value) && value === value && value % 2 === 0)
  );
};

/**
 * fy.isOdd
 * Test if `value` is an odd number.
 * 测试`value`是否为奇数。
 *
 * @param {Number} value value to test
 * @return {Boolean} true if `value` is an odd number, false otherwise
 * @api public
 */

fy.isOdd = function (value) {
  return (
    fy.isInfinite(value) ||
    (fy.isNumber(value) && value === value && value % 2 !== 0)
  );
};

/**
 * fy.isGe
 * Test if `value` is greater than or equal to `other`.
 * 测试`value`是否大于或等于`other`。
 *
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean}
 * @api public
 */

fy.isGe = function (value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError("NaN is not a valid value");
  }
  return !fy.isInfinite(value) && !fy.isInfinite(other) && value >= other;
};

/**
 * fy.isGt
 * Test if `value` is greater than `other`.
 * 测试`value`是否大于`other`。
 *
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean}
 * @api public
 */

fy.isGt = function (value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError("NaN is not a valid value");
  }
  return !fy.isInfinite(value) && !fy.isInfinite(other) && value > other;
};

/**
 * fy.isLe
 * Test if `value` is less than or equal to `other`.
 * 测试`value`是否小于等于`other`。
 *
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean} if 'value' is less than or equal to 'other'
 * @api public
 */

fy.isLe = function (value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError("NaN is not a valid value");
  }
  return !fy.isInfinite(value) && !fy.isInfinite(other) && value <= other;
};

/**
 * fy.isLt
 * Test if `value` is less than `other`.
 * 测试`value`是否小于`other`。
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean} if `value` is less than `other`
 * @api public
 */

fy.isLt = function (value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError("NaN is not a valid value");
  }
  return !fy.isInfinite(value) && !fy.isInfinite(other) && value < other;
};

/**
 * fy.isWithin
 * Test if `value` is within `start` and `finish`.
 * 测试`value`是否在`start`和`finish`之间。
 *
 * @param {Number} value value to test
 * @param {Number} start lower bound
 * @param {Number} finish upper bound
 * @return {Boolean} true if 'value' is is within 'start' and 'finish'
 * @api public
 */
fy.isWithin = function (value, start, finish) {
  if (isActualNaN(value) || isActualNaN(start) || isActualNaN(finish)) {
    throw new TypeError("NaN is not a valid value");
  } else if (
    !fy.isNumber(value) ||
    !fy.isNumber(start) ||
    !fy.isNumber(finish)
  ) {
    throw new TypeError("all arguments must be numbers");
  }
  var isAnyInfinite =
    fy.isInfinite(value) || fy.isInfinite(start) || fy.isInfinite(finish);
  return isAnyInfinite || (value >= start && value <= finish);
};

/**
 * Test object.
 */

/**
 * fy.isObject
 * Test if `value` is an object.
 * 测试`value`是否为Object。
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is an object, false otherwise
 * @api public
 */
fy.isObject = function (value) {
  return toStr.call(value) === "[object Object]";
};

/**
 * fy.primitive
 * Test if `value` is a primitive.
 * 测试`value`是否为原始值。
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is a primitive, false otherwise
 * @api public
 */
fy.isPrimitive = function isPrimitive(value) {
  if (!value) {
    return true;
  }
  if (
    typeof value === "object" ||
    fy.isObject(value) ||
    fy.isFn(value) ||
    fy.isArray(value)
  ) {
    return false;
  }
  return true;
};

/**
 * fy.isHash
 * Test if `value` is a hash - a plain object literal.
 * 测试`value`是否为 Hash --纯对象文字。
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is a hash, false otherwise
 * @api public
 */

fy.isHash = function (value) {
  return (
    fy.isObject(value) &&
    value.constructor === Object &&
    !value.nodeType &&
    !value.setInterval
  );
};

/**
 * Test regexp.
 */

/**
 * fy.isRegexp
 * Test if `value` is a regular expression.
 * 测试`value`是否为正则表达式。
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is a regexp, false otherwise
 * @api public
 */

fy.isRegexp = function (value) {
  return toStr.call(value) === "[object RegExp]";
};

/**
 * Test string.
 */

/**
 * fy.isString
 * Test if `value` is a string.
 * 测试`value`是否为字符串。
 *
 * @param {*} value value to test
 * @return {Boolean} true if 'value' is a string, false otherwise
 * @api public
 */

fy.isString = function (value) {
  return toStr.call(value) === "[object String]";
};

/**
 * Test base64 string.
 */

/**
 * fy.isBase64
 * Test if `value` is a valid base64 encoded string.
 * 测试`value`是否为有效的Base64编码字符串。
 *
 * @param {*} value value to test
 * @return {Boolean} true if 'value' is a base64 encoded string, false otherwise
 * @api public
 */

fy.isBase64 = function (value) {
  return fy.isString(value) && (!value.length || base64Regex.test(value));
};

/**
 * Test base64 string.
 */

/**
 * fy.isHex
 * Test if `value` is a valid hex encoded string.
 * 测试`value`是否为有效的十六进制编码字符串。
 *
 * @param {*} value value to test
 * @return {Boolean} true if 'value' is a hex encoded string, false otherwise
 * @api public
 */

fy.isHex = function (value) {
  return fy.isString(value) && (!value.length || hexRegex.test(value));
};

/**
 * fy.isSymbol
 * Test if `value` is an ES6 Symbol
 * 测试`value`是否为ES6 Symbol
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is a Symbol, false otherise
 * @api public
 */

fy.isSymbol = function (value) {
  return (
    typeof Symbol === "function" &&
    toStr.call(value) === "[object Symbol]" &&
    typeof symbolValueOf.call(value) === "symbol"
  );
};

/**
 * fy.isBigint
 * Test if `value` is an ES-proposed BigInt
 * 测试`value`是否为 ES 建议的 BigInt
 *
 * @param {*} value value to test
 * @return {Boolean} true if `value` is a BigInt, false otherise
 * @api public
 */

fy.isBigint = function (value) {
  return (
    typeof BigInt === "function" &&
    toStr.call(value) === "[object BigInt]" &&
    typeof bigIntValueOf.call(value) === "bigint"
  );
};

module.exports = fy;
