import type { User } from "../drizzle/schema";

export type RiskLevel = "Low" | "Moderate" | "High";
export type RiskDomain = "Study" | "Recruitment" | "Data quality" | "Compliance" | "Safety" | "Site performance";

export type ResearchSource = {
  id: string;
  entity: "Study" | "Participant" | "Visit" | "Clinical record" | "Safety case" | "Compliance item" | "Site";
  label: string;
  studyId: string;
};

export type RiskAssessment = {
  id: string;
  studyId: string;
  studyTitle: string;
  domain: RiskDomain;
  level: RiskLevel;
  score: number;
  status: "Open" | "Monitoring" | "Stable";
  summary: string;
  factors: string[];
  recommendedAction: string;
  trend: "Increasing" | "Stable" | "Improving";
  updatedAt: string;
  sources: ResearchSource[];
};

const studies = [
  { id: "AYU-2026-014", title: "Efficacy of Ayurvedic Formulation in Type 2 Diabetes", enrolled: 64, target: 120, siteIds: ["SITE-01", "SITE-04"], assignedTo: ["admin", "user", "researcher"] },
  { id: "AYU-2026-018", title: "Ayurvedic Interventions for Osteoarthritis", enrolled: 48, target: 60, siteIds: ["SITE-07"], assignedTo: ["admin", "user"] },
  { id: "AYU-2026-009", title: "Prakriti-based Personalized Ayurveda Therapy", enrolled: 0, target: 100, siteIds: ["SITE-09"], assignedTo: ["admin"] },
  { id: "AYU-2026-005", title: "Safety Study of Classical Ayurvedic Formulation", enrolled: 16, target: 80, siteIds: ["SITE-09"], assignedTo: ["admin"] },
] as const;

const sources: ResearchSource[] = [
  { id: "AYU-2026-014", entity: "Study", label: "Type 2 Diabetes formulation study", studyId: "AYU-2026-014" },
  { id: "AYU-00482", entity: "Participant", label: "Participant AYU-00482", studyId: "AYU-2026-014" },
  { id: "AYU-00471", entity: "Participant", label: "Participant AYU-00471", studyId: "AYU-2026-014" },
  { id: "VIS-00471-W8", entity: "Visit", label: "AYU-00471 · Week 8 visit", studyId: "AYU-2026-014" },
  { id: "SITE-04", entity: "Site", label: "Jaipur Satellite", studyId: "AYU-2026-014" },
  { id: "SAE-2026-004", entity: "Safety case", label: "SAE-2026-004 · elevated blood pressure", studyId: "AYU-2026-014" },
  { id: "DQ-003", entity: "Clinical record", label: "Site 04 open data queries", studyId: "AYU-2026-014" },
  { id: "EC-009-01", entity: "Compliance item", label: "AYU-2026-009 ethics approval renewal", studyId: "AYU-2026-009" },
];

const riskSeed: RiskAssessment[] = [
  { id: "RISK-014-SAFETY", studyId: "AYU-2026-014", studyTitle: studies[0].title, domain: "Safety", level: "High", score: 82, status: "Open", summary: "One serious adverse event is awaiting investigator causality review.", factors: ["SAE-2026-004 is unreviewed", "Regulatory reporting clock is active"], recommendedAction: "Assign the investigator assessment and document causality before the reporting deadline.", trend: "Increasing", updatedAt: "28 Apr 2026", sources: [sources[5]] },
  { id: "RISK-014-RECRUITMENT", studyId: "AYU-2026-014", studyTitle: studies[0].title, domain: "Recruitment", level: "Moderate", score: 53, status: "Monitoring", summary: "Portfolio recruitment is at 53% of target with one site below plan.", factors: ["64 of 120 participants enrolled", "SITE-04 is at 21 of 40 participants"], recommendedAction: "Review the site recovery plan and confirm the next recruitment checkpoint.", trend: "Stable", updatedAt: "28 Apr 2026", sources: [sources[0], sources[4]] },
  { id: "RISK-014-DATA", studyId: "AYU-2026-014", studyTitle: studies[0].title, domain: "Data quality", level: "Moderate", score: 44, status: "Monitoring", summary: "Data completeness is strong but open queries remain at Site 04.", factors: ["94% completeness", "3 unresolved site queries"], recommendedAction: "Assign the open queries to the data manager before interim analysis.", trend: "Improving", updatedAt: "28 Apr 2026", sources: [sources[6]] },
  { id: "RISK-014-COMPLIANCE", studyId: "AYU-2026-014", studyTitle: studies[0].title, domain: "Compliance", level: "Low", score: 18, status: "Stable", summary: "Study compliance is current with the next expiry outside the immediate action window.", factors: ["Protocol v1.1 is active", "98% compliance indicator"], recommendedAction: "Continue routine monitoring and retain the version history in the audit trail.", trend: "Stable", updatedAt: "28 Apr 2026", sources: [sources[0]] },
  { id: "RISK-018-STUDY", studyId: "AYU-2026-018", studyTitle: studies[1].title, domain: "Study", level: "Moderate", score: 47, status: "Monitoring", summary: "The study is in follow-up with a narrow remaining recruitment window.", factors: ["48 of 60 participants enrolled", "Data lock milestone is approaching"], recommendedAction: "Review visit completion and data-lock readiness at the next study meeting.", trend: "Stable", updatedAt: "28 Apr 2026", sources: [sources[0]] },
];

