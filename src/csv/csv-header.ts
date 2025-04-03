type MakeCsvHeaderResult<T extends readonly string[]> =
  | { success: true; csvHeader: CsvHeader<T[number]> }
  | { success: false; error: string };

export type CsvHeader<T extends string> = {
  indexForColumn: (columnName: T) => number;
  allColumns: readonly T[];
};

export function makeCsvHeader<T extends readonly string[]>(
  headerRow: string,
  columnNames: T,
): MakeCsvHeaderResult<T> {
  const columns = headerRow.split(",");

  for (const columnName of columnNames) {
    if (!columns.includes(columnName)) {
      return {
        success: false,
        error: `Required column not found in CSV header: ${columnName}`,
      };
    }
  }

  const csvHeader: CsvHeader<T[number]> = {
    indexForColumn: (columnName) => columns.indexOf(columnName),
    allColumns: columnNames,
  };
  return { success: true, csvHeader };
}
