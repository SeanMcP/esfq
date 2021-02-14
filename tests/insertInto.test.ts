import { test } from "uvu";
import * as assert from "uvu/assert";
import { insertInto } from "../index";

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

const newItem: Item = {
  date: new Date().toISOString(),
  id: 3,
  name: "cashews",
  value: 8,
};

test("inserts data", () => {
  const { result } = insertInto<Item>(data).values(newItem);
  assert.equal(
    result.map((item) => item.name),
    ["peanuts", "almonds", "cashews"]
  );
});

test("does not mutate data", () => {
  const { result } = insertInto<Item>(data).values(newItem);
  assert.is(result.length, 3);
  assert.is(data.length, 2);
});

test.run();
