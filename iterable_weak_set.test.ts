import { assert, assertEquals, assertFalse } from "testing/asserts.ts";
import { IterableWeakSet } from "./iterable_weak_set.ts";

function* iterate<T>(items: T[]): IterableIterator<T> {
  for (const item of items) {
    yield item;
  }
}

Deno.test("IterableWeakSet, constructor", () => {
  assertEquals(new IterableWeakSet().size, 0);
  assertEquals(new IterableWeakSet(undefined).size, 0);
  assertEquals(new IterableWeakSet(null).size, 0);

  assertEquals(new IterableWeakSet([]).size, 0);
  assertEquals(new IterableWeakSet(iterate([])).size, 0);

  assertEquals(new IterableWeakSet([{}]).size, 1);
  assertEquals(new IterableWeakSet(iterate([{}])).size, 1);
});

Deno.test("IterableWeakSet, comparison Set, WeakSet", () => {
  const set = new Set();
  const wset = new WeakSet();
  const iwset = new IterableWeakSet();

  assertEquals(set.size, 0);
  // assertEquals(wset.size, 0);
  assertEquals(iwset.size, 0);

  const obj1 = {};
  const obj2 = {};

  assertEquals(set.add(obj1), set);
  assertEquals(wset.add(obj1), wset);
  assertEquals(iwset.add(obj1), iwset);

  assertEquals(set.size, 1);
  // assertEquals(wset.size, 0);
  assertEquals(iwset.size, 1);

  // add the same object again
  assertEquals(set.add(obj1), set);
  assertEquals(wset.add(obj1), wset);
  assertEquals(iwset.add(obj1), iwset);

  assertEquals(set.size, 1);
  // assertEquals(wset.size, 0);
  assertEquals(iwset.size, 1);

  assertEquals(set.add(obj2), set);
  assertEquals(wset.add(obj2), wset);
  assertEquals(iwset.add(obj2), iwset);

  assertEquals(set.size, 2);
  // assertEquals(wset.size, 0);
  assertEquals(iwset.size, 2);

  assert(set.has(obj1));
  assert(wset.has(obj1));
  assert(iwset.has(obj1));

  // delete the object
  assert(set.delete(obj1));
  assert(wset.delete(obj1));
  assert(iwset.delete(obj1));

  assertEquals(set.size, 1);
  // assertEquals(wset.size, 0);
  assertEquals(iwset.size, 1);

  assertFalse(set.delete(obj1));
  assertFalse(wset.delete(obj1));
  assertFalse(iwset.delete(obj1));

  assertEquals(set.size, 1);
  // assertEquals(wset.size, 0);
  assertEquals(iwset.size, 1);

  assertFalse(set.has(obj1));
  assertFalse(wset.has(obj1));
  assertFalse(iwset.has(obj1));

  assertFalse(set.clear());
  // assertFalse(wset.clear());
  assertFalse(iwset.clear());

  assertEquals(set.size, 0);
  // assertEquals(wset.size, 0);
  assertEquals(iwset.size, 0);

  assertEquals(set.toString(), "[object Set]");
  assertEquals(wset.toString(), "[object WeakSet]");
  assertEquals(iwset.toString(), "[object IterableWeakSet]");
});

Deno.test("IterableWeakSet, iterable", () => {
  const objs = [{}, {}, {}];

  const sets = [
    new Set(objs),
    new IterableWeakSet(objs),
  ];

  for (const set of sets) {
    assertEquals(set.size, 3);

    {
      let i = 0;
      set.forEach(function (this: unknown, v1, v2, s) {
        assert(this === undefined);
        assert(v1 === objs[i]);
        assert(v2 === objs[i]);
        assert(s === set);
        i++;
      });
      assertFalse(i === 0);
    }
    {
      let i = 0;
      set.forEach(function (this: unknown, v1, v2, s) {
        assert(this === ":D");
        assert(v1 === objs[i]);
        assert(v2 === objs[i]);
        assert(s === set);
        i++;
      }, ":D");
      assertFalse(i === 0);
    }
    {
      let i = 0;
      for (const obj of set) {
        assert(obj === objs[i++]);
      }
      assertFalse(i === 0);
    }
    {
      let i = 0;
      for (const obj of set.keys()) {
        assert(obj === objs[i++]);
      }
      assertFalse(i === 0);
    }
    {
      let i = 0;
      for (const obj of set.values()) {
        assert(obj === objs[i++]);
      }
      assertFalse(i === 0);
    }
    {
      let i = 0;
      for (const tuple of set.entries()) {
        assert(tuple[0] === objs[i]);
        assert(tuple[1] === objs[i++]);
      }
      assertFalse(i === 0);
    }
  }
});

Deno.test("IterableWeakSet, garbage collect", async () => {
  let removedCount = 0;
  let insertedCount = 0;
  const register = new FinalizationRegistry(() => {
    removedCount++;
  });

  const set = new IterableWeakSet();
  for (let i = 0; removedCount < 100; i++) {
    await new Promise((resolve) => setTimeout(resolve, 16));
    const data = {};
    set.add(data);
    register.register(data, i);
    insertedCount++;
  }

  assertEquals(insertedCount - removedCount, set.size);
  assertEquals([...set].length, set.size);
});
