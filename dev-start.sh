#!/bin/bash

# Azure Horizon Resort - Full Stack Development Setup Script
# This script helps you start both the Django backend and Next.js frontend

echo "🚀 Starting Azure Horizon Resort Development Environment"
echo "================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Backend directory
BACKEND_DIR="/mnt/d/Projects/playground/backend_azure_horizon"
FRONTEND_DIR="/mnt/d/Projects/playground/frontend_azure_horizon"

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to start backend
start_backend() {
    echo -e "${BLUE}📡 Starting Django Backend...${NC}"
    
    if ! check_port 8000; then
        cd "$BACKEND_DIR"
        
        # Check if Docker containers are running
        echo -e "${YELLOW}🐳 Starting Docker services (PostgreSQL, Redis)...${NC}"
        docker-compose up -d postgres redis
        
        # Wait a moment for services to start
        sleep 5
        
        # Start Django development server in background
        echo -e "${YELLOW}🐍 Starting Django development server...${NC}"
        python manage.py migrate --noinput
        nohup python manage.py runserver 8000 > django.log 2>&1 &
        DJANGO_PID=$!
        echo $DJANGO_PID > django.pid
        
        echo -e "${GREEN}✅ Django backend started on http://localhost:8000${NC}"
        echo -e "${GREEN}   Process ID: $DJANGO_PID${NC}"
        echo -e "${GREEN}   Logs: $BACKEND_DIR/django.log${NC}"
    else
        echo -e "${YELLOW}⚠️  Backend already running on port 8000${NC}"
    fi
}

# Function to start frontend
start_frontend() {
    echo -e "${BLUE}⚛️  Starting Next.js Frontend...${NC}"
    
    if ! check_port 3000; then
        cd "$FRONTEND_DIR"
        
        # Start Next.js development server in background
        echo -e "${YELLOW}📦 Starting Next.js development server...${NC}"
        nohup pnpm dev > nextjs.log 2>&1 &
        NEXTJS_PID=$!
        echo $NEXTJS_PID > nextjs.pid
        
        echo -e "${GREEN}✅ Next.js frontend started on http://localhost:3000${NC}"
        echo -e "${GREEN}   Process ID: $NEXTJS_PID${NC}"
        echo -e "${GREEN}   Logs: $FRONTEND_DIR/nextjs.log${NC}"
    else
        echo -e "${YELLOW}⚠️  Frontend already running on port 3000${NC}"
    fi
}

# Function to stop services
stop_services() {
    echo -e "${RED}🛑 Stopping services...${NC}"
    
    # Stop Django
    if [ -f "$BACKEND_DIR/django.pid" ]; then
        DJANGO_PID=$(cat "$BACKEND_DIR/django.pid")
        kill $DJANGO_PID 2>/dev/null
        rm -f "$BACKEND_DIR/django.pid"
        echo -e "${GREEN}✅ Django backend stopped${NC}"
    fi
    
    # Stop Next.js
    if [ -f "$FRONTEND_DIR/nextjs.pid" ]; then
        NEXTJS_PID=$(cat "$FRONTEND_DIR/nextjs.pid")
        kill $NEXTJS_PID 2>/dev/null
        rm -f "$FRONTEND_DIR/nextjs.pid"
        echo -e "${GREEN}✅ Next.js frontend stopped${NC}"
    fi
    
    # Stop Docker containers
    cd "$BACKEND_DIR"
    docker-compose down
    echo -e "${GREEN}✅ Docker services stopped${NC}"
}

# Function to show status
show_status() {
    echo -e "${BLUE}📊 Service Status${NC}"
    echo "======================="
    
    # Check backend
    if check_port 8000; then
        echo -e "${GREEN}✅ Backend (Django):${NC} Running on http://localhost:8000"
    else
        echo -e "${RED}❌ Backend (Django):${NC} Not running"
    fi
    
    # Check frontend
    if check_port 3000; then
        echo -e "${GREEN}✅ Frontend (Next.js):${NC} Running on http://localhost:3000"
    else
        echo -e "${RED}❌ Frontend (Next.js):${NC} Not running"
    fi
    
    # Check Docker services
    cd "$BACKEND_DIR"
    if docker-compose ps | grep -q "Up"; then
        echo -e "${GREEN}✅ Database/Redis:${NC} Docker containers running"
    else
        echo -e "${RED}❌ Database/Redis:${NC} Docker containers not running"
    fi
}

# Main script logic
case "$1" in
    "start")
        start_backend
        sleep 3
        start_frontend
        sleep 2
        show_status
        echo ""
        echo -e "${GREEN}🎉 Development environment is ready!${NC}"
        echo -e "${BLUE}📖 Frontend:${NC} http://localhost:3000"
        echo -e "${BLUE}🔧 Backend API:${NC} http://localhost:8000"
        echo -e "${BLUE}👨‍💼 Django Admin:${NC} http://localhost:8000/admin/"
        ;;
    "stop")
        stop_services
        ;;
    "status")
        show_status
        ;;
    "logs")
        echo -e "${BLUE}📋 Recent Logs${NC}"
        echo "======================="
        echo -e "${YELLOW}Django Backend:${NC}"
        tail -20 "$BACKEND_DIR/django.log" 2>/dev/null || echo "No logs found"
        echo ""
        echo -e "${YELLOW}Next.js Frontend:${NC}"
        tail -20 "$FRONTEND_DIR/nextjs.log" 2>/dev/null || echo "No logs found"
        ;;
    *)
        echo "Usage: $0 {start|stop|status|logs}"
        echo ""
        echo -e "${YELLOW}Commands:${NC}"
        echo "  start  - Start both backend and frontend services"
        echo "  stop   - Stop all services"
        echo "  status - Show current status of all services"
        echo "  logs   - Show recent logs from both services"
        echo ""
        echo -e "${BLUE}Quick Start:${NC}"
        echo "  ./dev-start.sh start"
        exit 1
        ;;
esac