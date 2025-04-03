import { CsvHeader } from "./csv-header.ts";

export type CsvRow<T extends string> = {
  [key in T]: string | undefined;
};

export function makeCsvRow<T extends string>(
  rowString: string,
  csvHeader: CsvHeader<T>,
): CsvRow<T> {
  const rowColumns = rowString.split(",");

  const data: Map<T, string | undefined> = new Map();
  for (const headerColumn of csvHeader.allColumns) {
    data.set(headerColumn, rowColumns[csvHeader.indexForColumn(headerColumn)]);
  }

  return Object.fromEntries(data) as CsvRow<T>;
}
