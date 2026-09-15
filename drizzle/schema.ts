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

export const autoswapVehicles = mysqlTable("autoswap_vehicles", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  vehicleType: mysqlEnum("vehicleType", ["car", "bike"]).notNull(),
  fuelType: mysqlEnum("fuelType", ["ev", "petrol", "diesel"]).notNull(),
  make: varchar("make", { length: 80 }).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  registrationNumber: varchar("registrationNumber", { length: 32 }).notNull().unique(),
  city: varchar("city", { length: 80 }).notNull(),
  pickupAddress: text("pickupAddress"),
  dailyRateCents: int("dailyRateCents").notNull(),
  status: mysqlEnum("status", ["available", "reserved", "rented", "maintenance", "inactive"]).default("available").notNull(),
  protectionIncluded: int("protectionIncluded").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const autoswapServiceCenters = mysqlTable("autoswap_service_centers", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  city: varchar("city", { length: 80 }).notNull(),
  address: text("address"),
  phone: varchar("phone", { length: 32 }),
  status: mysqlEnum("status", ["pending", "active", "paused"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const autoswapReplacementRequests = mysqlTable("autoswap_replacement_requests", {
  id: int("id").autoincrement().primaryKey(),
  customerId: int("customerId").notNull(),
  serviceCenterId: int("serviceCenterId"),
  originalVehicleDescription: varchar("originalVehicleDescription", { length: 180 }).notNull(),
  requestedVehicleType: mysqlEnum("requestedVehicleType", ["car", "bike", "any"]).default("any").notNull(),
  fuelPreference: mysqlEnum("fuelPreference", ["ev", "petrol", "diesel", "any"]).default("any").notNull(),
  pickupLocation: text("pickupLocation").notNull(),
  startAt: timestamp("startAt").notNull(),
  expectedEndAt: timestamp("expectedEndAt").notNull(),
  emergencyDelivery: int("emergencyDelivery").default(0).notNull(),
  status: mysqlEnum("status", ["open", "matched", "active", "completed", "cancelled"]).default("open").notNull(),
  matchedVehicleId: int("matchedVehicleId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const autoswapRentals = mysqlTable("autoswap_rentals", {
  id: int("id").autoincrement().primaryKey(),
  requestId: int("requestId").notNull(),
  vehicleId: int("vehicleId").notNull(),
  customerId: int("customerId").notNull(),
  serviceCenterId: int("serviceCenterId"),
  startAt: timestamp("startAt").notNull(),
  endAt: timestamp("endAt"),
  status: mysqlEnum("status", ["reserved", "active", "returned", "cancelled"]).default("reserved").notNull(),
  totalAmountCents: int("totalAmountCents").default(0).notNull(),
  platformCommissionCents: int("platformCommissionCents").default(0).notNull(),
  protectionPlan: int("protectionPlan").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type AutoswapVehicle = typeof autoswapVehicles.$inferSelect;
export type InsertAutoswapVehicle = typeof autoswapVehicles.$inferInsert;
export type AutoswapServiceCenter = typeof autoswapServiceCenters.$inferSelect;
export type InsertAutoswapServiceCenter = typeof autoswapServiceCenters.$inferInsert;
export type AutoswapReplacementRequest = typeof autoswapReplacementRequests.$inferSelect;
export type InsertAutoswapReplacementRequest = typeof autoswapReplacementRequests.$inferInsert;
export type AutoswapRental = typeof autoswapRentals.$inferSelect;
export type InsertAutoswapRental = typeof autoswapRentals.$inferInsert;
