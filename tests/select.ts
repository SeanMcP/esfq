import { test } from "uvu";
import * as assert from "uvu/assert";
import { select } from "../index";

type Item = {
  date: string;
  id: number;
  name: string;
  value: number;
};

const data: Item[] = [
  { date: "2021-02-13T18:35:23.675Z", id: 1, name: "peanuts", value: 5 },
  { date: "2021-01-13T18:35:23.675Z", id: 2, name: "almonds", value: 10 },
];

test("Returns result array", () => {
  const { result } = select<Item>(data);
  assert.is(Array.isArray(result), true);
});

test("where filters values", () => {
  const { result } = select<Item>(data).where(({ value }) => value > 5);
  assert.equal(
    result.map(({ name }) => name),
    ["almonds"]
  );
});

test("does not mutate data", () => {
  const { result } = select<Item>(data).where(({ value }) => value > 5);
  assert.is(result !== data, true);
});

test("ordersBy accepts string", () => {
  const { result } = select<Item>(data).orderBy("name");
  assert.equal(
    result.map(({ name }) => name),
    ["almonds", "peanuts"]
  );
});

test("orderBy accepts map function", () => {
  const { result } = select<Item>(data).orderBy(({ name }) => name);
  assert.equal(
    result.map(({ name }) => name),
    ["almonds", "peanuts"]
  );
});

test("When default, orderBY alphabetizes strings", () => {
  const { result } = select<Item>(data).orderBy("name");
  assert.equal(
    result.map(({ name }) => name),
    ["almonds", "peanuts"]
  );
});

test("When `ASC, orderBY alphabetizes strings", () => {
  const { result } = select<Item>(data).orderBy("name", "ASC");
  assert.equal(
    result.map(({ name }) => name),
    ["almonds", "peanuts"]
  );
});

test("When `DESC`, orderBY reverse-alphabetizes strings", () => {
  const { result } = select<Item>(data).orderBy("name", "DESC");
  assert.equal(
    result.map(({ name }) => name),
    ["peanuts", "almonds"]
  );
});

test.run();
