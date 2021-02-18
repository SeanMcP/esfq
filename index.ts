export function deleteFrom<ItemType>(data: ItemType[]) {
  return <DeleteFrom<ItemType>>{
    result: data,
    where(this: DeleteFrom<ItemType>, filterFn) {
      this.result = this.result.filter((item) => !filterFn(item));
      return this;
    },
  };
}

export function insertInto<ItemType>(data: ItemType[]) {
  return <InsertInto<ItemType>>{
    result: data,
    values(this: InsertInto<ItemType>, item: ItemType) {
      this.result = this.result.concat(item);
      return this;
    },
  };
}

export function selectFrom<ItemType>(data: ItemType[]) {
  // function limitResultToColumns<
  //   ResultType extends SelectFrom<ItemType>["result"],
  //   ColumnType extends keyof ItemType
  // >(result: ResultType, columns: ColumnType[]) {
  //   type ItemSelectColumns = {
  //     [K in ValuesOf<typeof columns>]: ItemType[K];
  //   };
  //   return result.map((item) => {
  //     const next = {} as any;
  //     columns.forEach((column) => {
  //       next[column] = item[column];
  //     });
  //     return next as ItemSelectColumns;
  //   }) as ItemSelectColumns[];
  // }
  let _columns: (keyof ItemType)[] = null;

  function limitResultToColumns(
    result: SelectFrom<ItemType>["result"],
    columns: typeof _columns
  ) {
    return result.map((item) => {
      const next = {} as ItemType;
      columns.forEach((column) => {
        next[column] = item[column];
      });
      return next;
    });
  }

  return <SelectFrom<ItemType>>{
    result: data,
    columns(this: SelectFrom<ItemType>, columns) {
      _columns = columns;
      this.result = limitResultToColumns(this.result, _columns);
      return this;
    },
    orderBy(this: SelectFrom<ItemType>, mapOrKey, direction = "ASC") {
      this.result = this.result.slice(0).sort((a: ItemType, b: ItemType) => {
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

      if (_columns) this.result = limitResultToColumns(this.result, _columns);

      return this;
    },
    where(this: SelectFrom<ItemType>, filterFn) {
      this.result = this.result.filter(filterFn);

      if (_columns) this.result = limitResultToColumns(this.result, _columns);

      return this;
    },
  };
}

export function update<ItemType>(data: ItemType[]) {
  let _filterFn: FilterFn<ItemType> = null;
  let _result: Update<ItemType>["result"] = null;
  return <Update<ItemType>>{
    result: data,
    set(this: Update<ItemType>, mapFn) {
      if (_filterFn) {
        // where() has been called, update result
        this.result = this.result.map((item) => {
          if (_filterFn(item)) {
            return mapFn(item);
          } else {
            return item;
          }
        });
        // Question: Should _filterFn  be cleared?
      } else {
        _result = this.result.map(mapFn);
      }
      return this;
    },
    where(this: Update<ItemType>, filterFn) {
      if (_result) {
        // set() has been called, update result
        this.result = this.result.map((item, index) => {
          if (filterFn(item)) {
            // This item should be updated
            return _result[index];
          }
          return item;
        });
        // Question: Should _result be cleared?
      } else {
        _filterFn = filterFn;
      }
      return this;
    },
  };
}

// ===== Types =====
// deleteFrom
type DeleteFrom<ItemType> = {
  result: ItemType[];
  readonly where: Where<ItemType, DeleteFrom<ItemType>>;
};

// insertInto
type InsertInto<ItemType> = {
  result: ItemType[];
  readonly values: (item: ItemType) => InsertInto<ItemType>;
};

// selectFrom
type Direction = "ASC" | "DESC";
type SelectFrom<ItemType> = {
  result: ItemType[];
  readonly columns: (columns: (keyof ItemType)[]) => SelectFrom<ItemType>;
  readonly orderBy: (
    mapOrKey: keyof ItemType | ((item: ItemType) => any),
    direction?: Direction
  ) => SelectFrom<ItemType>;
  readonly where: Where<ItemType, SelectFrom<ItemType>>;
};

// update
type Update<ItemType> = {
  result: ItemType[];
  readonly set: (mapFn: (item: ItemType) => ItemType) => Update<ItemType>;
  readonly where: Where<ItemType, Update<ItemType>>;
};

// shared
type FilterFn<ItemType> = (item: ItemType) => boolean;
type Where<ItemType, ReturnType> = (filterFn: FilterFn<ItemType>) => ReturnType;
