# Next.js Monorepo

A modern, production-ready monorepo setup with Next.js frontend and Node.js/Express backend, managed by Turborepo and pnpm workspaces.

## 🏗️ Project Structure

```
nextjs-monorepo/
├── apps/
│   ├── frontend/          # Next.js 14 application (App Router)
│   └── backend/           # Express.js API server
├── packages/
│   └── typescript-config/ # Shared TypeScript configurations
├── package.json           # Root package.json with workspace scripts
├── pnpm-workspace.yaml    # pnpm workspace configuration
└── turbo.json            # Turborepo pipeline configuration
```

## ✨ Features

- **Monorepo Architecture**: Efficiently manage multiple applications in a single repository
- **Turborepo**: Fast build system with intelligent caching and parallelization
- **pnpm Workspaces**: Fast, disk space efficient package management
- **TypeScript**: Full TypeScript support across all packages
- **Next.js 14**: Latest Next.js with App Router for the frontend
- **Express.js**: Lightweight and flexible backend API
- **Hot Reload**: Fast refresh for both frontend and backend during development
- **Shared Configurations**: Reusable TypeScript configs across packages

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm 8+ installed (if not: `npm install -g pnpm`)

### Installation

1. Clone the repository or navigate to the project directory:
```bash
cd /Users/avinashmanitripathi/Documents/nextjs-monorepo
```

2. Install all dependencies:
```bash
pnpm install
```

### Development

Run both frontend and backend in development mode:

```bash
pnpm dev
```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:4000

### Running Individual Apps

**Frontend only:**
```bash
cd apps/frontend
pnpm dev
```

**Backend only:**
```bash
cd apps/backend
pnpm dev
```

## 📦 Available Scripts

From the root directory:

- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all apps for production
- `pnpm start` - Start all apps in production mode
- `pnpm lint` - Run linting across all packages
- `pnpm clean` - Clean build artifacts and node_modules

## 🏛️ Architecture

### Frontend (Next.js)

- **Location**: `apps/frontend`
- **Port**: 3000
- **Framework**: Next.js 14 with App Router
- **Styling**: CSS Modules
- **Features**:
  - Server-side rendering
  - API integration with backend
  - Modern, responsive UI
  - TypeScript support

### Backend (Express)

- **Location**: `apps/backend`
- **Port**: 4000
- **Framework**: Express.js
- **Features**:
  - RESTful API endpoints
  - CORS enabled
  - TypeScript support
  - Hot reload with tsx

### API Endpoints

- `GET /` - API information
- `GET /health` - Health check endpoint
- `GET /api/hello` - Sample hello endpoint
- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user

## 🔧 Configuration

### Environment Variables

**Backend** (`apps/backend/.env`):
```env
PORT=4000
NODE_ENV=development
```

Copy `.env.example` to `.env` in the backend directory to get started.

### TypeScript Configurations

Shared TypeScript configurations are available in `packages/typescript-config`:
- `base.json` - Base configuration
- `nextjs.json` - Next.js specific configuration
- `node.json` - Node.js specific configuration

## 📚 Adding New Packages

### Adding a New App

1. Create a new directory in `apps/`
2. Add a `package.json` with appropriate scripts
3. Update `turbo.json` if needed

### Adding a New Shared Package

1. Create a new directory in `packages/`
2. Add a `package.json` with `"name": "@repo/package-name"`
3. Reference it in other packages using `"@repo/package-name": "workspace:*"`

## 🔨 Built With

- [Next.js](https://nextjs.org/) - React framework
- [Express.js](https://expressjs.com/) - Backend framework
- [Turborepo](https://turbo.build/) - Build system
- [pnpm](https://pnpm.io/) - Package manager
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## 📝 Best Practices

1. **Shared Code**: Place reusable code in `packages/`
2. **Type Safety**: Use TypeScript across all packages
3. **Dependencies**: Keep dependencies up to date
4. **Caching**: Turborepo automatically caches builds - commit `turbo.json`
5. **Environment Variables**: Never commit `.env` files

## 🤝 Contributing

1. Create a new branch for your feature
2. Make your changes
3. Run `pnpm build` to ensure everything builds
4. Run `pnpm lint` to check for issues
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🆘 Troubleshooting

### Port Already in Use

If ports 3000 or 4000 are already in use:
- Frontend: Change the port in `apps/frontend/package.json`
- Backend: Change `PORT` in `apps/backend/.env`

### Dependencies Not Installing

Try:
```bash
pnpm store prune
rm -rf node_modules
pnpm install
```

### Build Errors

Clear Turborepo cache:
```bash
rm -rf .turbo
pnpm build
```

## 📞 Support

For issues or questions, please contact the development team.

