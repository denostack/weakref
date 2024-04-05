import { assert, assertEquals, assertFalse } from "@std/assert";
import { IterableWeakMap } from "./iterable_weak_map.ts";

function* iterate<T>(items: T[]): IterableIterator<T> {
  for (const item of items) {
    yield item;
  }
}

Deno.test("IterableWeakMap, constructor", () => {
  assertEquals(new IterableWeakMap().size, 0);
  assertEquals(new IterableWeakMap(undefined).size, 0);
  assertEquals(new IterableWeakMap(null).size, 0);

  assertEquals(new IterableWeakMap([]).size, 0);
  assertEquals(new IterableWeakMap(iterate([])).size, 0);

  assertEquals(new IterableWeakMap([[{}, 1]]).size, 1);
  assertEquals(new IterableWeakMap(iterate([[{}, 1] as const])).size, 1);
});

Deno.test("IterableWeakMap, comparison Map, WeakMap", () => {
  const map = new Map();
  const wmap = new WeakMap();
  const iwmap = new IterableWeakMap();

  assertEquals(map.size, 0);
  // assertEquals(wmap.size, 0);
  assertEquals(iwmap.size, 0);

  const obj1 = {};
  const obj2 = {};

  assertEquals(map.get(obj1), undefined);
  assertEquals(wmap.get(obj1), undefined);
  assertEquals(iwmap.get(obj1), undefined);

  assertEquals(map.set(obj1, "1"), map);
  assertEquals(wmap.set(obj1, "1"), wmap);
  assertEquals(iwmap.set(obj1, "1"), iwmap);

  assertEquals(map.get(obj1), "1");
  assertEquals(wmap.get(obj1), "1");
  assertEquals(iwmap.get(obj1), "1");

  assertEquals(map.size, 1);
  // assertEquals(wmap.size, 0);
  assertEquals(iwmap.size, 1);

  // add the same object again
  assertEquals(map.set(obj1, "2"), map);
  assertEquals(wmap.set(obj1, "2"), wmap);
  assertEquals(iwmap.set(obj1, "2"), iwmap);

  assertEquals(map.get(obj1), "2");
  assertEquals(wmap.get(obj1), "2");
  assertEquals(iwmap.get(obj1), "2");

  assertEquals(map.size, 1);
  // assertEquals(wmap.size, 0);
  assertEquals(iwmap.size, 1);

  assertEquals(map.set(obj2, true), map);
  assertEquals(wmap.set(obj2, true), wmap);
  assertEquals(iwmap.set(obj2, true), iwmap);

  assertEquals(map.size, 2);
  // assertEquals(wmap.size, 0);
  assertEquals(iwmap.size, 2);

  assert(map.has(obj1));
  assert(wmap.has(obj1));
  assert(iwmap.has(obj1));

  // delete the object
  assert(map.delete(obj1));
  assert(wmap.delete(obj1));
  assert(iwmap.delete(obj1));

  assertEquals(map.size, 1);
  // assertEquals(wmap.size, 0);
  assertEquals(iwmap.size, 1);

  assertFalse(map.delete(obj1));
  assertFalse(wmap.delete(obj1));
  assertFalse(iwmap.delete(obj1));

  assertEquals(map.size, 1);
  // assertEquals(wmap.size, 0);
  assertEquals(iwmap.size, 1);

  assertFalse(map.has(obj1));
  assertFalse(wmap.has(obj1));
  assertFalse(iwmap.has(obj1));

  assertEquals(map.get(obj1), undefined);
  assertEquals(wmap.get(obj1), undefined);
  assertEquals(iwmap.get(obj1), undefined);

  assertFalse(map.clear());
  // assertFalse(wmap.clear());
  assertFalse(iwmap.clear());

  assertEquals(map.size, 0);
  // assertEquals(wmap.size, 0);
  assertEquals(iwmap.size, 0);

  assertEquals(map.toString(), "[object Map]");
  assertEquals(wmap.toString(), "[object WeakMap]");
  assertEquals(iwmap.toString(), "[object IterableWeakMap]");
});

Deno.test("IterableWeakMap, iterable", () => {
  const tuples: [Record<string, unknown>, number][] = [[{}, 1], [{}, 2], [
    {},
    3,
  ]];

  const maps = [
    new Map(tuples),
    new IterableWeakMap(tuples),
  ];

  for (const map of maps) {
    assertEquals(map.size, 3);

    {
      let i = 0;
      map.forEach(function (this: unknown, k, v, s) {
        assert(this === undefined);
        assert(k === tuples[i][1]);
        assert(v === tuples[i][0]);
        assert(s === map);
        i++;
      });
      assertFalse(i === 0);
    }
    {
      let i = 0;
      map.forEach(function (this: unknown, k, v, s) {
        assert(this === ":D");
        assert(k === tuples[i][1]);
        assert(v === tuples[i][0]);
        assert(s === map);
        i++;
      }, ":D");
      assertFalse(i === 0);
    }
    {
      let i = 0;
      for (const [k, v] of map) {
        assert(k === tuples[i][0]);
        assert(v === tuples[i++][1]);
      }
      assertFalse(i === 0);
    }
    {
      let i = 0;
      for (const k of map.keys()) {
        assert(k === tuples[i++][0]);
      }
      assertFalse(i === 0);
    }
    {
      let i = 0;
      for (const v of map.values()) {
        assert(v === tuples[i++][1]);
      }
      assertFalse(i === 0);
    }
    {
      let i = 0;
      for (const [k, v] of map.entries()) {
        assert(k === tuples[i][0]);
        assert(v === tuples[i++][1]);
      }
      assertFalse(i === 0);
    }
  }
});

Deno.test("IterableWeakMap, garbage collect", async () => {
  let removedCount = 0;
  let insertedCount = 0;
  const register = new FinalizationRegistry(() => {
    removedCount++;
  });

  const map = new IterableWeakMap();
  for (let i = 0; removedCount < 100; i++) {
    await new Promise((resolve) => setTimeout(resolve, 16));
    const data = {};
    map.set(data, i);
    register.register(data, i);
    insertedCount++;
  }

  assertEquals(insertedCount - removedCount, map.size);
  assertEquals([...map].length, map.size);
});
