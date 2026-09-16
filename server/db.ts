import { and, count, desc, eq, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  autoswapReplacementRequests,
  autoswapRentals,
  autoswapServiceCenters,
  autoswapVehicles,
  InsertAutoswapReplacementRequest,
  InsertAutoswapServiceCenter,
  InsertAutoswapVehicle,
  InsertUser,
  users,
} from "../drizzle/schema";
import { ENV } from './_core/env';
import { rentalTotalCents } from "../shared/autoswapBooking";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    for (const field of textFields) {
      if (user[field] === undefined) continue;
      const normalized = user[field] ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    }
    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }
    values.lastSignedIn ??= new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

async function countRows(table: any) {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ value: count() }).from(table);
  return Number(result[0]?.value ?? 0);
}

export async function getAutoSwapSnapshot() {
  const [vehicles, availableVehicles, centers, openRequests, activeRentals, totalRentals] = await Promise.all([
    countRows(autoswapVehicles),
    (async () => { const db = await getDb(); if (!db) return 0; const r = await db.select({ value: count() }).from(autoswapVehicles).where(eq(autoswapVehicles.status, "available")); return Number(r[0]?.value ?? 0); })(),
    countRows(autoswapServiceCenters),
    (async () => { const db = await getDb(); if (!db) return 0; const r = await db.select({ value: count() }).from(autoswapReplacementRequests).where(or(eq(autoswapReplacementRequests.status, "open"), eq(autoswapReplacementRequests.status, "matched"))); return Number(r[0]?.value ?? 0); })(),
    (async () => { const db = await getDb(); if (!db) return 0; const r = await db.select({ value: count() }).from(autoswapRentals).where(or(eq(autoswapRentals.status, "reserved"), eq(autoswapRentals.status, "active"))); return Number(r[0]?.value ?? 0); })(),
    countRows(autoswapRentals),
  ]);
  return { vehicles, availableVehicles, centers, openRequests, activeRentals, totalRentals };
}

export async function listAutoswapVehicles() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(autoswapVehicles).orderBy(desc(autoswapVehicles.createdAt));
}

export async function listAutoswapServiceCenters() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(autoswapServiceCenters).orderBy(desc(autoswapServiceCenters.createdAt));
}

export async function listAutoswapRequests() {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    id: autoswapReplacementRequests.id,
    customerId: autoswapReplacementRequests.customerId,
    serviceCenterId: autoswapReplacementRequests.serviceCenterId,
    originalVehicleDescription: autoswapReplacementRequests.originalVehicleDescription,
    requestedVehicleType: autoswapReplacementRequests.requestedVehicleType,
    fuelPreference: autoswapReplacementRequests.fuelPreference,
    pickupLocation: autoswapReplacementRequests.pickupLocation,
    startAt: autoswapReplacementRequests.startAt,
    expectedEndAt: autoswapReplacementRequests.expectedEndAt,
    emergencyDelivery: autoswapReplacementRequests.emergencyDelivery,
    status: autoswapReplacementRequests.status,
    matchedVehicleId: autoswapReplacementRequests.matchedVehicleId,
    customerName: users.name,
    customerEmail: users.email,
    serviceCenterName: autoswapServiceCenters.name,
    serviceCenterCity: autoswapServiceCenters.city,
  }).from(autoswapReplacementRequests)
    .leftJoin(users, eq(autoswapReplacementRequests.customerId, users.id))
    .leftJoin(autoswapServiceCenters, eq(autoswapReplacementRequests.serviceCenterId, autoswapServiceCenters.id))
    .orderBy(desc(autoswapReplacementRequests.createdAt));
}

