# weakref <a href="https://github.com/denostack"><img src="https://raw.githubusercontent.com/denostack/images/main/logo.svg" width="160" align="right" /></a>

<p>
  <a href="https://github.com/denostack/weakref/actions"><img alt="Build" src="https://img.shields.io/github/actions/workflow/status/denostack/weakref/ci.yml?branch=main&logo=github&style=flat-square" /></a>
  <a href="https://codecov.io/gh/denostack/weakref"><img alt="Coverage" src="https://img.shields.io/codecov/c/gh/denostack/weakref?style=flat-square" /></a>
  <img alt="License" src="https://img.shields.io/npm/l/weakref.svg?style=flat-square" />
  <img alt="Language Typescript" src="https://img.shields.io/badge/language-Typescript-007acc.svg?style=flat-square" />
  <br />
<a href="https://jsr.io/@denostack/weakref"><img alt="JSR version" src="https://jsr.io/badges/@denostack/weakref?style=flat-square" /></a>
  <a href="https://deno.land/x/weakref"><img alt="Deno version" src="https://deno.land/badge/weakref/version?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/weakref"><img alt="NPM Version" src="https://img.shields.io/npm/v/weakref.svg?style=flat-square&logo=npm" /></a>
  <a href="https://npmcharts.com/compare/weakref?minimal=true"><img alt="Downloads" src="https://img.shields.io/npm/dt/weakref.svg?style=flat-square" /></a>
</p>

This library provides three iterable weak data structures for JavaScript,
IterableWeakSet, IterableWeakMap, and WeakValueMap. They keep only weak
references to their keys or values, so entries disappear automatically once the
referenced objects are garbage collected instead of blocking GC.

## Usage

### with Deno

```ts
import {
  IterableWeakMap,
  IterableWeakSet,
  WeakValueMap,
} from "@denostack/weakref";

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
import { IterableWeakMap, IterableWeakSet, WeakValueMap } from "weakref";
```

> [!NOTE]
> Examples below call `globalThis.gc?.()` only to symbolize “a GC cycle just
> finished”. Manual GC is available only when the runtime exposes it (e.g.
> Node.js started with `--expose-gc`); otherwise entries disappear the next time
> the runtime notifies the `FinalizationRegistry`.

## Features

### IterableWeakSet

IterableWeakSet implements the semantics of both WeakSet (weak keys) and Set
(iteration helpers) so you can keep a deduplicated collection of objects without
preventing them from being garbage collected. Once an object is collected, the
entry is removed automatically.

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

// ...later, after a GC cycle (optional manual trigger shown here)
globalThis.gc?.(); // Node needs --expose-gc

// check the set size
console.log(set.size); // output: 0
```

### IterableWeakMap

IterableWeakMap combines a WeakMap with iterable Map helpers so you can inspect
entries without blocking GC. Keys are weakly referenced and disappear once they
are no longer referenced elsewhere.

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

// ...later, after a GC cycle (optional manual trigger shown here)
globalThis.gc?.(); // Node needs --expose-gc

// check the map size
console.log(map.size); // output: 0
```

### WeakValueMap

WeakValueMap is a class that allows you to create a map of non-object keys with
weak references to object values. It is useful when primitive identifiers are
used to look up objects that should be collected when no longer referenced
elsewhere.

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

// ...later, after a GC cycle (optional manual trigger shown here)
globalThis.gc?.(); // Node needs --expose-gc

// check the map size
console.log(map.size); // output: 0
```

> [!TIP]
> WeakValueMap relies on the host's `FinalizationRegistry`, so `size`/`has`
> shrink as soon as the GC notifies the registry. There can be a short delay
> between the object being collected and the entry disappearing.

## See Also

- [Python weakref](https://docs.python.org/3/library/weakref.html) inspired this
  project.
- [MDN - JS WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
- [MDN - JS WeakSet](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet)
- [MDN - JS WeakRef](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakRef)
- [MDN - JS FinalizationRegistry](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/FinalizationRegistry)
