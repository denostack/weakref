import { IterableWeakSet } from "./iterable_weak_set.ts";

export class IterableWeakMap<K extends object, V>
  implements WeakMap<K, V>, Map<K, V> {
  #weakMap = new WeakMap<K, V>();
  #set = new IterableWeakSet<K>();

  constructor(entries?: readonly (readonly [K, V])[] | null);
  constructor(iterable: Iterable<readonly [K, V]>);
  constructor(iterable?: Iterable<readonly [K, V]> | null) {
    for (const [key, value] of iterable ?? []) {
      this.set(key, value);
    }
  }

  get size(): number {
    return this.#set.size;
  }

  clear(): void {
    for (const key of this.#set) {
      this.delete(key);
    }
  }

  delete(key: K): boolean {
    const ref = this.#weakMap.get(key);
    if (ref) {
      this.#weakMap.delete(key);
      this.#set.delete(key);
      return true;
    }
    return false;
  }

  get(key: K): V | undefined {
    return this.#weakMap.get(key);
  }

  has(key: K): boolean {
    return this.#weakMap.has(key);
  }

  set(key: K, value: V): this {
    this.#weakMap.set(key, value);
    this.#set.add(key);
    return this;
  }

  get [Symbol.toStringTag](): string {
    return "IterableWeakMap";
  }

  forEach(
    callbackfn: (value: V, key: K, map: Map<K, V>) => void,
    thisArg?: unknown,
  ): void {
    for (const [key, value] of this[Symbol.iterator]()) {
      callbackfn.call(thisArg, value, key, this);
    }
  }

  *[Symbol.iterator](): IterableIterator<[K, V]> {
    for (const key of this.#set) {
      yield [key, this.#weakMap.get(key)!];
    }
  }

  entries(): IterableIterator<[K, V]> {
    return this[Symbol.iterator]();
  }

  keys(): IterableIterator<K> {
    return this.#set[Symbol.iterator]();
  }

  *values(): IterableIterator<V> {
    for (const key of this.#set) {
      yield this.#weakMap.get(key)!;
    }
  }
}
