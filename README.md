# What Does The Chef Recommend

A restaurant discovery platform that shows what the chef actually recommends at each restaurant.

## Deployment

**Railway URL**: https://web-production-55e0f.up.railway.app

### Environment Variables

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Automatically set by Railway PostgreSQL |
| `AUTH_SECRET` | Auto-generated |
| `ADMIN_EMAIL` | admin@248.ai |
| `ADMIN_PASSWORD` | chefrecommends2024 |

## Development

```bash
# Install dependencies
bun install

# Set up database
bun run scripts/init-db.ts

# Import restaurant data (optional)
bun run scripts/import-csv.ts <path-to-csv>

# Run development server
bun dev
```

## Tech Stack

- Next.js 16 (App Router)
- PostgreSQL (via Railway)
- NextAuth.js for admin authentication
- Tailwind CSS + shadcn/ui

## Database

PostgreSQL schema with two main tables:
- `restaurants` - Restaurant profiles with chef recommendations
- `claims` - Restaurant ownership claim requests

See `scripts/init-db.ts` for the full schema.
