import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { answerResearchQuestion, getResearchContext, getRiskSnapshot } from "./researchData";
import { createAccessRequest, listAccessRequests, listAuditEvents, updateAccessRequest } from "./accessRequests";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  research: router({
    context: protectedProcedure.query(({ ctx }) => getResearchContext(ctx.user)),
    riskSnapshot: protectedProcedure
      .input(z.object({ studyId: z.string().optional() }).optional())
      .query(({ ctx, input }) => getRiskSnapshot(ctx.user, input?.studyId)),
    ask: protectedProcedure
      .input(z.object({ question: z.string().min(3).max(500), studyId: z.string().optional() }))
      .mutation(({ ctx, input }) => answerResearchQuestion(ctx.user, input.question, input.studyId)),
  }),

  accessRequests: router({
    submit: publicProcedure
      .input(z.object({
        fullName: z.string().min(2).max(160), officialEmail: z.string().email(), mobileNumber: z.string().min(7).max(32), researcherId: z.string().min(2).max(80), institution: z.string().min(2).max(200), department: z.string().min(2).max(160), designation: z.string().min(2).max(120), city: z.string().min(2).max(120), requestedRole: z.enum(["Principal Investigator", "Research Coordinator", "Site Investigator", "Data Manager", "Regulatory / Ethics", "Pharmacovigilance", "Administrator"]), researchArea: z.string().min(2).max(240), siteCentre: z.string().min(2).max(160), reason: z.string().min(10).max(2000),
      }))
      .mutation(({ input }) => createAccessRequest(input)),
    list: adminProcedure.query(() => listAccessRequests()),
    review: adminProcedure
      .input(z.object({ id: z.number().int().positive(), status: z.enum(["Pending", "Under Review", "Approved", "Rejected"]), assignedStudy: z.string().optional(), assignedSite: z.string().optional() }))
      .mutation(({ ctx, input }) => updateAccessRequest(input.id, input.status, ctx.user.id, input.assignedStudy, input.assignedSite)),
    audit: adminProcedure.query(() => listAuditEvents()),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
