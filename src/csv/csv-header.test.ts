import { describe, expect, it } from "vitest";
import { makeCsvHeader } from "./csv-header.ts";

describe("makeCsvHeader", () => {
  const columnNames = ["Year", "Month", "Day"] as const;

  describe("one of the required columns is missing from the header row", () => {
    const headerRow = "Year,Month";

    const result = makeCsvHeader(headerRow, columnNames);

    it("returns an error message", () => {
      if (result.success) {
        throw new Error("Expected result to be an error");
      }
      expect(result.error).toEqual(
        "Required column not found in CSV header: Day",
      );
    });
  });

  describe("a CsvHeader is successfully made", () => {
    const headerRow = "Day,Year,Month";
    const result = makeCsvHeader(headerRow, columnNames);
    if (!result.success) {
      throw new Error("Expected creating a CsvHeader to be successful");
    }
    const { csvHeader } = result;

    describe("indexForColumn", () => {
      it("calculates the index for a column", () => {
        expect(csvHeader.indexForColumn("Year")).toEqual(1);
        expect(csvHeader.indexForColumn("Month")).toEqual(2);
        expect(csvHeader.indexForColumn("Day")).toEqual(0);
      });
    });
  });
});
