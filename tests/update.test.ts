import { test } from "uvu";
import * as assert from "uvu/assert";
import { update } from "../index";

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

test('updates does not mutate data', () => {
  const { result } = update<Item>(data).set(item => ({ ...item, name: 'cashews' })).where(() => true)
  assert.not.equal(data, result)
})

test('updates data (set first)', () => {
  const { result } = update<Item>(data).set(item => ({ ...item, name: 'cashews' })).where(item => item.id === 2)
  assert.equal(result.map(item => item.name), ['peanuts', 'cashews'])
})

test('updates data (where first)', () => {
  const { result } = update<Item>(data).where(item => item.id === 2).set(item => ({ ...item, name: 'cashews' }))
  assert.equal(result.map(item => item.name), ['peanuts', 'cashews'])
})

test.run();
