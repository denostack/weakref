# weakref

<a href="https://github.com/denostack"><img src="https://raw.githubusercontent.com/denostack/images/main/logo.svg" width="240" /></a>

<p>
  <a href="https://github.com/denostack/weakref/actions"><img alt="Build" src="https://img.shields.io/github/actions/workflow/status/denostack/weakref/ci.yml?branch=main&logo=github&style=flat-square" /></a>
  <a href="https://codecov.io/gh/denostack/weakref"><img alt="Coverage" src="https://img.shields.io/codecov/c/gh/denostack/weakref?style=flat-square" /></a>
  <img alt="License" src="https://img.shields.io/npm/l/weakref.svg?style=flat-square" />
  <img alt="Language Typescript" src="https://img.shields.io/badge/language-Typescript-007acc.svg?style=flat-square" />
  <br />
  <a href="https://deno.land/x/weakref"><img alt="deno.land/x/weakref" src="https://img.shields.io/badge/dynamic/json?url=https://api.github.com/repos/denostack/weakref/tags&query=$[0].name&display_name=tag&label=deno.land/x/weakref@&style=flat-square&logo=deno&labelColor=000&color=777" /></a>
  <a href="https://www.npmjs.com/package/weakref"><img alt="Version" src="https://img.shields.io/npm/v/weakref.svg?style=flat-square&logo=npm" /></a>
  <a href="https://npmcharts.com/compare/weakref?minimal=true"><img alt="Downloads" src="https://img.shields.io/npm/dt/weakref.svg?style=flat-square" /></a>
</p>

This library provides three iterable weak data structures for JavaScript,
IterableWeakSet, IterableWeakMap, and WeakValueMap. These data structures are
designed to work with objects as keys or values, and are useful when you need to
store a collection of objects that may be garbage collected.

## Usage

### with Deno

```ts
import {
  IterableWeakMap,
  IterableWeakSet,
  WeakValueMap,
} from "https://deno.land/x/weakref/mod.ts";

const set = new IterableWeakSet();
const map = new IterableWeakMap();

const weakValueMap = new WeakValueMap();
```

### with Node.js & Browser

**Install**

```bash
npm install weakref
```

```ts
import { IterableWeakMap, IterableWeakSet } from "weakref";
```

## Features

### IterableWeakSet

IterableWeakSet is a class that extends the WeakSet and Set classes in
JavaScript, allowing you to create a set of objects that can be iterated over.
Objects in the set are stored using weak references, which means that they can
be garbage collected if they are no longer referenced elsewhere in the program.

**Interface**

```ts
class IterableWeakSet<T extends object> implements WeakSet<T>, Set<T> {
  constructor(values?: readonly T[] | null);
  constructor(iterable: Iterable<T>);
}
```

**Example**

```ts
const set = new IterableWeakSet();

// create an object with a weak reference
{
  const user = { id: 1, email: "hey@wan2.land" };
  set.add(user);
}
// end of scope, user will be garbage collected

// force garbage collection
if (global.gc) {
  global.gc();
}

// check the set size
console.log(set.size); // output: 0
```

### IterableWeakMap

IterableWeakMap is a class that extends the WeakMap and Map classes in
JavaScript, allowing you to create a map of objects that can be iterated over.
Keys in the map are stored using weak references, which means that they can be
garbage collected if they are no longer referenced elsewhere in the program.

**Interface**

```ts
class IterableWeakMap<K extends object, V> implements WeakMap<K, V>, Map<K, V> {
  constructor(entries?: readonly (readonly [K, V])[] | null);
  constructor(iterable: Iterable<readonly [K, V]>);
}
```

**Example**

```ts
const map = new IterableWeakMap();

// create an object with a weak reference
{
  const user = { id: 1, email: "hey@wan2.land" };
  const metadata = { created: new Date() };
  map.set(user, metadata);
}
// end of scope, user will be garbage collected

// force garbage collection
if (global.gc) {
  global.gc();
}

// check the map size
console.log(map.size); // output: 0
```

### WeakValueMap

WeakValueMap is a class that allows you to create a map of non-object keys with
weak references to object values. This is useful when you have a collection of
non-object keys that you want to use to look up objects, and those objects may
be garbage collected.

**Interface**

```ts
class WeakValueMap<K, V extends object> implements Map<K, V> {
  constructor(entries?: readonly (readonly [K, V])[] | null);
  constructor(iterable: Iterable<readonly [K, V]>);
}
```

**Example**

```ts
const map = new WeakValueMap();

// create an object with a weak reference
{
  const user = { id: 1, email: "hey@wan2.land" };
  map.set(user.id, user);
}
// end of scope, user will be garbage collected

// force garbage collection
if (global.gc) {
  global.gc();
}

// check the map size
console.log(map.size); // output: 0
```

## See Also

- [Python weakref](https://docs.python.org/3/library/weakref.html) my library is
  inspired by this library.
- [MDN - JS WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
- [MDN - JS WeakSet](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet)
- [MDN - JS WeakRef](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakRef)
- [MDN - JS FinalizationRegistry](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/FinalizationRegistry)
