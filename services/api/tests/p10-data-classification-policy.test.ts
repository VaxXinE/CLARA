import { describe, expect, it } from "vitest";
import {
  classifiedDataItems,
  classifyDataItem,
} from "../src/enterprise/data-classification-policy";

describe("P10 data classification policy", () => {
  it("classifies customer, provider, audit, analytics, AI, and secret material", () => {
    expect(classifiedDataItems.map((item) => item.classification)).toContain(
      "public",
    );
    expect(classifyDataItem("customer message content")).toMatchObject({
      classification: "restricted",
    });
    expect(classifyDataItem("analytics aggregates")).toMatchObject({
      classification: "internal",
      handling: "aggregate-first",
    });
    expect(
      classifyDataItem("tokens, secrets, API keys, cookies, auth headers"),
    ).toMatchObject({
      classification: "secret",
    });
    expect(classifyDataItem("unknown")).toBeNull();
  });
});
