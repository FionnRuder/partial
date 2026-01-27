# What is Partial?
Partial is a purpose-built work management platform for hardware development. It connects engineers’ work items (tasks, deliverables, issues) directly to the parts they own, giving teams a single source of truth. Managers gain instant insight into program health, dependencies, and bottlenecks, while teams and the customer benefit from increased transparency and fewer status meetings.
## Key Features
### For Engineers:
* Track work items for parts they own
* Manage tasks, deliverables, and issues
* Collaborate with team members
* Update progress and status against program milestones
### For Program Managers:
* Monitor program status
* Track team performance and workload
* Identify bottlenecks and blockers
* Manage milestones and trace their dependencies
## Hardware-Specific Features
* Hierarchical part management to reflect the actual hardware assembly (component → subsystem → system)
* Work items (tasks, deliverables, issues) link to specific parts, enabling part-centric views rather than people-centric stories/epics
* Hardware-specific deliverable types (drawing, BOM, CoC, ATP, etc.)
* Hardware-specific issue types (defect, failure, requirement waiver, etc.)
* Cradle to grave ownership of parts and work items through required user assignments
* Program analytics, team workload visualizations, and dynamic burndown charts
* Engineering discipline-based team organization (mechanical, electrical, structural, etc.) rather than feature/product-based
## Technology Stack
* **Frontend:** Next.js, Tailwind CSS, Redux Toolkit, Redux Toolkit Query, Material UI Data Grid
* **Backend:** Node.js with Express, Prisma (PostgreSQL ORM), better-auth
* **Database:** PostgreSQL
* **Cloud:** Railway
* **CI/CD:** GitHub Actions (tests run automatically on every commit)

## CI/CD

This project uses GitHub Actions to automatically run tests on every commit and pull request. See [CI_CD.md](./CI_CD.md) for detailed information.

**Status:** ![CI](https://github.com/FionnRuder/partial/workflows/CI/badge.svg)

## Getting Started

### Prerequisites

Ensure you have these tools installed:

- Git
- Node.js (v18 or higher recommended)
- npm (Node Package Manager)
- PostgreSQL (download from [postgresql.org](https://www.postgresql.org/download/))
- PgAdmin (optional, for database management - download from [pgadmin.org](https://www.pgadmin.org/download/))

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/FionnRuder/partial.git
   cd partial
   ```

2. **Install dependencies in both client and server:**
   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```

3. **Set up the database:**
   ```bash
   cd server
   npx prisma generate
   npx prisma migrate dev --name init
   npm run seed
   ```

4. **Configure environment variables:**
   
   Create a `.env` file in the `server/` directory with:
   ```env
   NODE_ENV=development
   PORT=8000
   DATABASE_URL=postgresql://user:password@localhost:5432/partial
   SESSION_SECRET=your-session-secret-here
   BETTER_AUTH_SECRET=your-better-auth-secret-here
   BETTER_AUTH_URL=http://localhost:3000
   FRONTEND_URL=http://localhost:3000
   ```
   
   Create a `.env.local` file in the `client/` directory with:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   ```

5. **Run the project:**
   
   In one terminal, start the server:
   ```bash
   cd server
   npm run dev
   ```
   
   In another terminal, start the client:
   ```bash
   cd client
   npm run dev
   ```
   
   The application will be available at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000