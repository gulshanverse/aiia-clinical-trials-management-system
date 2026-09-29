import { describe, expect, it } from "vitest";
import type { User } from "../drizzle/schema";
import { answerResearchQuestion, getAuthorizedStudyIds, getRiskSnapshot } from "./researchData";

const user = (role: User["role"], openId = "staff-1") => ({ role, openId } as User);

describe("research context authorization", () => {
  it("limits ordinary users to their assigned development study scope", () => {
    expect(getAuthorizedStudyIds(user("user"))).toEqual(["AYU-2026-014"]);
    expect(getRiskSnapshot(user("user")).every(item => item.studyId === "AYU-2026-014")).toBe(true);
  });

  it("allows administrators to see the complete development portfolio", () => {
    expect(getAuthorizedStudyIds(user("admin"))).toEqual([
      "AYU-2026-014",
      "AYU-2026-018",
      "AYU-2026-009",
      "AYU-2026-005",
    ]);
  });
});

describe("research copilot and explainable risk", () => {
  it("answers a scoped safety question with sources and human review boundary", () => {
    const result = answerResearchQuestion(user("user"), "Which SAE cases require review?");
    expect(result.answer).toContain("SAE-2026-004");
    expect(result.sources.map(source => source.id)).toContain("SAE-2026-004");
    expect(result.humanReviewRequired).toBe(true);
    expect(result.developmentData).toBe(true);
  });

  it("does not cite a study outside the caller scope", () => {
    const result = answerResearchQuestion(user("user"), "Which approvals expire this month?");
    expect(result.authorizedStudyIds).toEqual(["AYU-2026-014"]);
    expect(result.sources.every(source => source.studyId === "AYU-2026-014")).toBe(true);
  });

  it("returns explainable factors and a follow-up action for high risk", () => {
    const [risk] = getRiskSnapshot(user("user"), "AYU-2026-014").filter(item => item.level === "High");
    expect(risk.domain).toBe("Safety");
    expect(risk.factors.length).toBeGreaterThan(0);
    expect(risk.recommendedAction).toContain("investigator");
    expect(risk.trend).toBe("Increasing");
  });
});
