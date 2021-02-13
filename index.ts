export function select<ItemType>(data: ItemType[]) {
  return <Select<ItemType>>{
    result: data,
    // TODO: Add this typing
    // orderBy(this: Select<ItemType>, mapOrKey, direction = "ASC") {
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
    // where(this: Select<ItemType>, filterFn) {
    where(filterFn) {
      this.result = this.result.filter(filterFn);
      return this;
    },
  };
}

export function update<ItemType>(data: ItemType[]) {
  return <Update<ItemType>>{
    result: data,
    set(mapFn) {
      if (this.temp) {
        // where() has been called, update result
        // this.temp is a filterFn
        this.result = this.result.map((item) => {
          if (this.temp(item)) {
            return mapFn(item);
          } else {
            return item;
          }
        });
        // Question: Should this.temp be cleared?
      } else {
        this.temp = this.result.map(mapFn);
      }
      return this;
    },
    where(filterFn) {
      if (this.temp) {
        // set() has been called, update result
        // this.temp is a full list of updated items
        this.result = this.result.map((item, index) => {
          if (filterFn(item)) {
            // This item should be updated
            return this.temp[index];
          }
          return item;
        });
        // Question: Should this.temp be cleared?
      } else {
        this.temp = filterFn;
      }
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
type Update<ItemType> = {
  readonly result: ItemType[];
  readonly set: (mapFn: (item: ItemType) => ItemType) => Update<ItemType>;
  readonly where: (filterFn: (item: ItemType) => boolean) => Update<ItemType>;
};
