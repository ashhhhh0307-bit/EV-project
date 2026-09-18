# 🚗 AutoSwap — Smart Replacement Mobility
https://autoswap-ev-project.onrender.com

## Smart Rental and Replacement Vehicle Platform

AutoSwap is a smart mobility-sharing platform that connects vehicle owners, customers, and service centers. When a customer’s vehicle is sent for servicing or repair, AutoSwap helps them find a nearby available replacement EV, view the owner’s location, compare distance and pricing, and continue travelling without interruption.

## What was the project?

AutoSwap is designed to solve a common mobility problem: customers often lose access to transportation while their vehicle is being repaired.

Instead of waiting without transport, the platform enables:

- Vehicle owners to list idle EV, petrol, or diesel vehicles.
- Customers to browse nearby rental vehicles.
- Service centers to create replacement-vehicle requests.
- Users to see their own position and available rental-owner positions on a map.
- Customers to compare distance, pickup location, registration number, and daily rental rate.
- Owners to earn income from vehicles that would otherwise remain unused.

The basic idea is:

> Keep every customer moving while their vehicle is being serviced.

## 🏗️ Project Architecture

```text
EV-project/
├── client/             → React 19 + Vite + TypeScript + Tailwind CSS
├── client/src/pages/   → Login, owner listing, AutoSwap workspace
├── client/src/components/
│   ├── RentalAvailabilityMap.tsx → User and rental-owner live map
│   ├── ServiceCenterMap.tsx      → Nearby service-center map
│   └── DashboardLayout.tsx       → Shared application shell
├── server/             → Express + tRPC backend
│   ├── db.ts           → Database helpers and rental workflows
│   ├── routers.ts      → Typed API procedures
│   └── _core/          → OAuth, sessions, environment, storage
├── drizzle/            → MySQL/TiDB schema and migrations
├── shared/             → Matching, booking, and validation logic
└── README.md           → Project documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js 22+
- pnpm 10+
- MySQL/TiDB-compatible database
- Manus OAuth application
- Google Maps configuration for map features

### Step 1 — Install dependencies

```bash
cd EV-project
pnpm install
```

### Step 2 — Configure environment variables

Create a local `.env` file. Never commit this file to GitHub.

```env
NODE_ENV=development
VITE_APP_ID=your_manus_oauth_app_id
JWT_SECRET=your_strong_session_secret
OAUTH_SERVER_URL=your_oauth_server_url
VITE_OAUTH_PORTAL_URL=your_oauth_portal_url
OWNER_OPEN_ID=your_owner_open_id
OWNER_NAME=your_owner_name
DATABASE_URL=mysql://user:password@host:3306/database
BUILT_IN_FORGE_API_URL=your_forge_api_url
BUILT_IN_FORGE_API_KEY=your_forge_api_key
VITE_FRONTEND_FORGE_API_URL=your_frontend_forge_api_url
VITE_FRONTEND_FORGE_API_KEY=your_frontend_forge_api_key
```

Generate a session secret with:

```bash
openssl rand -base64 48
```

### Step 3 — Start the application

```bash
pnpm dev
```

The development application runs on the configured local development port.

### Step 4 — Validate the project

```bash
pnpm check
pnpm test
pnpm build
```

## 🗺️ Live Rental Availability Map

The Active rentals and command-center experience includes a live availability map.

The map can show:

- The user’s current GPS position.
- Available rental-owner EV locations.
- Distance between the user and each available vehicle.
- Vehicle registration number and pickup location.
- Daily rental rate.
- Available-only rental listings.
- A distance line between the user and the selected rental vehicle.
- Sorted rental cards with the nearest vehicles first.

The browser must be served over HTTPS and the user must allow location access for precise GPS positioning.

## 🔄 AutoSwap Rental Workflow

### Vehicle owner workflow

1. Sign in with Google/Gmail through Manus OAuth.
2. Open the owner listing workspace.
3. Enter owner details, vehicle model, year, registration number, range, seats, charging type, availability, rate, and handover location.
4. Save the vehicle listing.
5. The listing becomes available to customers through Browse EV and Active rentals.

### Customer workflow

1. Sign in securely.
2. Open Browse EV or Active rentals.
3. Allow browser location access.
4. View nearby available vehicles on the map.
5. Compare distance, pickup address, registration number, owner location, and daily price.
6. Select a vehicle and begin the booking flow.

### Service-center workflow

1. Register a service-center location.
2. Create a replacement request.
3. Enter repair duration, vehicle type, fuel preference, pickup area, and emergency requirements.
4. Find the nearest suitable replacement vehicle.
5. Coordinate the customer handoff.

## 🧠 Matching and Booking Logic

| Component | Technology | Purpose |
|---|---|---|
| Vehicle matching | TypeScript scoring rules | Match vehicle type, fuel preference, distance, and emergency priority |
| Distance calculation | Google Maps geometry | Calculate user-to-owner distance |
| Location discovery | Browser Geolocation API | Find the user’s current position |
| Vehicle geocoding | Google Maps Geocoder | Convert saved pickup locations into map coordinates |
| Booking calculation | Shared TypeScript helpers | Calculate rental days and total price |
| Availability filter | Backend vehicle status | Show only vehicles currently marked available |
| Persistence | Drizzle ORM + MySQL/TiDB | Store vehicles, requests, rentals, owners, and service centers |

## 🌐 API Procedures

AutoSwap uses typed tRPC procedures under `/api/trpc`.

| Procedure area | Purpose |
|---|---|
| `auth.me` | Read the current authenticated user |
| `auth.logout` | Clear the authenticated session |
| `autoswap.snapshot` | Load operational dashboard metrics |
| `autoswap.listVehicles` | Browse saved fleet vehicles |
| `autoswap.createVehicle` | Save a new rental-owner vehicle |
| `autoswap.listServiceCenters` | Load service-center locations |
| `autoswap.createServiceCenter` | Register a service center |
| `autoswap.listReplacementRequests` | Load replacement requests |
| `autoswap.createReplacementRequest` | Create a customer replacement request |
| `autoswap.acceptReplacementRequest` | Accept a replacement offer and create an active rental |
| `autoswap.bookVehicle` | Book an available saved Browse EV listing |
| `autoswap.listRentals` | Load active rental records |

## 👤 Authentication

Authentication uses Manus OAuth with Google/Gmail sign-in.

Configure the deployed callback URL in the OAuth application:

```text
https://autoswap-ev-project.onrender.com/api/oauth/callback
```

The following must be configured in the deployment environment before Gmail verification can work:

- OAuth application ID
- OAuth server URL
- OAuth portal URL
- JWT session secret
- Owner identity values

No demo usernames or passwords are stored in this repository.

## 📊 Dashboard Features

- **Command center** — Fleet metrics, service-center metrics, open requests, and active rentals.
- **Fleet inventory** — Saved owner vehicles and their current status.
- **Service centers** — Map view, nearby centers, user location, and navigation actions.
- **Replacement requests** — Customer repair requests and matching workflow.
- **Active rentals** — Current rentals plus Browse EV availability and booking actions.
- **Owner listing** — Vehicle details, pricing, availability, pickup location, and listing preview.
- **Live map** — User position, rental-owner positions, distance lines, and available EV markers.

## 🔌 Database

The application uses a MySQL-compatible database through Drizzle ORM and `mysql2`.

The main domain entities include:

- Users
- Vehicle owners
- Vehicles
- Service centers
- Replacement requests
- Rentals
- Rental status and availability state

Set the production database connection as a Render secret environment variable:

```env
DATABASE_URL=mysql://user:password@host:3306/database
```

Render PostgreSQL is not directly compatible with the current MySQL schema without migrating the database dialect and queries.

## ☁️ Render Deployment

Render service configuration:

```text
Runtime       → Node
Branch        → main
Build command → pnpm install --frozen-lockfile && pnpm build
Start command → pnpm start
Region        → Singapore
```

Live service:

```text
https://autoswap-ev-project.onrender.com
```

Add production secrets from Render’s Environment settings. Never place them in this README or in GitHub source files.

## 🧪 Testing

Run the complete test suite:

```bash
pnpm test
```

The tests cover:

- Authentication logout behavior.
- EV registration validation.
- AutoSwap vehicle matching.
- Rental duration and price calculations.
- Nearby pickup matching.
- Availability-only vehicle presentation.
- Login content and OAuth callback helpers.

## 📁 Key Files

| File | Purpose |
|---|---|
| `client/src/pages/Login.tsx` | Google/Gmail login experience |
| `client/src/pages/OwnerListing.tsx` | Vehicle-owner listing workflow |
| `client/src/pages/AutoSwap.tsx` | Main rental-management workspace |
| `client/src/components/RentalAvailabilityMap.tsx` | Live user and rental-owner map |
| `client/src/components/ServiceCenterMap.tsx` | Service-center map and navigation |
| `server/routers.ts` | Typed backend procedures |
| `server/db.ts` | Database queries and rental operations |
| `drizzle/schema.ts` | MySQL/TiDB domain schema |
| `shared/autoswapBooking.ts` | Booking and pricing helpers |
| `shared/autoswapDomain.ts` | Matching and domain rules |
| `shared/evDomain.ts` | Vehicle and registration validation |

## 🔒 Security Notes

- Never commit `.env` files or credentials.
- Keep JWT, OAuth, API, and database values in Render environment variables.
- Use HTTPS for browser geolocation and Gmail authentication.
- Do not expose database credentials in frontend code.
- Use a production database separate from local development.
- Restrict OAuth callback URLs to trusted domains.

## License

MIT License.
