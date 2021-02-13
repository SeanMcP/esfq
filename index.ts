export function Select<ItemType>(data: ItemType[]) {
  return <API<ItemType>>{
    rows: data,
    orderBy(
      mapOrKey: keyof ItemType | ((arg0: ItemType) => any),
      direction: Direction = "ASC"
    ) {
      this.rows.sort((a: ItemType, b: ItemType) => {
        if (direction === "ASC") {
          return typeof mapOrKey === "function"
            ? mapOrKey(a) - mapOrKey(b)
            : (a[mapOrKey] as any) - (b[mapOrKey] as any);
        } else if (direction === "DESC") {
          return typeof mapOrKey === "function"
            ? mapOrKey(b) - mapOrKey(a)
            : (b[mapOrKey] as any) - (a[mapOrKey] as any);
        }
      });
      return this;
    },
    where(fn: (item: ItemType) => boolean) {
      this.rows = this.rows.filter(fn);
      return this;
    },
  };
}

// Types

type Direction = "ASC" | "DESC";
type API<ItemType> = {
  rows: ItemType[];
  orderBy: (
    mapOrKey: keyof ItemType | ((item: ItemType) => any),
    direction?: Direction
  ) => API<ItemType>;
  where: (filterFn: (item: ItemType) => boolean) => API<ItemType>;
};
