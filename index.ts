export function select<ItemType>(data: ItemType[]) {
  return <Select<ItemType>>{
    result: data,
    orderBy(mapOrKey, direction = "ASC") {
      this.result.sort((a: ItemType, b: ItemType) => {
        let A: unknown, B: unknown;
        if (typeof mapOrKey === "function") {
          A = mapOrKey(a);
          B = mapOrKey(b);
        } else {
          A = a[mapOrKey];
          B = b[mapOrKey];
        }

        if (direction === "ASC") {
          return A < B ? -1 : 1;
        } else if (direction === "DESC") {
          return A > B ? -1 : 1;
        }
      });
      return this;
    },
    where(filterFn) {
      this.result = this.result.filter(filterFn);
      return this;
    },
  };
}

// Types

type Direction = "ASC" | "DESC";
type Select<ItemType> = {
  readonly result: ItemType[];
  readonly orderBy: (
    mapOrKey: keyof ItemType | ((item: ItemType) => any),
    direction?: Direction
  ) => Select<ItemType>;
  readonly where: (filterFn: (item: ItemType) => boolean) => Select<ItemType>;
};
