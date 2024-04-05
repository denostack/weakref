import { assert, assertEquals, assertFalse } from "@std/assert";
import { WeakValueMap } from "./weak_value_map.ts";

function* iterate<T>(items: T[]): IterableIterator<T> {
  for (const item of items) {
    yield item;
  }
}

Deno.test("WeakValueMap, constructor", () => {
  assertEquals(new WeakValueMap().size, 0);
  assertEquals(new WeakValueMap(undefined).size, 0);
  assertEquals(new WeakValueMap(null).size, 0);

  assertEquals(new WeakValueMap([]).size, 0);
  assertEquals(new WeakValueMap(iterate([])).size, 0);

  assertEquals(new WeakValueMap([[1, {}]]).size, 1);
  assertEquals(new WeakValueMap(iterate([[1, {}] as const])).size, 1);
});

Deno.test("WeakValueMap, comparison Map, WeakMap", () => {
  const map = new Map();
  const iwmap = new WeakValueMap();

  assertEquals(map.size, 0);
  assertEquals(iwmap.size, 0);

  const obj1 = {};
  const obj2 = {};

  assertEquals(map.get("1"), undefined);
  assertEquals(iwmap.get("1"), undefined);

  assertEquals(map.set("1", obj1), map);
  assertEquals(iwmap.set("1", obj1), iwmap);

  assertEquals(map.get("1"), obj1);
  assertEquals(iwmap.get("1"), obj1);

  assertEquals(map.size, 1);
  assertEquals(iwmap.size, 1);

  // add the same object again
  assertEquals(map.set("1", obj2), map);
  assertEquals(iwmap.set("1", obj2), iwmap);

  assertEquals(map.get("1"), obj2);
  assertEquals(iwmap.get("1"), obj2);

  assertEquals(map.size, 1);
  assertEquals(iwmap.size, 1);

  assertEquals(map.set(2, obj1), map);
  assertEquals(iwmap.set(2, obj1), iwmap);

  assertEquals(map.size, 2);
  assertEquals(iwmap.size, 2);

  assert(map.has(2));
  assert(iwmap.has(2));

  // delete the object
  assert(map.delete("1"));
  assert(iwmap.delete("1"));

  assertEquals(map.size, 1);
  assertEquals(iwmap.size, 1);

  assertFalse(map.delete("1"));
  assertFalse(iwmap.delete("1"));

  assertEquals(map.size, 1);
  assertEquals(iwmap.size, 1);

  assertFalse(map.has("1"));
  assertFalse(iwmap.has("1"));

  assertEquals(map.get("1"), undefined);
  assertEquals(iwmap.get("1"), undefined);

  assertFalse(map.clear());
  assertFalse(iwmap.clear());

  assertEquals(map.size, 0);
  assertEquals(iwmap.size, 0);

  assertEquals(map.toString(), "[object Map]");
  assertEquals(iwmap.toString(), "[object WeakValueMap]");
});

Deno.test("WeakValueMap, iterable", () => {
  const tuples: [number | string | boolean, Record<string, unknown>][] = [
    [1, {}],
    ["2", {}],
    [
      false,
      {},
    ],
  ];

  const maps = [
    new Map(tuples),
    new WeakValueMap(tuples),
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

Deno.test("WeakValueMap, garbage collect", async () => {
  let removedCount = 0;
  let insertedCount = 0;
  const register = new FinalizationRegistry(() => {
    removedCount++;
  });

  const map = new WeakValueMap();
  for (let i = 0; removedCount < 100; i++) {
    await new Promise((resolve) => setTimeout(resolve, 16));
    const data = {};
    map.set(i, data);
    register.register(data, i);
    insertedCount++;
  }

  assertEquals(insertedCount - removedCount, map.size);
  assertEquals([...map].length, map.size);
});
