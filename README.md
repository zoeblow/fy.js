# fy <sup>[![Version Badge][npm-version-svg]][npm-url]</sup>

一个自用的 JavaScript 类型测试库

## 安装

```shell
$ npm install fy.js
# or
$ yarn add fy.js
```

## API

### 通用

- `fy.isA` (value, type) or `fy.isTypeof` (value, type)
  > 测试`value`的 typeOf 是否为`type`类型。
- `fy.isDefined` (value)
  > 测试是否定义了`value`。
- `fy.isEmpty` (value)
  > 测试`value`是否为空。
- `fy.isEqual` (value, other)
  > 测试`value`是否等于`other`。
- `fy.isHosted` (value, host)
  > 测试`value`是否由`Host`托管。
- `fy.isInstance` (value, constructor)
  > 测试`value`是否为`constructor`的实例。
- `fy.isNull` (value)
  > 测试`value`是否 `null`。
- `fy.isUndefined` (value)
  > 测试`value`是否 `undefined`。

### 参数

- `fy.isArgs` (value)
  > 测试`value`是否为参数对象。
- `fy.isArgs.isEmpty` (value)
  > 测试`value`是否为空参数对象。

### 数组

- `fy.isArray` (value)
  > 测试`value`是否为 `array`。
- `fy.isArray.isEmpty` (value)
  > 测试`value`是否为空 `array`。
- `fy.isArrayLike` (value)
  > 测试`value`是否是类 `array` 的对象。

### 布尔值

- `fy.isBool` (value)
  > 测试`value`是否为布尔值。
- `fy.isTrue` (value)
  > 测试`value`是否为`true`。
- `fy.isFalse` (value)
  > 测试`value`是否为`false`。

### 日期

- `fy.isDate` (value)
  > 测试`value`是否为日期。

### 节点元素

- `fy.isElement` (value)
  > 测试`value`是否为 html 元素。

### 错误/异常

- `fy.isError` (value)
  > 测试`value`是否为`error`对象。

### 函数

- `fy.isFn` (value)
  > 测试`value`是否为函数对象。

### 数字

- `fy.isNumber` (value)
  > 测试`value`是否为数字。
- `fy.isInfinite` (value)
  > 测试`value`是正无穷大还是负无穷大。
- `fy.isDecimal` (value)
  > 测试`value`是否为十进制数。
- `fy.isDivisibleBy` (value, n)
  > 测试`value`是否可以被`N`整除。
- `fy.isInteger` (value)
  > 测试`value`是否为整数。
- `fy.isMaximum/isMax` (value, others[])
  > 测试`value`是否是`others`值中最大的。
- `fy.isMinimum/isMin` (value, others[])
  > 测试`value`是否是`others`值中最小的。
- `fy.isNaN` (value)
  > 测试`value`是否不是 NaN。
- `fy.isEven` (value)
  > 测试`value`是否为偶数。
- `fy.isOdd` (value)
  > 测试`value`是否为奇数。
- `fy.isGe` (value, other)
  > 测试`value`是否大于或等于`other`。
- `fy.isGt` (value, other)
  > 测试`value`是否大于`other`。
- `fy.isLe` (value, other)
  > 测试`value`是否小于等于`other`。
- `fy.isLt` (value, other)

  > 测试`value`是否小于`other`。

- `fy.isWithin` (value, start, finish)
  > 测试`value`是否在`start`和`finish`之间。

### 对象

- `fy.isObject` (value)
  > 测试`value`是否为 Object。

### 正则

- `fy.isRegexp` (value)
  > 测试`value`是否为正则表达式。

### 字符串

- `fy.isString` (value)
  > 测试`value`是否为字符串。

### 编码

- `fy.isBase64` (value)

  > 测试`value`是否为有效的 Base64 编码字符串。

- `fy.isHex` (value)
  > 测试 `value` 是否为有效的十六进制编码字符串。

### Symbols

- `fy.isSymbol` (value)
  > 测试`value`是否为 ES6 Symbol

### 大数字

- `fy.isBigint` (value)
  > 测试`value`是否为 ES 建议的 BigInt

[npm-url]: https://npmjs.org/package/fy.js
[npm-version-svg]: http://versionbadg.isEs/zoeblow/fy.js.svg
