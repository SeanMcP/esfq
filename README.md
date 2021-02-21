# ESFQ

🔍 Functional queries for ECMAScript

## Functions

### deleteFrom

Removes an item from the dataset where condition matches.

```ts
const { result } = deleteFrom<Item>(data).where((item) => item.id === 2);
```

**Note**: Unlike SQL, there is no default behavior for `deleteFrom`. If you want to remove all items from the dataset, pass `Boolean` or `() => true` to `where()`.

#### Methods

- `where`

### insertInto

Adds an item to the dataset.

```ts
const { result } = insertInto<Item>(data).set({ id: 3, name: "cashews" });
```

#### Methods

- `set`

### selectFrom

Returns items that match the provided conditions

```ts
const { result } = selectFrom<Item>(data)
  .where(({ value }) => value > 4)
  .orderBy("id", "ASC")
  .columns(["name", "value"]);
```

**Notes**: Unlike SQL, the order of the statements matters.

#### Methods

- `columns`
- `orderBy`
- `where`

## Schema

To reduce the boilerplate for creating functional queries, you can use the `Schema` function:

```ts
const fq = Schema<ItemType>();

fq.deleteFrom(data).where(/* ... */);
fq.insertInto(data).values(/* ... */);
fq.selectFrom(data).columns(/* ... */);
fq.update(data).where(/* ... */);
```

The functions returned all received the initial item type.

If you are working with an external data source like `localStorage`, you can go one step further and pass a resolver to `Schema`:

```ts
const fq = Schema<ItemType>(() =>
  JSON.stringify(localStorage.getItem("example") as ItemType[])
);

fq.deleteFrom().where(/* ... */);
fq.insertInto().values(/* ... */);
fq.selectFrom().columns(/* ... */);
fq.update().where(/* ... */);
```
