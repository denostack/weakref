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
    const ref = this.#map.get(key);
    if (!ref) return undefined;
    const value = ref.deref();
    if (value === undefined) {
      this.#map.delete(key);
      this.#registry.unregister(ref);
      return undefined;
    }
    return value;
  }

  has(key: K): boolean {
    if (!this.#map.has(key)) {
      return false;
    }
    const ref = this.#map.get(key)!;
    if (ref.deref() === undefined) {
      this.#map.delete(key);
      this.#registry.unregister(ref);
      return false;
    }
    return true;
  }

  set(key: K, value: V): this {
    if (this.#map.has(key)) {
      this.delete(key);
    }
    const ref = new WeakRef(value);
    this.#map.set(key, ref);
    this.#registry.register(value, key, ref);
    return this;
  }

  get [Symbol.toStringTag](): string {
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

  *[Symbol.iterator](): MapIterator<[K, V]> {
    for (const [key, ref] of this.#map) {
      const value = ref.deref();
      if (value === undefined) {
        this.#map.delete(key);
        this.#registry.unregister(ref);
      } else {
        yield [key, value];
      }
    }
  }

  entries(): MapIterator<[K, V]> {
    return this[Symbol.iterator]();
  }

  *keys(): MapIterator<K> {
    for (const [key] of this) {
      yield key;
    }
  }

  *values(): MapIterator<V> {
    for (const [, value] of this) {
      yield value;
    }
  }
}
