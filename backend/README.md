# Boilerplate Nodejs + Express + Typescript + Prisma

## Stacks
* Nodejs
* Express
* Prisma
* Typescript
* PostgreSQL
* SOLID Principles
* Testing With Jest + Supertest

## Clone & Open
```
    git clone https://github.com/dedaldinodev4/api-node-prisma-ts-boilerplate.git
    cd api-node-prisma-ts-boilerplate
```
## Install & Run
```
  yarn install or npm install or pnpm install
  yarn server:dev or npm run server:dev or pnpm run server:dev
```

For production, build once and start the compiled app:
```
  npm run build
  npm start
```
`npm run build` wipes `dist` before compiling, so modules deleted from `src` are never loaded by the container.

## Tests
```
  yarn test:dev or npm run test:dev or pnpm run test:dev
```

## Environment variables

| Variable | Default | Description |
| --- | --- | --- |
| `DATABASE_URL` | — | PostgreSQL connection string. Add `?connection_limit=N` to size the Prisma pool. |
| `PORT_APP` | `3333` | HTTP port. |
| `NODE_ENV` | — | `production` switches logs to the `combined` format. |
| `JWT_SECRET` | — | **Required.** Secret used to sign access tokens. The server refuses to start without it. |
| `JWT_EXPIRES_IN` | `1d` | Access token lifetime (`15m`, `12h`, `7d`...). |
| `SEED_ADMIN_EMAIL` | `admin@example.com` | Admin created by `npm run prisma:seed`. |
| `SEED_ADMIN_PASSWORD` | — | Password for the seeded admin. Required by the seed. |
| `CORS_ORIGIN` | any origin | Comma separated list of allowed origins. **Set it in production.** |
| `TRUST_PROXY` | `0` | Number of proxies in front of the app (nginx, load balancer). Required for correct client IPs in the rate limiter. |
| `RATE_LIMIT_WINDOW_MS` | `60000` | Rate limit window. |
| `RATE_LIMIT_MAX` | `300` | Max requests per IP per window. |
| `AUTH_RATE_LIMIT_MAX` | `10` | Failed login attempts per IP every 15 minutes. |
| `REQUEST_TIMEOUT_MS` | `30000` | Max time to receive a request. |
| `SHUTDOWN_TIMEOUT_MS` | `10000` | Max time to drain connections on `SIGTERM`/`SIGINT` before forcing exit. |

## Authentication

JWT (HS256) authentication with a `User` model (`email`, bcrypt `password`, `userType`: `ADMIN` | `USER`).

| Route | Description |
| --- | --- |
| `POST /api/v1/user/auth` | Body `{ email, password }`. Returns `{ accessToken, user }`. |
| `GET /api/v1/user/me` | Returns the authenticated user. Requires `Authorization: Bearer <token>`. |

Create the first admin after `prisma:db-push`:
```
  npm run prisma:seed
```
It uses `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` and never overwrites an existing user.

To protect a route, add the middlewares from `src/middlewares`:
```ts
import { authMiddleware, adminMiddleware } from '../../middlewares';

exampleRoutes.route('/')
    .get(authMiddleware, exampleListController('handle'))
    .post(authMiddleware, adminMiddleware, exampleCreateController('handle'));
```
`authMiddleware` puts the user on `request.user` (type controllers with `IAuthController` to read it). The password hash never leaves the repository: `IUser` has no password field, and only `findByEmailWithPassword` returns it.

Use cases can throw `HttpError(message, status)` (from `src/helpers`) to control the status code returned by `errorResponse`.

## List endpoints

List routes accept `page`, `pageSize`, `filter` and `order` query params:

```
GET /api/v1/example?page=2&pageSize=20&filter={"name":{"contains":"foo","mode":"insensitive"}}&order={"createdAt":"desc"}
```

* Pagination happens in the database (`skip`/`take`) and `pageSize` is capped at 100.
* `filter` and `order` are sanitized by `parseListParams`: only the fields each controller allows are kept. For filters, only scalar operators (`equals`, `not`, `in`, `notIn`, `lt`, `lte`, `gt`, `gte`, `contains`, `startsWith`, `endsWith`, `mode`) are accepted, and relations and `AND`/`OR`/`NOT` are dropped.
* Each module declares its allowed fields in its DTO (e.g. `EXAMPLE_FILTER_FIELDS`, `EXAMPLE_ORDER_FIELDS`) and passes them to `parseListParams`. Without them, filter and order are empty.

## Production notes

The server ships with `helmet`, `compression`, CORS, rate limiting, body size limits (100kb), JSON 404/error handlers and graceful shutdown. When scaling out:

* Run one process per CPU core (PM2 cluster mode or multiple replicas). The app is stateless.
* The rate limiter keeps counters in memory per process. Use a shared store (e.g. `rate-limit-redis`) with multiple instances.
* Keep total DB connections under the PostgreSQL limit: tune `connection_limit` or put PgBouncer in front.
* `contains` filters on large text columns need an index (e.g. `pg_trgm`) to stay fast.
