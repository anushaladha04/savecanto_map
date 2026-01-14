# NOVA X SAVECANTO

Collaboration between Nova, Tech for Good at UCLA and NPO SaveCantonese.

## Project Structure

```text
savecanto_map/
├─ backend/                      # Google Apps Script backend
│  └─ apps-script/
│     └─ src/
│        ├─ appsscript.json     # Apps Script project config
│        ├─ config.js           # Sheets & API configuration
│        ├─ email.js            # Email notifications / alerts
│        ├─ migration.js        # Data migration helpers
│        ├─ moveApprovedRows.js # Sheet data management
│        ├─ routes.js           # HTTP endpoints
│        └─ verifyWebsites.js   # Website verification
│
└─ frontend/                     # Next.js frontend (map + table UI)
   ├─ public/                    # Static assets (images, icons)
   └─ src/
      ├─ app/
      │  ├─ map/                 # Interactive map experience
      │  │  ├─ components/       # Base map, clusters, pins, side panel
      │  │  ├─ hooks/            # useCsvData, useFilters, useZoom, etc.
      │  │  └─ utils/            # Cluster, filter, geo helpers
      │  └─ table/               # Program table view + filters
      └─ lib/                    # Shared frontend utilities
         └─ utils.ts
```

# Environment Setup

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Google Apps Script Backend

This is the backend API for SaveCanto Map, built with Google Apps Script and managed in `backend/apps-script/src`.

Key files:

- `appsscript.json` – Apps Script project configuration
- `config.js` – sheet IDs, ranges, and other config
- `routes.js` – HTTP endpoints for the web app
- `moveApprovedRows.js` – moves approved rows between sheets
- `verifyWebsites.js` – checks and validates program websites

## Getting Started

First, install clasp (Google Apps Script CLI):

```bash
npm install -g @google/clasp
```

Then, enable the Apps Script API:

1. Visit https://script.google.com/home/usersettings
2. Toggle ON "Google Apps Script API"

Authenticate and link this folder:

```bash
cd backend/apps-script
clasp login           # one-time Google auth
clasp open            # opens the linked Apps Script project
```

## Syncing Code

Pull the latest code from Apps Script into this repo:

```bash
cd backend/apps-script
clasp pull
```

Push local changes up to Apps Script:

```bash
cd backend/apps-script
clasp push
```

Your test URL is available from https://script.google.com → Deploy → Test deployments (it looks like `https://script.google.com/macros/s/.../dev`).
