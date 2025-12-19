# 🏠 Estate Management System

## Overview

The **Estate Management System** is a digital solution designed for **estate surveyors, property managers, and real estate firms** to efficiently manage properties, tenants, leases, rent records, maintenance issues, and documents in one place.

It eliminates manual spreadsheets and forgotten tasks by providing **automation, notifications, and central record-keeping**, ensuring smooth operations and improved tenant–manager communication.

---

## ✨ Key Features

* **Property & Unit Registry**

  * Store details of estates, individual units/flats, addresses, sizes, and photos.
  * Track occupancy status (vacant, occupied, under maintenance).

* **Tenant Records**

  * Maintain tenant contact details, guarantor information, and identification documents.
  * Attach scanned documents (ID cards, utility bills, contracts).

* **Lease Management**

  * Record lease agreements with start and end dates.
  * Track rent amount, deposit, and billing cycle (monthly/quarterly/yearly).
  * Monitor lease status (active, expired, terminated).

* **Rent Tracking (No Online Payments)**

  * Generate rent invoices automatically based on lease terms.
  * Mark invoices as *pending, settled, or overdue*.
  * Run automated reminders for due and overdue rent.

* **Email Notifications**

  * Automated reminders for upcoming rent, overdue rent, lease expiry, and maintenance updates.
  * Escalations to managers for overdue invoices or unresolved maintenance requests.

* **Document Storage**

  * Securely upload and link documents to tenants, leases, units, or properties.
  * Examples: leases, receipts, inspection reports, ID scans.

* **Automation & Scheduling**

  * Automatic generation of recurring invoices.
  * Scheduled reminders for rent due/overdue.
  * Alerts for lease expiries and pending inspections.
  * Monthly occupancy and rent-roll reports sent to managers.

---

## 👤 Who Is It For?

* **Estate Surveyors & Valuers** – professionals managing rental properties for clients.
* **Property Managers** – managing multiple tenants, leases, and units across properties.
* **Real Estate Firms** – overseeing multiple estates and needing central visibility.
* **Accountants** – tracking rent inflow/outflow and arrears reporting.
* **Tenants** – receiving timely reminders, accessing lease documents, and raising maintenance requests.

---

## 🛠️ Tech Stack (suggested)

* **Frontend:** Next.js, TailwindCSS, ShadCN UI
* **Backend:** Node.js / Express or Next.js API routes
* **Database:** PostgreSQL (normalized schema)
* **Cache & Jobs:** Redis + BullMQ / QStash (for scheduled reminders)
* **Storage:** ImageKit or AWS S3 (for documents/photos)
* **Email Notifications:** Resend / SMTP service
* **Deployment:** Render, Railway, or Vercel

---

## 📊 Example Automations

* Rent invoice generated **7 days before due date** → reminder email sent.
* Invoice marked **overdue after due date** → overdue notice sent.
* **Lease expiry** notifications sent at 60, 30, and 7 days prior.
* **Monthly rent roll & occupancy report** emailed to managers automatically.

---

## 🚀 Benefits

* No more lost records or overlooked tasks.
* Faster communication with tenants.
* Clear visibility on arrears and occupancy.
* Centralized repository for all documents.
* Reduced workload through automation.

---

# Developer README (Backend)

This document complements the high-level overview above with concrete, up-to-date details for running and developing the backend API.

## Tech Stack (actual)
- Language: TypeScript (Node.js 24)
- Framework: Express 5
- ORM: Drizzle ORM (PostgreSQL)
- Database: PostgreSQL (local via Neon Local; cloud via standard DATABASE_URL)
- Email: Nodemailer (SMTP)
- Scheduling: node-cron (recurring jobs)
- Validation: zod
- Logging: winston
- Package manager: pnpm (declared in package.json)
- Containerization: Docker + Docker Compose
- CI: GitHub Actions (.github/workflows/pipeline.yaml)

## Requirements
- Node.js 24.x (CI uses 24)
- pnpm 10.x (packageManager: pnpm@10.18.2)
- Docker and Docker Compose (for containerized dev or prod)
- PostgreSQL connection string (DATABASE_URL) — Neon Local via docker-compose.dev.yml or any Postgres instance

## Project Structure (backend)
- src/
  - index.ts (application entry point)
  - routes/ (auth, property, unit, owner, tenant, lease, invoice, cron)
  - services/ (business logic; includes job.scheduler.ts for cron jobs)
  - database/
    - index.ts (pg pool + drizzle init)
    - schemas/ (Drizzle schema definitions)
  - middlewares/ (error handling, 404)
  - utils/ (logger, sendEmail, etc.)
  - config/ (env config loader)
- migrations/ (Drizzle migrations output)
- scripts/ (helper scripts if any)
- Dockerfile (multi-stage for dev/prod)
- docker-compose.dev.yml (Neon local + app for development)
- OPERATIONAL_DETAILS.md (detailed product and API documentation)

## Environment Variables
The app loads environment variables via dotenv (see src/config/index.ts). Missing required vars will throw at startup.

