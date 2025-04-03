import { describe, expect, it } from "vitest";
import { makeCsvHeader } from "./csv-header.js";
import { makeCsvRow } from "./csv-row.js";

describe("CsvRow", () => {
  const columns = ["A", "B", "C"] as const;
  const rowString = "1,2,3";
  it("returns the correct value for a column", () => {
    const csvHeaderResult = makeCsvHeader("A,B,C", columns);
    if (!csvHeaderResult.success) {
      throw new Error("Expected creating a CsvHeader to be successful");
    }
    const { csvHeader } = csvHeaderResult;

    const csvRow = makeCsvRow(rowString, csvHeader);

    expect(csvRow["A"]).toEqual("1");
    expect(csvRow["B"]).toEqual("2");
    expect(csvRow["C"]).toEqual("3");
  });
});
