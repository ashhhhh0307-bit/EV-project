import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  createAutoswapRequest,
  createAutoswapServiceCenter,
  createAutoswapVehicle,
  getAutoSwapSnapshot,
  listAutoswapRentals,
  listAutoswapRequests,
  listAutoswapServiceCenters,
  listAutoswapVehicles,
  matchAutoswapRequest,
} from "./db";

const vehicleInput = z.object({
  vehicleType: z.enum(["car", "bike"]),
  fuelType: z.enum(["ev", "petrol", "diesel"]),
  make: z.string().min(1).max(80),
  model: z.string().min(1).max(100),
  registrationNumber: z.string().min(3).max(32),
  city: z.string().min(1).max(80),
  pickupAddress: z.string().max(500).optional(),
  dailyRateCents: z.number().int().min(0),
  protectionIncluded: z.number().int().min(0).max(1).default(1),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  autoswap: router({
    snapshot: protectedProcedure.query(() => getAutoSwapSnapshot()),
    vehicles: protectedProcedure.query(() => listAutoswapVehicles()),
    serviceCenters: protectedProcedure.query(() => listAutoswapServiceCenters()),
    requests: protectedProcedure.query(() => listAutoswapRequests()),
    rentals: protectedProcedure.query(() => listAutoswapRentals()),
    createVehicle: protectedProcedure.input(vehicleInput).mutation(({ input, ctx }) => createAutoswapVehicle(input, ctx.user.id)),
    createServiceCenter: protectedProcedure.input(z.object({ name: z.string().min(1).max(120), city: z.string().min(1).max(80), address: z.string().max(500).optional(), phone: z.string().max(32).optional() })).mutation(({ input, ctx }) => createAutoswapServiceCenter({ ...input, status: "pending" }, ctx.user.id)),
    createRequest: protectedProcedure.input(z.object({ originalVehicleDescription: z.string().min(2).max(180), requestedVehicleType: z.enum(["car", "bike", "any"]), fuelPreference: z.enum(["ev", "petrol", "diesel", "any"]), pickupLocation: z.string().min(2), startAt: z.date(), expectedEndAt: z.date(), serviceCenterId: z.number().int().positive().optional(), emergencyDelivery: z.number().int().min(0).max(1).default(0) })).mutation(({ input, ctx }) => createAutoswapRequest({ ...input, status: "open" }, ctx.user.id)),
    matchRequest: protectedProcedure.input(z.object({ requestId: z.number().int().positive(), vehicleId: z.number().int().positive() })).mutation(({ input }) => matchAutoswapRequest(input.requestId, input.vehicleId)),
  }),
});

export type AppRouter = typeof appRouter;
