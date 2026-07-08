# infra/local/

Local development infrastructure for CLARA.

## Current Scope

```text
PostgreSQL runtime for services/api local development
safe local-only placeholder credentials
docker compose startup for migration and seed workflows
```

## Files

```text
docker-compose.yml
.env.example
README.md
```

## Start Local PostgreSQL

```bash
cd infra/local
docker compose up -d
```

Check container health:

```bash
docker compose ps
```

Expected connection values:

```text
host: 127.0.0.1
port: 5432
database: clara_api_dev
user: clara_user
password: clara_password_dev_only
```

These credentials are local development placeholders only. They are not production credentials.

## Stop Local PostgreSQL

```bash
cd infra/local
docker compose down
```

To remove local database data too:

```bash
cd infra/local
docker compose down -v
```

Use `down -v` only when you intentionally want to wipe local development data.

## API Integration Flow

After PostgreSQL is running:

```bash
cd services/api
cp .env.example .env
npm run db:check
npm run db:ready
npm run db:migrate
npm run db:seed
npm run dev
```

## Rules

```text
Local infra must not require production credentials.
Do not commit real .env files.
Do not reuse local placeholder credentials outside local development.
```
