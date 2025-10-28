# Azure Horizon Resort - Frontend

Discover harmony and elegance at Azure Horizon. From peaceful retreats surrounded by nature to indulgent luxury experiences, every moment is designed to refresh your soul.

## 🚀 Quick Start (Full Stack)

### Start Both Frontend & Backend
```bash
# Start both services with one command
pnpm fullstack

# Or manually:
./dev-start.sh start
```

### Test API Connectivity
```bash
pnpm test:api
```

### Individual Services
```bash
# Frontend only (requires backend running)
pnpm dev

# Check status
pnpm fullstack:status

# View logs
pnpm fullstack:logs

# Stop all services
pnpm fullstack:stop
```

## 🏗️ Architecture

- **Frontend**: Next.js 14 with TypeScript (Port 3000)
- **Backend**: Django REST API (Port 8000)
- **Database**: PostgreSQL (Docker)
- **Cache**: Redis (Docker)

## 📡 API Integration

The frontend is pre-configured to work with the Django backend at `http://localhost:8000`. See `BACKEND_COORDINATION.md` for detailed API documentation and integration guide.

### Key Features
- JWT Authentication with auto-refresh
- Real-time booking system
- Service management
- Payment integration (Stripe)
- Contact forms
- Review system

## 🔧 Development Scripts

- `pnpm dev` - Start frontend only
- `pnpm fullstack` - Start both frontend and backend
- `pnpm test:api` - Test API connectivity
- `pnpm fullstack:status` - Check service status

## 📚 Documentation

- `BACKEND_COORDINATION.md` - Full API integration guide
- Environment variables configured in `.env`
- Authentication handled by `hooks/useAuth.ts`