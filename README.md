# is <sup>[![Version Badge][npm-version-svg]][npm-url]</sup>

一个自用的 JavaScript 类型测试库

## 安装

```shell
$ npm install fy.js
# or
$ yarn add fy.js
```

## API

### 通用

- `fy.a` (value, type) or `fy.type` (value, type)
- `fy.defined` (value)
- `fy.empty` (value)
- `fy.equal` (value, other)
- `fy.hosted` (value, host)
- `fy.instance` (value, constructor)
- `fy.nil` (value)
- `fy.undef` (value)

### 参数

- `fy.args` (value)
- `fy.args.empty` (value)

### 数组

- `fy.array` (value)
- `fy.array.empty` (value)
- `fy.arraylike` (value)

### 布尔值

- `fy.bool` (value)

### 日期

- `fy.date` (value)

### 节点元素

- `fy.element` (value)

### 错误/异常

- `fy.error` (value)

### function

- `fy.fn` (value)

### 数字

- `fy.number` (value)
- `fy.infinite` (value)
- `fy.decimal` (value)
- `fy.divisibleBy` (value, n)
- `fy.integer` (value)
- `fy.maximum` (value, others)
- `fy.minimum` (value, others)
- `fy.nan` (value)
- `fy.even` (value)
- `fy.odd` (value)
- `fy.ge` (value, other)
- `fy.gt` (value, other)
- `fy.le` (value, other)
- `fy.lt` (value, other)
- `fy.within` (value, start, finish)

### 对象

- `fy.object` (value)

### 正则

- `fy.regexp` (value)

### 字符串

- `fy.string` (value)

### 编码

- `fy.base64` (value)
- `fy.hex` (value)

### Symbols

- `fy.symbol` (value)

### 大数字

- `fy.bigint` (value)