Required:
- DATABASE_URL: PostgreSQL connection string
- JWT_SECRET: Secret for signing access tokens
- REFRESH_TOKEN: Secret for signing refresh tokens
- BASE_URL: Public base URL for the API (e.g., http://localhost:5000)
- EMAIL_HOST: SMTP host
- EMAIL_PORT: SMTP port (e.g., 587)
- EMAIL_USER: SMTP username
- EMAIL_PASS: SMTP password
- EMAIL_FROM: Default from email address
- EMAIL_SECURE: "true" for port 465, otherwise "false"
- QSTASH_URL: Upstash QStash URL
- QSTASH_TOKEN: Upstash QStash token
- QSTASH_CURRENT_SIGNING_KEY: QStash current signing key
- QSTASH_NEXT_SIGNING_KEY: QStash next signing key
- PORT: Port to run the server on (defaults to 5000)

Optional/Legacy:
- SMTP_FROM_NAME, SMTP_FROM_EMAIL: Used in sendEmail.ts as optional overrides for the from header.
  - TODO: Confirm and standardize on EMAIL_* vs SMTP_* naming across the codebase.

Sample .env.development (do not commit):

DATABASE_URL=postgres://neon:neon@localhost:5432/postgres
JWT_SECRET=replace-me
REFRESH_TOKEN=replace-me-refresh
BASE_URL=http://localhost:5000
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_user
EMAIL_PASS=your_password
EMAIL_FROM=noreply@example.com
EMAIL_SECURE=false
QSTASH_URL=https://qstash.upstash.io
QSTASH_TOKEN=replace-me
QSTASH_CURRENT_SIGNING_KEY=replace-me
QSTASH_NEXT_SIGNING_KEY=replace-me
PORT=5000

## Setup
### 1) Install dependencies
- pnpm install

### 2) Database
- Local Dev (recommended): Use Neon Local via Docker Compose included in docker-compose.dev.yml
  - It mounts neon_local/ and uses .env.development if present for the db service.
- Alternatively: Point DATABASE_URL at any Postgres instance.

### 3) Generate/Apply migrations
- Drizzle config is at drizzle.config.ts (schema: ./src/database/schemas, out: ./migrations)
- TODO: Add documented commands for generating and applying migrations once finalized for this project (e.g., pnpm drizzle-kit generate, pnpm drizzle-kit migrate).

## Running the app
### Local (Node)
- Development: pnpm dev
  - Uses ts-node-dev to run src/index.ts with auto-reload
- Build: pnpm build
  - Outputs to dist/
- Production (local): pnpm start
  - Runs dist/index.js

### Docker (recommended for dev)
- Dev: docker compose -f docker-compose.dev.yml up --build
  - Or use the helper script: pnpm setup (calls setup-docker.sh dev)
    - Note: setup-docker.sh is a Bash script; on Windows use WSL or Git Bash.
- Prod image: docker build --target production -t estate-app:latest .
- Run prod container (example):
  docker run -it --rm -p 5000:5000 --env-file .env.production --name estate-app estate-app:latest

## API Endpoints
- The server prints available base routes on GET /. Example:
  - /api/v1/auth
  - /api/v1/properties
  - /api/v1/units
  - /api/v1/owners
  - /api/v1/tenants
  - /api/v1/leases
  - /api/v1/invoices
- See OPERATIONAL_DETAILS.md for comprehensive endpoint and workflow documentation.

## Scheduled Jobs
- Defined in src/services/job.scheduler.ts and initialized on server start.
- Cron schedules:
  - Generate recurring invoices: daily at 1:00 AM
  - Update overdue invoices: daily at 2:00 AM
  - Update expired leases: daily at 3:00 AM
  - Send rent due reminders: daily at 9:00 AM
  - Send overdue reminders: daily at 10:00 AM
- TODO: Integrate actual email delivery for reminders; currently logs only.

## Scripts (package.json)
- pnpm dev: ts-node-dev --respawn --transpile-only src/index.ts
- pnpm build: tsc
- pnpm start: node dist/index.js
- pnpm test: node test.js
- pnpm dev-start: nodemon --watch src --exec ts-node src/index.ts (alternative dev runner)
- pnpm setup: bash setup-docker.sh (helper for Docker dev/prod)

## Tests
- Current: pnpm test runs node test.js (simple console output for CI validation).
- TODO: Add proper unit/integration tests (e.g., Vitest/Jest + Supertest) and database test harness.

## Logs
- Console logging via winston; docker-compose mounts ./logs to /app/logs for persistence (if used by future transports).
- TODO: Add file transports/rotation if needed.

## CI/CD
- GitHub Actions: .github/workflows/pipeline.yaml
  - Installs with pnpm and runs pnpm test on pushes to main.

## License
- ISC (see package.json "license").

## Notes and TODOs
- Standardize environment variable naming for email (EMAIL_* vs SMTP_*).
- Document Drizzle migration commands/workflow in README once finalized.
- Add authentication, seed, and migration steps to help new contributors.
- Add OpenAPI/Swagger docs for the REST API (optional).
