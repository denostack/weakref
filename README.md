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

Weak Collection Library for Deno and Node.js.

## Usage

### with Deno

```ts
import {
  IterableWeakMap,
  IterableWeakSet,
} from "https://deno.land/x/weakref/mod.ts";

const set = new IterableWeakSet();
const map = new IterableWeakMap();
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

for (let i = 0; i < 100; i++) {
  set.add({});
}

for (const item of set) {
  console.log(item); // will print 100 items
}

// after garbage collection, {n} items will be collected

for (const item of set) {
  console.log(item); // will print (100 - {n}) items
}
```

### IterableWeakMap

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

for (let i = 0; i < 100; i++) {
  map.set({}, i);
}

for (const [key, value] of map) {
  console.log(key, value); // will print 100 items
}

// after garbage collection, {n} items will be collected

for (const [key, value] of map) {
  console.log(key, value); // will print (100 - {n}) items
}
```

### InvertedWeakMap

**Interface**

```ts
class InvertedWeakMap<K, V extends object> implements Map<K, V> {
  constructor(entries?: readonly (readonly [K, V])[] | null);
  constructor(iterable: Iterable<readonly [K, V]>);
}
```

**Example**

```ts
const map = new InvertedWeakMap();

for (let i = 0; i < 100; i++) {
  map.set(i, {});
}

for (const [key, value] of map) {
  console.log(key, value); // will print 100 items
}

// after garbage collection, {n} items will be collected

for (const [key, value] of map) {
  console.log(key, value); // will print (100 - {n}) items
}
```
