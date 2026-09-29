import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const accessRequests = mysqlTable("accessRequests", {
  id: int("id").autoincrement().primaryKey(),
  fullName: varchar("fullName", { length: 160 }).notNull(),
  officialEmail: varchar("officialEmail", { length: 320 }).notNull(),
  mobileNumber: varchar("mobileNumber", { length: 32 }).notNull(),
  researcherId: varchar("researcherId", { length: 80 }).notNull(),
  institution: varchar("institution", { length: 200 }).notNull(),
  department: varchar("department", { length: 160 }).notNull(),
  designation: varchar("designation", { length: 120 }).notNull(),
  city: varchar("city", { length: 120 }).notNull(),
  requestedRole: varchar("requestedRole", { length: 80 }).notNull(),
  researchArea: varchar("researchArea", { length: 240 }).notNull(),
  siteCentre: varchar("siteCentre", { length: 160 }).notNull(),
  reason: text("reason").notNull(),
  status: mysqlEnum("status", ["Pending", "Under Review", "Approved", "Rejected"]).default("Pending").notNull(),
  assignedStudy: varchar("assignedStudy", { length: 80 }),
  assignedSite: varchar("assignedSite", { length: 160 }),
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
  reviewedAt: timestamp("reviewedAt"),
});

export const auditEvents = mysqlTable("auditEvents", {
  id: int("id").autoincrement().primaryKey(),
  actorUserId: int("actorUserId"),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entityType", { length: 80 }).notNull(),
  entityId: varchar("entityId", { length: 80 }).notNull(),
  details: text("details"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type AccessRequest = typeof accessRequests.$inferSelect;
export type InsertAccessRequest = typeof accessRequests.$inferInsert;
