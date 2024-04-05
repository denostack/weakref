export class IterableWeakSet<T extends object> implements WeakSet<T>, Set<T> {
  #weakMap = new WeakMap<T, WeakRef<T>>();
  #set = new Set<WeakRef<T>>();
  #registry = new FinalizationRegistry<WeakRef<T>>(
    this.#set.delete.bind(this.#set),
  );

  constructor(values?: readonly T[] | null);
  constructor(iterable: Iterable<T>);
  constructor(iterable: Iterable<T> | null = null) {
    for (const value of iterable ?? []) {
      this.add(value);
    }
  }

  get size(): number {
    return this.#set.size;
  }

  add(value: T): this {
    if (this.has(value)) {
      return this;
    }
    const ref = new WeakRef(value);
    this.#weakMap.set(value, ref);
    this.#set.add(ref);
    this.#registry.register(value, ref, ref);
    return this;
  }

  clear(): void {
    for (const value of this.#set) {
      this.delete(value.deref()!);
    }
  }

  delete(value: T): boolean {
    const ref = this.#weakMap.get(value);
    if (ref) {
      this.#set.delete(ref);
      this.#weakMap.delete(value);
      this.#registry.unregister(ref);
      return true;
    }
    return false;
  }

  has(value: T): boolean {
    return this.#weakMap.has(value);
  }

  forEach(
    callbackfn: (value: T, value2: T, set: Set<T>) => void,
    thisArg?: unknown,
  ): void {
    for (const tuple of this.entries()) {
      callbackfn.call(thisArg, tuple[0], tuple[1], this);
    }
  }

  get [Symbol.toStringTag](): string {
    return "IterableWeakSet";
  }

  *[Symbol.iterator](): IterableIterator<T> {
    for (const ref of this.#set) {
      yield ref.deref()!;
    }
  }

  *entries(): IterableIterator<[T, T]> {
    for (const ref of this.#set) {
      const value = ref.deref()!;
      yield [value, value];
    }
  }

  keys(): IterableIterator<T> {
    return this[Symbol.iterator]();
  }

  values(): IterableIterator<T> {
    return this[Symbol.iterator]();
  }
}
