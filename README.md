# ESFQ

🔍 Functional queries for ECMAScript

## Functions

### deleteFrom

Removes an item from the dataset where condition matches.

```ts
const { result } = deleteFrom<Item>(data).where(item => item.id === 2);
```

**Note**: Unlike SQL, there is no default behavior for `deleteFrom`. If you want to remove all items from the dataset, pass `Boolean` or `() => true` to `where()`.

#### Methods

- `where`

### insertInto

Adds an item to the dataset.

```ts
const { result } = insertInto<Item>(data).set({ id: 3, name: 'cashews' });
```

#### Methods

- `set`