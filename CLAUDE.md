# whatdoesthechefrecommend.com

A public restaurant directory where each profile features "what the chef recommends" from the menu. Restaurant owners can claim profiles to add verified recommendations.

## Quick Start

```bash
# Install dependencies
bun install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your MongoDB URI

# Import sample data (requires MONGODB_URI)
make import-sample

# Start development server
make up
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI**: ShadCN + Tailwind CSS
- **Database**: MongoDB Atlas
- **Search**: MongoDB Atlas Search (autocomplete)
- **Auth**: NextAuth.js (admin only)
- **Hosting**: Vercel

## Project Structure

```
app/
├── page.tsx                    # Homepage with search
├── search/page.tsx             # Search results
├── [city]/[slug]/page.tsx      # Restaurant profile
├── claim/[id]/page.tsx         # Claim form
├── claim/success/page.tsx      # Claim confirmation
├── admin/                      # Admin dashboard
│   ├── page.tsx                # Dashboard home
│   ├── login/page.tsx          # Admin login
│   └── claims/page.tsx         # Review claims
└── api/
    ├── search/route.ts         # Search autocomplete
    ├── claims/route.ts         # Submit claim
    └── admin/claims/[id]/route.ts  # Approve/reject claims

components/
├── search-bar.tsx              # Autocomplete search
├── restaurant-card.tsx         # Restaurant display card
├── claim-form.tsx              # Claim submission form
└── ui/                         # ShadCN components

lib/
├── db.ts                       # MongoDB connection
├── auth.ts                     # NextAuth configuration
├── restaurants.ts              # Restaurant queries
├── claims.ts                   # Claim queries
├── types.ts                    # TypeScript types
└── utils.ts                    # Utilities

scripts/
├── import-csv.ts               # CSV import script
└── sample-data.csv             # Sample restaurant data
```

## Key Features

### Public Features
1. **Search**: Autocomplete search by restaurant name, city, or zip code
2. **Restaurant Profiles**: View restaurant details and chef recommendations
3. **Claim Flow**: Restaurant owners can claim their profile

### Admin Features
1. **Dashboard**: View stats on restaurants and claims
2. **Claim Review**: Approve or reject ownership claims
3. **Manual Verification**: Notes field for verification details

## Makefile Commands

| Command | Description |
|---------|-------------|
| `make up` / `make dev` | Start development server |
| `make build` | Build for production |
| `make test` | Run type check and linting |
| `make lint` | Run ESLint |
| `make import FILE=path.csv` | Import restaurants from CSV |
| `make import-sample` | Import sample data |

## Environment Variables

```env
# Required
MONGODB_URI=mongodb+srv://...

# NextAuth
AUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# Admin (defaults provided for development)
ADMIN_EMAIL=admin@248.ai
ADMIN_PASSWORD=chefrecommends2024
```

## CSV Import Format

```csv
name,street,city,state,zip,cuisine,phone,website,hours
"Joe's Pizza","123 Main St","Seattle","WA","98101","Italian,Pizza","206-555-0123","joespizza.com","11am-10pm"
```

## Atlas Search Setup (for autocomplete)

Create an index named `restaurant_search` on the `restaurants` collection:

```json
{
  "mappings": {
    "dynamic": false,
    "fields": {
      "name": {
        "type": "autocomplete",
        "tokenization": "edgeGram",
        "minGrams": 2,
        "maxGrams": 15
      },
      "address.city": { "type": "string" },
      "address.zip": { "type": "string" }
    }
  }
}
```

## User Stories

### Public (P1-P5)

| ID | User Story | Status |
|----|------------|--------|
| P1 | As a user, I can search for restaurants by name, city, or zip | Done |
| P2 | As a user, I can view a restaurant's profile with chef recommendation | Done |
| P3 | As a user, I can see if a restaurant is verified | Done |
| P4 | As an owner, I can submit a claim for my restaurant | Done |
| P5 | As an owner, I receive confirmation after claiming | Done |

### Admin (A1-A4)

| ID | User Story | Status |
|----|------------|--------|
| A1 | As admin, I can log in securely | Done |
| A2 | As admin, I can view claim statistics | Done |
| A3 | As admin, I can review pending claims | Done |
| A4 | As admin, I can approve/reject claims | Done |

### Deferred (Phase 2)

- D1: Email notifications for claim status
- D2: Owner portal to edit recommendations
- D3: Multiple recommendations per restaurant
- D4: Photo uploads
- D5: Geo-based "near me" search
