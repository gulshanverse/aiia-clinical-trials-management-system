import { desc, eq } from "drizzle-orm";
import type { AccessRequest, InsertAccessRequest } from "../drizzle/schema";
import { accessRequests, auditEvents } from "../drizzle/schema";
import { getDb } from "./db";

const developmentRequests: AccessRequest[] = [];
const developmentAudit: Array<{ action: string; entityId: string; details: string; createdAt: Date }> = [];
let nextDevelopmentId = 1;

export async function createAccessRequest(input: Omit<InsertAccessRequest, "id" | "status" | "submittedAt">) {
  const db = await getDb();
  if (db) {
    const result = await db.insert(accessRequests).values({ ...input, status: "Pending" });
    const id = Number(result[0].insertId);
    await db.insert(auditEvents).values({ action: "ACCESS_REQUEST_SUBMITTED", entityType: "access_request", entityId: String(id), details: `Applicant ${input.fullName} requested ${input.requestedRole}` });
    return { id, status: "Pending" as const };
  }
  const request = { ...input, id: nextDevelopmentId++, status: "Pending" as const, submittedAt: new Date(), reviewedAt: null, assignedStudy: null, assignedSite: null } as AccessRequest;
  developmentRequests.unshift(request);
  developmentAudit.unshift({ action: "ACCESS_REQUEST_SUBMITTED", entityId: String(request.id), details: `Applicant ${input.fullName} requested ${input.requestedRole}`, createdAt: new Date() });
  return { id: request.id, status: request.status };
}

export async function listAccessRequests() {
  const db = await getDb();
  if (db) return db.select().from(accessRequests).orderBy(desc(accessRequests.submittedAt));
  return developmentRequests;
}

export async function updateAccessRequest(id: number, status: AccessRequest["status"], actorUserId: number, assignedStudy?: string, assignedSite?: string) {
  const db = await getDb();
  if (db) {
    await db.update(accessRequests).set({ status, assignedStudy: assignedStudy ?? null, assignedSite: assignedSite ?? null, reviewedAt: new Date() }).where(eq(accessRequests.id, id));
    await db.insert(auditEvents).values({ actorUserId, action: `ACCESS_REQUEST_${status.toUpperCase().replace(" ", "_")}`, entityType: "access_request", entityId: String(id), details: `Status ${status}; study ${assignedStudy ?? "unassigned"}; site ${assignedSite ?? "unassigned"}` });
    return { id, status };
  }
  const request = developmentRequests.find(item => item.id === id);
  if (!request) return null;
  request.status = status;
  request.assignedStudy = assignedStudy ?? null;
  request.assignedSite = assignedSite ?? null;
  request.reviewedAt = new Date();
  developmentAudit.unshift({ action: `ACCESS_REQUEST_${status.toUpperCase().replace(" ", "_")}`, entityId: String(id), details: `Status ${status}; study ${assignedStudy ?? "unassigned"}; site ${assignedSite ?? "unassigned"}`, createdAt: new Date() });
  return { id, status };
}

export async function listAuditEvents() {
  const db = await getDb();
  if (db) return db.select().from(auditEvents).orderBy(desc(auditEvents.createdAt));
  return developmentAudit;
}
