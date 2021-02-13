export function Select<ItemType>(data: ItemType[]) {
  return {
    rows: data,
    orderBy(fn: (arg0: ItemType) => any, direction: Direction = "ASC") {
      this.rows.sort((a: ItemType, b: ItemType) => {
        if (direction === "ASC") {
          return fn(a) - fn(b);
        } else if (direction === "DESC") {
          return fn(b) - fn(a);
        }
      });
      return this;
    },
    where(fn: (arg0: ItemType) => boolean) {
      this.rows = this.rows.filter(fn);
      return this;
    },
  };
}

// Types

type Direction = 'ASC' | 'ASCENDING' | 'DESC' | 'DESCENDING'