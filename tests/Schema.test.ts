import { test } from "uvu";
import * as assert from "uvu/assert";
import { Schema } from "../index";

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

test("exposes the correct methods", () => {
  const outputWithout = Schema<Item>();
  const outputWith = Schema<Item>(() => data.slice(0));

  assert.is(outputWithout.hasOwnProperty("deleteFrom"), true);
  assert.is(outputWithout.hasOwnProperty("insertInto"), true);
  assert.is(outputWithout.hasOwnProperty("selectFrom"), true);
  assert.is(outputWithout.hasOwnProperty("update"), true);

  assert.is(outputWith.hasOwnProperty("deleteFrom"), true);
  assert.is(outputWith.hasOwnProperty("insertInto"), true);
  assert.is(outputWith.hasOwnProperty("selectFrom"), true);
  assert.is(outputWith.hasOwnProperty("update"), true);
});

test("works with resolver", () => {
  // TODO: Mock localStorage
  let next = data.slice(0);
  const output = Schema<Item>(() => next);

  assert.equal(
    output
      .selectFrom()
      .where((item) => item.id === 1)
      .columns(["name"]).result,
    [{ name: "peanuts" }]
  );

  next = output.insertInto().values({
    id: 3,
    date: new Date().toISOString(),
    name: "cashews",
    value: 7,
  }).result;

  assert.equal(
    next.map((item) => item.name),
    ["peanuts", "almonds", "cashews"]
  );

  next = output
    .update()
    .where((item) => item.id === 3)
    .set((item) => ({ ...item, name: "hazelnuts" })).result;

  assert.equal(
    next.map((item) => item.name),
    ["peanuts", "almonds", "hazelnuts"]
  );

  assert.equal(
    output
      .deleteFrom()
      .where((item) => item.id === 3)
      .result.map((item) => item.name),
    ["peanuts", "almonds"]
  );
});

test("works without resolver", () => {
  let testData = data.slice(0);
  const output = Schema<Item>();

  assert.equal(
    output
      .selectFrom(testData)
      .where((item) => item.id === 1)
      .columns(["name"]).result,
    [{ name: "peanuts" }]
  );

  testData = output.insertInto(testData).values({
    id: 3,
    date: new Date().toISOString(),
    name: "cashews",
    value: 7,
  }).result;

  assert.equal(
    testData.map((item) => item.name),
    ["peanuts", "almonds", "cashews"]
  );

  testData = output
    .update(testData)
    .where((item) => item.id === 3)
    .set((item) => ({ ...item, name: "hazelnuts" })).result;

  assert.equal(
    testData.map((item) => item.name),
    ["peanuts", "almonds", "hazelnuts"]
  );

  assert.equal(
    output
      .deleteFrom(testData)
      .where((item) => item.id === 3)
      .result.map((item) => item.name),
    ["peanuts", "almonds"]
  );
});

test.run();
