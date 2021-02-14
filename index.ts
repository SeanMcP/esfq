// Can't use the name `delete`
export function deleteFrom<ItemType>(data: ItemType[]) {
  return <DeleteFrom<ItemType>>{
    result: data,
    where(this: DeleteFrom<ItemType>, filterFn) {
      this.result = this.result.filter((item) => !filterFn(item));
      return this;
    },
  };
}

export function select<ItemType>(data: ItemType[]) {
  return <Select<ItemType>>{
    result: data,
    orderBy(this: Select<ItemType>, mapOrKey, direction = "ASC") {
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
    where(this: Select<ItemType>, filterFn) {
      this.result = this.result.filter(filterFn);
      return this;
    },
  };
}

export function insertInto<ItemType>(data: ItemType[]) {
  return <InsertInto<ItemType>>{
    result: data,
    spuds: true,
    values(this: InsertInto<ItemType>, item: ItemType) {
      this.result = this.result.concat(item);
      return this;
    },
  };
}

export function update<ItemType>(data: ItemType[]) {
  return <Update<ItemType>>{
    result: data,
    set(this: Update<ItemType>, mapFn) {
      if (this.tempFilterFn) {
        // where() has been called, update result
        this.result = this.result.map((item) => {
          if (this.tempFilterFn(item)) {
            return mapFn(item);
          } else {
            return item;
          }
        });
        // Question: Should this.temp be cleared?
      } else {
        this.tempResult = this.result.map(mapFn);
      }
      return this;
    },
    where(this: Update<ItemType>, filterFn) {
      if (this.tempResult) {
        // set() has been called, update result
        this.result = this.result.map((item, index) => {
          if (filterFn(item)) {
            // This item should be updated
            return this.tempResult[index];
          }
          return item;
        });
        // Question: Should this.temp be cleared?
      } else {
        this.tempFilterFn = filterFn;
      }
      return this;
    },
  };
}

// ===== Types =====
// delete
type DeleteFrom<ItemType> = {
  result: ItemType[];
  readonly where: (filterFn: (item: ItemType) => boolean) => DeleteFrom<ItemType>;
};

// insertInto
type InsertInto<ItemType> = {
  result: ItemType[];
  readonly values: (item: ItemType) => InsertInto<ItemType>;
};

// select
type Direction = "ASC" | "DESC";
type Select<ItemType> = {
  result: ItemType[];
  readonly orderBy: (
    mapOrKey: keyof ItemType | ((item: ItemType) => any),
    direction?: Direction
  ) => Select<ItemType>;
  readonly where: (filterFn: (item: ItemType) => boolean) => Select<ItemType>;
};

// update
type Update<ItemType> = {
  result: ItemType[];
  tempResult: Update<ItemType>["result"];
  tempFilterFn: FilterFn<ItemType>;
  readonly set: Set<ItemType>;
  readonly where: UpdateWhere<ItemType>;
};
type Set<ItemType> = (mapFn: (item: ItemType) => ItemType) => Update<ItemType>;
// TODO: Find a way to have a shared Where type
type UpdateWhere<ItemType> = (filterFn: FilterFn<ItemType>) => Update<ItemType>;
type FilterFn<ItemType> = (item: ItemType) => boolean;
