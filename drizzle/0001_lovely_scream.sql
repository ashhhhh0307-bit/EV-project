CREATE TABLE `autoswap_rentals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`requestId` int NOT NULL,
	`vehicleId` int NOT NULL,
	`customerId` int NOT NULL,
	`serviceCenterId` int,
	`startAt` timestamp NOT NULL,
	`endAt` timestamp,
	`status` enum('reserved','active','returned','cancelled') NOT NULL DEFAULT 'reserved',
	`totalAmountCents` int NOT NULL DEFAULT 0,
	`platformCommissionCents` int NOT NULL DEFAULT 0,
	`protectionPlan` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `autoswap_rentals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `autoswap_replacement_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerId` int NOT NULL,
	`serviceCenterId` int,
	`originalVehicleDescription` varchar(180) NOT NULL,
	`requestedVehicleType` enum('car','bike','any') NOT NULL DEFAULT 'any',
	`fuelPreference` enum('ev','petrol','diesel','any') NOT NULL DEFAULT 'any',
	`pickupLocation` text NOT NULL,
	`startAt` timestamp NOT NULL,
	`expectedEndAt` timestamp NOT NULL,
	`emergencyDelivery` int NOT NULL DEFAULT 0,
	`status` enum('open','matched','active','completed','cancelled') NOT NULL DEFAULT 'open',
	`matchedVehicleId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `autoswap_replacement_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `autoswap_service_centers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`name` varchar(120) NOT NULL,
	`city` varchar(80) NOT NULL,
	`address` text,
	`phone` varchar(32),
	`status` enum('pending','active','paused') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `autoswap_service_centers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `autoswap_vehicles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`vehicleType` enum('car','bike') NOT NULL,
	`fuelType` enum('ev','petrol','diesel') NOT NULL,
	`make` varchar(80) NOT NULL,
	`model` varchar(100) NOT NULL,
	`registrationNumber` varchar(32) NOT NULL,
	`city` varchar(80) NOT NULL,
	`pickupAddress` text,
	`dailyRateCents` int NOT NULL,
	`status` enum('available','reserved','rented','maintenance','inactive') NOT NULL DEFAULT 'available',
	`protectionIncluded` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `autoswap_vehicles_id` PRIMARY KEY(`id`),
	CONSTRAINT `autoswap_vehicles_registrationNumber_unique` UNIQUE(`registrationNumber`)
);
