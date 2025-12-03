# Quick Start Guide

Get up and running with the Next.js Monorepo in 5 minutes!

## 1. Install Dependencies

```bash
cd /Users/avinashmanitripathi/Documents/nextjs-monorepo
pnpm install
```

If you don't have pnpm installed:
```bash
npm install -g pnpm
```

## 2. Setup Backend Environment

```bash
cd apps/backend
cp .env.example .env
cd ../..
```

## 3. Start Development Servers

From the root directory:

```bash
pnpm dev
```

This will start:
- ✅ **Frontend**: http://localhost:3000
- ✅ **Backend**: http://localhost:4000

## 4. Test the Setup

Open your browser and visit:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- Health Check: http://localhost:4000/health

You should see the frontend connecting to the backend and displaying a welcome message!

## 5. Next Steps

### Modify the Frontend
Edit `apps/frontend/src/app/page.tsx` and save - changes will hot reload!

### Modify the Backend
Edit `apps/backend/src/index.ts` and save - the server will automatically restart!

### Add New Features
- Add new API endpoints in `apps/backend/src/index.ts`
- Create new pages in `apps/frontend/src/app/`
- Add shared packages in `packages/`

## Common Commands

```bash
# Development
pnpm dev          # Start all apps in dev mode

# Building
pnpm build        # Build all apps for production

# Production
pnpm start        # Run all apps in production mode

# Linting
pnpm lint         # Run linter on all packages

# Cleanup
pnpm clean        # Remove build artifacts
```

## Troubleshooting

### Port Already in Use?

**Frontend (3000)**:
Kill the process using port 3000:
```bash
lsof -ti:3000 | xargs kill -9
```

**Backend (4000)**:
Kill the process using port 4000:
```bash
lsof -ti:4000 | xargs kill -9
```

### Dependencies Issue?

Clear everything and reinstall:
```bash
rm -rf node_modules apps/*/node_modules packages/*/node_modules
pnpm install
```

### Build Cache Issue?

Clear Turborepo cache:
```bash
rm -rf .turbo apps/*/.turbo
pnpm build
```

## Project Structure Overview

```
nextjs-monorepo/
├── apps/
│   ├── frontend/       → Next.js app (port 3000)
│   └── backend/        → Express API (port 4000)
├── packages/
│   └── typescript-config/  → Shared TS configs
├── pnpm-workspace.yaml     → Workspace config
└── turbo.json             → Turborepo config
```

## What's Included?

✅ Next.js 14 with App Router  
✅ Express.js backend with TypeScript  
✅ Turborepo for fast builds  
✅ pnpm workspaces  
✅ Shared TypeScript configurations  
✅ Hot reload for both frontend and backend  
✅ Beautiful, modern UI  
✅ Sample API endpoints  
✅ CORS enabled  
✅ Production-ready setup  

Happy coding! 🚀

