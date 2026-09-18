# AutoSwap — Smart Replacement Mobility

AutoSwap is a smart mobility-sharing platform that keeps customers moving while their cars or bikes are being serviced. Vehicle owners can list idle EV, petrol, or diesel vehicles, while service centers and customers can discover nearby replacement vehicles, compare distance and availability, and manage rental handoffs.

> **AutoSwap:** Get a replacement vehicle instantly while your vehicle is being serviced.

## What the platform does

- Vehicle owners list idle cars and bikes for short-term rental.
- Customers discover available replacement vehicles near their current position.
- The live availability map displays the customer position, rental-owner vehicle positions, distance between them, and available EV listings.
- Service centers can manage replacement requests and keep customers mobile during repairs.
- Owners can review vehicle details, pickup locations, daily rates, and rental availability.
- Active rentals can be created from saved Browse EV listings.
- The platform supports EV, petrol, and diesel vehicles.
- Authentication is provided through Manus OAuth with Google/Gmail sign-in.
- Rental, vehicle, request, service-center, and owner data are designed for persistent database storage.

## Main workflows

### Vehicle owner

1. Sign in securely.
2. Open the owner listing workspace.
3. Add vehicle details, registration information, rate, availability, and handover location.
4. Save the listing to the shared AutoSwap fleet.
5. Receive booking or replacement requests for the listed vehicle.

### Customer

1. Sign in with Google/Gmail.
2. Open Browse EV or Active rentals.
3. Allow location access.
4. View nearby available rental EVs on the map.
5. Compare owner position, pickup address, distance, registration number, and daily rate.
6. Select a vehicle and begin the booking workflow.

### Service center

1. Register or manage a service-center location.
2. Create a replacement request for a customer.
3. Provide vehicle type, fuel preference, repair duration, pickup location, and emergency requirements.
4. Review nearby vehicle matches and coordinate the replacement handoff.

## Technology stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui, Lucide icons
- **Backend:** Express, tRPC 11, Node.js
- **Database:** Drizzle ORM with MySQL/TiDB through `mysql2`
- **Authentication:** Manus OAuth / Google sign-in
- **Maps:** Google Maps integration with browser geolocation, geocoding, markers, distance calculations, and route lines
- **Testing:** Vitest
- **Deployment:** Render web service

## Project structure

```text
client/
  src/
    components/       Reusable UI and live map components
    pages/            Login, owner listing, and AutoSwap workspace pages
    App.tsx           Auth gate and application routes
    index.css         Product design system and responsive styles
server/
  _core/              Auth, OAuth, environment, storage, and server infrastructure
  db.ts               Database helpers and AutoSwap queries
  routers.ts          tRPC API procedures
  auth.logout.test.ts Authentication test coverage
drizzle/
  schema.ts           MySQL/TiDB database schema
shared/
  autoswapBooking.ts  Booking calculations and nearby-listing helpers
  autoswapDomain.ts   Matching and rental-domain rules
  evDomain.ts         EV registration validation
```

## Requirements

- Node.js 22 or newer
- pnpm 10 or newer
- A MySQL-compatible database: MySQL, TiDB Cloud, PlanetScale-compatible MySQL, or equivalent
- Manus OAuth application credentials
- Google Maps configuration supported by the project environment

## Local development

```bash
pnpm install
pnpm dev
```

The development server starts the full-stack application with Vite and Express.

## Validation commands

```bash
pnpm check
pnpm test
pnpm build
```

The test suite covers authentication behavior, EV registration validation, AutoSwap matching, rental calculations, nearby-listing rules, and login content contracts.

## Environment variables

Create a local `.env` file only for development. Never commit it to GitHub.

```env
NODE_ENV=development
VITE_APP_ID=<manus-oauth-app-id>
JWT_SECRET=<strong-random-session-secret>
OAUTH_SERVER_URL=<manus-oauth-server-url>
VITE_OAUTH_PORTAL_URL=<manus-login-portal-url>
OWNER_OPEN_ID=<project-owner-open-id>
OWNER_NAME=<project-owner-name>
DATABASE_URL=mysql://<user>:<password>@<host>:<port>/<database>
BUILT_IN_FORGE_API_URL=<server-side-forge-api-url>
BUILT_IN_FORGE_API_KEY=<server-side-forge-api-key>
VITE_FRONTEND_FORGE_API_URL=<frontend-forge-api-url>
VITE_FRONTEND_FORGE_API_KEY=<frontend-forge-api-key>
```

Generate a strong JWT secret with:

```bash
openssl rand -base64 48
```

The production database must be MySQL/TiDB-compatible because the project schema uses Drizzle's MySQL dialect and the `mysql2` driver.

## OAuth callback

For a deployed Render service, configure the OAuth application callback URL as:

```text
https://<your-render-service>.onrender.com/api/oauth/callback
```

The callback domain must be allowed by the OAuth application before Google/Gmail sign-in can complete.

## Render deployment

Configure a Render Node web service with:

```text
Build command: pnpm install --frozen-lockfile && pnpm build
Start command: pnpm start
Branch: main
Runtime: Node
```

Add all production environment variables in Render's Environment settings. Do not place credentials in the repository, README, build command, or client-side source files.

After configuring the environment:

```bash
pnpm build
pnpm start
```

Verify these endpoints on the deployed service:

```text
GET /
GET /api/trpc/auth.me
GET /api/oauth/callback
```

The protected `auth.me` procedure should only return an authenticated user after the OAuth session is established.

## Security notes

- Never commit API keys, OAuth secrets, database passwords, JWT secrets, or `.env` files.
- Use Render environment variables or a managed secret store for production values.
- Use a separate production database and credentials from local development.
- Restrict OAuth callback URLs to trusted application domains.
- Browser geolocation requires user permission and a secure HTTPS origin.
- Rental-owner coordinates should be displayed according to the product's privacy and handoff policy.

## Current deployment

The production service is deployed on Render at:

```text
https://autoswap-ev-project.onrender.com
```

The deployed service requires production OAuth and MySQL/TiDB environment variables before Gmail authentication and persistent backend data can operate fully.

## License

This project is released under the MIT License.
