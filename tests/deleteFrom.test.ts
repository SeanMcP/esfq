import { test } from "uvu";
import * as assert from "uvu/assert";
import { deleteFrom } from "../index";

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

test("deletes data", () => {
  const { result } = deleteFrom<Item>(data).where(
    ({ name }) => name === "almonds"
  );
  assert.equal(
    result.map((item) => item.name),
    ["peanuts"]
  );
});

test("does not mutate data", () => {
  const { result } = deleteFrom<Item>(data).where(({ id }) => id === 2);
  assert.is(result.length, 1);
  assert.is(data.length, 2);
});

test.run();