export async function listAutoswapRentals() {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    id: autoswapRentals.id,
    requestId: autoswapRentals.requestId,
    vehicleId: autoswapRentals.vehicleId,
    customerId: autoswapRentals.customerId,
    serviceCenterId: autoswapRentals.serviceCenterId,
    startAt: autoswapRentals.startAt,
    endAt: autoswapRentals.endAt,
    status: autoswapRentals.status,
    totalAmountCents: autoswapRentals.totalAmountCents,
    platformCommissionCents: autoswapRentals.platformCommissionCents,
    protectionPlan: autoswapRentals.protectionPlan,
    ownerName: users.name,
    ownerEmail: users.email,
    vehicleType: autoswapVehicles.vehicleType,
    fuelType: autoswapVehicles.fuelType,
    registrationNumber: autoswapVehicles.registrationNumber,
    city: autoswapVehicles.city,
    pickupAddress: autoswapVehicles.pickupAddress,
  }).from(autoswapRentals)
    .leftJoin(autoswapVehicles, eq(autoswapRentals.vehicleId, autoswapVehicles.id))
    .leftJoin(users, eq(autoswapVehicles.ownerId, users.id))
    .orderBy(desc(autoswapRentals.createdAt));
}

export async function createAutoswapVehicle(input: Omit<InsertAutoswapVehicle, "ownerId">, ownerId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(autoswapVehicles).values({ ...input, ownerId });
  return Number(result[0].insertId);
}

export async function createAutoswapServiceCenter(input: Omit<InsertAutoswapServiceCenter, "ownerId">, ownerId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(autoswapServiceCenters).values({ ...input, ownerId });
  return Number(result[0].insertId);
}

export async function createAutoswapRequest(input: Omit<InsertAutoswapReplacementRequest, "customerId">, customerId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(autoswapReplacementRequests).values({ ...input, customerId });
  return Number(result[0].insertId);
}

export async function acceptAutoswapOffer(requestId: number, vehicleId: number) {
  const db = await getDb();
  if (!db) return null;
  const requests = await db.select().from(autoswapReplacementRequests).where(eq(autoswapReplacementRequests.id, requestId)).limit(1);
  const vehicles = await db.select().from(autoswapVehicles).where(eq(autoswapVehicles.id, vehicleId)).limit(1);
  const request = requests[0];
  const vehicle = vehicles[0];
  if (!request || !vehicle || vehicle.status !== "available") return null;
  await db.update(autoswapReplacementRequests).set({ status: "active", matchedVehicleId: vehicleId }).where(eq(autoswapReplacementRequests.id, requestId));
  await db.update(autoswapVehicles).set({ status: "rented" }).where(eq(autoswapVehicles.id, vehicleId));
  const total = rentalTotalCents(vehicle.dailyRateCents, request.startAt, request.expectedEndAt);
  const result = await db.insert(autoswapRentals).values({ requestId, vehicleId, customerId: request.customerId, serviceCenterId: request.serviceCenterId, startAt: request.startAt, totalAmountCents: total, platformCommissionCents: Math.round(total * 0.15), protectionPlan: 1, status: "active" });
  return Number(result[0].insertId);
}

export async function bookAutoswapVehicle(input: { vehicleId: number; pickupLocation: string; startAt: Date; expectedEndAt: Date; emergencyDelivery: number }, customerId: number) {
  const db = await getDb();
  if (!db) return null;
  const vehicles = await db.select().from(autoswapVehicles).where(eq(autoswapVehicles.id, input.vehicleId)).limit(1);
  const vehicle = vehicles[0];
  if (!vehicle || vehicle.status !== "available") return null;
  const requestResult = await db.insert(autoswapReplacementRequests).values({
    customerId,
    originalVehicleDescription: "Customer vehicle replacement booking",
    requestedVehicleType: vehicle.vehicleType,
    fuelPreference: vehicle.fuelType,
    pickupLocation: input.pickupLocation,
    startAt: input.startAt,
    expectedEndAt: input.expectedEndAt,
    emergencyDelivery: input.emergencyDelivery,
    status: "active",
    matchedVehicleId: vehicle.id,
  });
  const requestId = Number(requestResult[0].insertId);
  const total = rentalTotalCents(vehicle.dailyRateCents, input.startAt, input.expectedEndAt);
  await db.update(autoswapVehicles).set({ status: "rented" }).where(eq(autoswapVehicles.id, vehicle.id));
  const rentalResult = await db.insert(autoswapRentals).values({ requestId, vehicleId: vehicle.id, customerId, startAt: input.startAt, endAt: input.expectedEndAt, totalAmountCents: total, platformCommissionCents: Math.round(total * 0.15), protectionPlan: vehicle.protectionIncluded, status: "active" });
  return { rentalId: Number(rentalResult[0].insertId), requestId, totalAmountCents: total };
}
