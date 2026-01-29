# Club Website (Vereinswebsite)

Self-hostable Next.js (App Router) + TypeScript club website with member area, file storage, PostgreSQL + Prisma, Auth (credentials). Built for EU/German basics.

Quick start

1. Copy `.env.example` to `.env` and edit values.
2. Start services with Docker Compose:

```bash
docker compose up -d
```

3. Install dependencies locally (optional for development):

```bash
npm install
```

4. Generate Prisma client and run migrations, then seed:

```bash
npm run prisma:generate
# Create migration if needed (dev): npx prisma migrate dev --name init
npm run seed
```

5. Run dev server:

```bash
npm run dev
```

Production with Docker

```bash
docker build -t club-website .
docker run -e DATABASE_URL="postgresql://postgres:password@<pg-host>:5432/clubdb" -e NEXTAUTH_SECRET=... -p 3000:3000 club-website
```

Important notes
- Storage: files are stored under `./storage` on the host (mounted in docker-compose). Back up that folder and the Postgres volume (`pgdata`).
- Admin user seeded: `admin@example.com` / `ChangeMe123!` — change immediately.
- HTTPS: In production put behind HTTPS proxy and set `FORCE_HTTPS=true`. NextAuth uses `NEXTAUTH_URL` and `NEXTAUTH_SECRET`—set secure values.

Folder structure (important files)
- `src/` — Next.js app
- `prisma/schema.prisma` — DB schema
- `prisma/seed.ts` — seed data
- `storage/` — file storage (create or mounted by Docker)
- `docker-compose.yml` — dev services

Security
- Passwords hashed with bcrypt
- Role-based access (ADMIN, BOARD, MEMBER)
- Downloads protected by session check in API
- Rate-limit for login (in-memory)

Tests

```bash
npm run test
```

If you need help running or extending, tell me which step to perform next.
# GKFWebsite