function scopeForUser(user: User) {
  if (user.role === "admin") return studies.map(study => study.id);
  if (user.openId === "researcher") return ["AYU-2026-014", "AYU-2026-018"];
  return ["AYU-2026-014"];
}

export function getAuthorizedStudyIds(user: User) {
  return scopeForUser(user);
}

export function getRiskSnapshot(user: User, studyId?: string) {
  const allowed = new Set(scopeForUser(user));
  return riskSeed.filter(item => allowed.has(item.studyId) && (!studyId || item.studyId === studyId));
}

export function getResearchContext(user: User) {
  const allowed = new Set(scopeForUser(user));
  return {
    developmentData: true,
    userRole: user.role,
    authorizedStudyIds: [...allowed],
    studies: studies.filter(study => allowed.has(study.id)),
    risks: getRiskSnapshot(user),
    limitations: ["This workspace uses clearly labelled development data.", "CTRI, hospital/FHIR, voice transcription, external document storage and live LLM integrations are not connected."],
  };
}

function scopedSources(user: User, studyId?: string) {
  const allowed = new Set(scopeForUser(user));
  return sources.filter(source => allowed.has(source.studyId) && (!studyId || source.studyId === studyId));
}

export function answerResearchQuestion(user: User, question: string, studyId?: string) {
  const normalized = question.trim().toLowerCase();
  const allowed = new Set(scopeForUser(user));
  const requestedStudy = studyId && allowed.has(studyId) ? studyId : undefined;
  const sourcesInScope = scopedSources(user, requestedStudy);
  const find = (ids: string[]) => sourcesInScope.filter(source => ids.includes(source.id));
  let answer = "I can answer from the authorized development records in your current study scope. Try a question about visits, recruitment, data quality, safety, approvals or study risk.";
  let answerSources = sourcesInScope.filter(source => source.entity === "Study").slice(0, 1);

  if (/(overdue|missed|upcoming visit)/.test(normalized)) {
    answer = "AYU-00471 has a Week 8 visit due on 29 Apr 2026 and is flagged as overdue in the development registry. AYU-00482 has a Week 4 visit scheduled for 30 Apr 2026.";
    answerSources = find(["AYU-00471", "VIS-00471-W8", "AYU-00482"]);
  } else if (/(low recruitment|recruitment|site performance)/.test(normalized)) {
    answer = "Jaipur Satellite (SITE-04) is the clearest recruitment follow-up: 21 of 40 participants are enrolled for AYU-2026-014. The study portfolio is at 64 of 120 participants.";
    answerSources = find(["SITE-04", "AYU-2026-014"]);
  } else if (/(approval|expire|ethics|ctri|compliance)/.test(normalized)) {
    answer = "The development compliance queue shows the AYU-2026-009 ethics approval expiring in 10 days. CTRI is not connected; the CTRI status item is an internal development reminder only.";
    answerSources = find(["EC-009-01"]);
  } else if (/(sae|adverse|safety)/.test(normalized)) {
    answer = "SAE-2026-004 requires investigator review for elevated blood pressure. Causality and reporting assessment are still pending; no live pharmacovigilance submission has been made.";
    answerSources = find(["SAE-2026-004", "AYU-2026-014"]);
  } else if (/(risk|issue|quality|query)/.test(normalized)) {
    const risk = getRiskSnapshot(user, requestedStudy).find(item => item.level === "High") ?? getRiskSnapshot(user, requestedStudy).find(item => item.level === "Moderate");
    if (risk) {
      answer = `${risk.studyId} has a ${risk.level.toLowerCase()} ${risk.domain.toLowerCase()} signal: ${risk.summary} Recommended follow-up: ${risk.recommendedAction}`;
      answerSources = risk.sources;
    }
  }

  return {
    answer,
    sources: answerSources,
    limitations: ["Answer is generated from authorized structured development data only.", "Human review required before clinical, safety or regulatory action.", "No live CTRI, hospital/FHIR or external LLM source was used."],
    humanReviewRequired: true,
    developmentData: true,
    authorizedStudyIds: [...allowed],
  };
}
