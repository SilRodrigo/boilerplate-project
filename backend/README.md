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
| `CORS_ORIGIN` | any origin | Comma separated list of allowed origins. **Set it in production.** |
| `TRUST_PROXY` | `0` | Number of proxies in front of the app (nginx, load balancer). Required for correct client IPs in the rate limiter. |
| `RATE_LIMIT_WINDOW_MS` | `60000` | Rate limit window. |
| `RATE_LIMIT_MAX` | `300` | Max requests per IP per window. |
| `REQUEST_TIMEOUT_MS` | `30000` | Max time to receive a request. |
| `SHUTDOWN_TIMEOUT_MS` | `10000` | Max time to drain connections on `SIGTERM`/`SIGINT` before forcing exit. |

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
