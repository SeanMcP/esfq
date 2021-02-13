import { Select } from '../index'

type Item = {
    id: number;
    value: number;
}

const data: Item[] = [{ id: 1, value: 10 }, { id: 2, value: 5 }]

console.log(Select<Item>(data).where(({ value }) => value > 5).rows)
console.log(Select<Item>(data).orderBy(({ value }) => value).rows)