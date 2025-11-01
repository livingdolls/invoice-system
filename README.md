# Invoice System

Sistem manajemen invoice berbasis web yang dibangun dengan Go (Gin) untuk backend dan React TypeScript untuk frontend.

## 🛠️ Tech Stack

### Backend
- **Go 1.23+** - Programming language
- **Gin** - Web framework
- **GORM** - ORM untuk database
- **MySQL 8.1** - Database

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Query** - Data fetching
- **React Router** - Navigation
- **Zustand** - State management
- **React-to-Print** - PDF generation

## 📋 Prerequisites

Pastikan Anda sudah menginstall:

- **Node.js** v20+ dan npm
- **Go** v1.23+
- **MySQL** v8.1+
- **Docker & Docker Compose**

## Quick Start dengan Docker Compose (Recommended)

### Jalankan Aplikasi

# Build dan jalankan semua services
docker compose up --build

# Atau jalankan di background
docker compose up -d --build


### Access Aplikasi
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **MySQL**: localhost:3306

### Stop Services

# Stop semua services
docker compose down

## 🔧 Setup Manual

### 1. Database Setup

sql
-- Buat database MySQL
CREATE DATABASE invoice;

-- Login sebagai root (sesuai config)
mysql -u root -p
# Password: secret


### Backend Setup


# Masuk ke direktori backend
cd backend

# Install dependencies
go mod tidy

# Jalankan aplikasi (pastikan MySQL sudah running)
go run cmd/api/main.go

# Atau build dulu
go build -o bin/invoice-api cmd/api/main.go
./bin/invoice-api


**Konfigurasi Backend** (`backend/config/config.yaml`):
yaml
database:
  driver: "mysql"
  host: "mysql"           # Untuk Docker / "localhost" untuk manual
  port: "3306"
  user: "root"
  password: "secret"
  name: "invoice"
  max_open_cons: 10
  max_idle_cons: 5
  max_life_time: 5

server:
  port: 3000


### 3. Frontend Setup


# Masuk ke direktori frontend  
cd frontend

# Install dependencies
npm install

# Jalankan development server
npm run dev

# Atau build untuk production
npm run build
npm run preview


## 📁 Struktur Project


invoice-system/
├── backend/
│   ├── cmd/api/main.go           # Entry point
│   ├── config/config.yaml        # Database & server config
│   ├── internal/
│   │   ├── applications/         # Business logic layer
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   ├── mapper/          # Data mapping utilities
│   │   │   ├── ports/           # Interface definitions
│   │   │   └── service/         # Business services
│   │   ├── domain/              # Domain models
│   │   │   ├── customer.go
│   │   │   ├── invoice.go
│   │   │   └── item.go
│   │   └── infra/               # Infrastructure layer
│   │       ├── adapter/http/    # HTTP handlers & routing
│   │       ├── db/             # Database connection & models
│   │       ├── logger/         # Logging configuration
│   │       └── server/         # Server setup
│   ├── scripts/wait-for-it.sh   # Database wait script
│   ├── go.mod
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── ui/             # Reusable UI components
│   │   │   ├── invoices/       # Invoice-specific components
│   │   │   └── items/          # Item management components
│   │   ├── pages/              # Page components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── types/              # TypeScript type definitions
│   │   ├── utils/              # Utility functions
│   │   ├── stores/             # Zustand state stores
│   │   └── repository/         # API client functions
│   ├── public/                 # Static assets
│   ├── nginx.conf              # Nginx configuration
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml           # Docker orchestration
└── README.md


## 🌐 API Endpoints

### Base URL
- Local: `http://localhost:3000`
- Docker: `http://localhost:3000`

## 🔄 Development Workflow

### Docker Development (Recommended)


# Start all services
docker compose up -d

# View logs
docker compose logs -f                    # All services
docker compose logs -f backend            # Backend only
docker compose logs -f frontend           # Frontend only

# Rebuild specific service
docker compose build backend --no-cache
docker compose build frontend --no-cache

# Reset database
docker compose down -v
docker compose up -d

# Stop everything
docker compose down


### Manual Development


# Terminal 1: Start Database
sudo systemctl start mysql
# atau
docker run --name mysql-dev -e MYSQL_ROOT_PASSWORD=secret -e MYSQL_DATABASE=invoice -p 3306:3306 -d mysql:8.1

# Terminal 2: Start Backend
cd backend
go run cmd/api/main.go
or use MakeFile
make run => run program
make test => test program
make build => build

# Terminal 3: Start Frontend
cd frontend
npm run dev


