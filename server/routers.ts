import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { answerResearchQuestion, getResearchContext, getRiskSnapshot } from "./researchData";
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

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
