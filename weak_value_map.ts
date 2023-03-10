// deno-lint-ignore-file ban-types

export class WeakValueMap<K, V extends object> implements Map<K, V> {
  #map = new Map<K, WeakRef<V>>();
  #registry = new FinalizationRegistry<K>(this.#map.delete.bind(this.#map));

  constructor(entries?: readonly (readonly [K, V])[] | null);
  constructor(iterable: Iterable<readonly [K, V]>);
  constructor(iterable?: Iterable<readonly [K, V]> | null) {
    for (const [key, value] of iterable ?? []) {
      this.set(key, value);
    }
  }

  get size(): number {
    return this.#map.size;
  }

  clear(): void {
    for (const key of this.#map.keys()) {
      this.delete(key);
    }
  }

  delete(key: K): boolean {
    const ref = this.#map.get(key);
    if (ref) {
      this.#map.delete(key);
      this.#registry.unregister(ref);
      return true;
    }
    return false;
  }

  get(key: K): V | undefined {
    return this.#map.get(key)?.deref();
  }

  has(key: K): boolean {
    return this.#map.has(key);
  }

  set(key: K, value: V): this {
    const ref = new WeakRef(value);
    this.#map.set(key, ref);
    this.#registry.register(value, key, ref);
    return this;
  }

  get [Symbol.toStringTag]() {
    return "WeakValueMap";
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
    for (const [key, ref] of this.#map) {
      yield [key, ref.deref()!];
    }
  }

  entries(): IterableIterator<[K, V]> {
    return this[Symbol.iterator]();
  }

  keys(): IterableIterator<K> {
    return this.#map.keys();
  }

  *values(): IterableIterator<V> {
    for (const ref of this.#map.values()) {
      yield ref.deref()!;
    }
  }
}
