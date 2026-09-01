# StayElite

StayElite is an Airbnb-style accommodation platform with a Next.js App Router frontend and Spring Boot API. The repository currently uses a combined layout: Next.js lives at the root (`app/`, `components/`, `services/`) and Spring Boot lives under `src/`.

## Requirements

- Docker Engine 24+ and Docker Compose v2
- Node.js 20+ for running the frontend outside Docker
- Java 17 and Maven 3.9+ for running the backend outside Docker
- A Stripe account for payments

## Local Development With Docker

1. Copy the environment template:

```bash
cp .env.example .env
```

2. Set at least `JWT_SECRET` and `JWT_REFRESH_SECRET` in `.env`. Stripe keys can remain empty until payments are needed.

3. Start the stack:

```bash
docker compose up --build
```

The application is available at:

- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- PostgreSQL: localhost:5432
- Redis: localhost:6379

Flyway runs automatically when the backend starts. Data persists in the `postgres_data` and `redis_data` volumes.

To stop the stack while keeping data:

```bash
docker compose down
```

To remove containers and local data:

```bash
docker compose down -v
```

## Local Development Without Docker

Start PostgreSQL and Redis separately, then configure `src/main/resources/application.yml` or environment variables. Run the API with:

```bash
mvn spring-boot:run
```

Run the frontend in another terminal:

```bash
npm ci
npm run dev
```

## Environment Variables

Use [.env.example](.env.example) as the complete reference. Never commit `.env`, `.env.local`, Stripe secret keys, database passwords, or JWT secrets. `NEXT_PUBLIC_*` values are embedded into the browser bundle during `next build`, so production values must be available when the frontend image is built.

The Spring API reads database, Redis, JWT, Stripe, and CORS settings from environment variables. `APP_CORS_ALLOWED_ORIGINS` accepts comma-separated origins.

## Stripe Webhooks

For local webhook delivery, install the Stripe CLI, authenticate it, and run:

```bash
stripe listen --forward-to localhost:8080/api/payments/webhook
```

Copy the displayed `whsec_...` value into `STRIPE_WEBHOOK_SECRET`. Use Stripe test-mode keys in local development.

## Production Deployment: Single Ubuntu VPS

1. Install Docker Engine and the Compose plugin on Ubuntu 22.04.
2. Clone the repository on the VPS.
3. Create a protected environment file:

```bash
cp .env.example .env
chmod 600 .env
```

4. Set production values, including a real domain in `APP_CORS_ALLOWED_ORIGINS`, strong JWT/database secrets, Stripe live keys, and:

```text
DB_URL=jdbc:postgresql://postgres:5432/stayelite
REDIS_HOST=redis
NEXT_PUBLIC_API_URL=https://api.example.com/api
```

5. Build and start the production overlay:

```bash
docker compose --env-file .env -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

The production overlay keeps PostgreSQL and Redis private, exposes the frontend on port 3000, restarts services unless stopped, limits resources, and waits for health checks before starting dependent services. Put Nginx or Caddy in front of the frontend for TLS, domain routing, request limits, and security headers. Proxy `/api` to the backend service on port 8080 inside the Compose network and proxy the site to the frontend on port 3000.

Check service state and logs:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml ps
docker compose -f docker-compose.yml -f docker-compose.prod.yml logs -f backend
```

Back up PostgreSQL regularly. The Compose volume is persistent, but it is not a backup strategy.

## CI

GitHub Actions runs on pushes to `main` and pull requests:

- `npm run lint`
- TypeScript type-checking
- Maven tests with Testcontainers dependencies available
- Frontend and backend Docker image builds after checks pass

Workflow: [.github/workflows/ci.yml](.github/workflows/ci.yml)

## Useful Commands

```bash
npm run lint
npm run build
mvn test
```

The frontend production image uses Next.js standalone output and runs as the non-root `nextjs` user. The backend image uses a Maven builder and Eclipse Temurin 17 JRE Alpine runtime as the non-root `spring` user.
