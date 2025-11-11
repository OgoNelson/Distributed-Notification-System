.PHONY: help build up down restart logs clean ps shell test setup-env

# Default target
help:
	@echo "Distributed Notification System - Docker Commands"
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@echo "  setup-env      Create environment files from examples"
	@echo "  build          Build all Docker images"
	@echo "  up             Start all services"
	@echo "  down           Stop all services"
	@echo "  restart        Restart all services"
	@echo "  logs           View logs from all services"
	@echo "  logs-gateway   View logs from gateway service"
	@echo "  logs-email     View logs from email service"
	@echo "  logs-template  View logs from template service"
	@echo "  logs-rabbitmq  View logs from RabbitMQ"
	@echo "  logs-mysql     View logs from MySQL"
	@echo "  clean          Stop services and remove volumes"
	@echo "  ps             List running containers"
	@echo "  shell-gateway  Access gateway container shell"
	@echo "  shell-email    Access email service container shell"
	@echo "  shell-template Access template service container shell"
	@echo "  test           Run tests in all services"
	@echo ""
	@echo "Development Mode (Hot Reloading):"
	@echo "  dev            Start services in development mode with hot reload"
	@echo "  dev-build      Build and start in development mode"
	@echo "  dev-down       Stop development services"
	@echo "  dev-logs       View development logs"
	@echo "  dev-logs-email View email service dev logs"
	@echo "  dev-logs-template View template service dev logs"

# Setup environment files
setup-env:
	@chmod +x setup-env.sh
	@./setup-env.sh

# Build all images
build:
	docker-compose build

# Start all services
up:
	docker-compose up -d

# Start all services with build
up-build:
	docker-compose up -d --build

# Stop all services
down:
	docker-compose down

# Restart all services
restart:
	docker-compose restart

# View logs
logs:
	docker-compose logs -f

logs-gateway:
	docker-compose logs -f gateway

logs-email:
	docker-compose logs -f email-service

logs-template:
	docker-compose logs -f template-service

logs-rabbitmq:
	docker-compose logs -f rabbitmq

logs-mysql:
	docker-compose logs -f mysql

# Clean up
clean:
	docker-compose down -v
	docker system prune -f

# List containers
ps:
	docker-compose ps

# Access container shells
shell-gateway:
	docker-compose exec gateway sh

shell-email:
	docker-compose exec email-service sh

shell-template:
	docker-compose exec template-service sh

shell-mysql:
	docker-compose exec mysql mysql -u template_user -p

# Development mode (with hot reloading)
dev:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

dev-build:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

dev-down:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml down

# Development logs
dev-logs:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f

dev-logs-email:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f email-service

dev-logs-template:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f template-service

# Health check
health:
	@echo "Checking service health..."
	@curl -f http://localhost:3000/health || echo "Gateway: DOWN"
	@curl -f http://localhost:3001/health || echo "Email Service: DOWN"
	@curl -f http://localhost:3002/health || echo "Template Service: DOWN"

# Rebuild specific service
rebuild-gateway:
	docker-compose build --no-cache gateway
	docker-compose up -d gateway

rebuild-email:
	docker-compose build --no-cache email-service
	docker-compose up -d email-service

rebuild-template:
	docker-compose build --no-cache template-service
	docker-compose up -d template-service

rebuild-user:
	docker-compose build --no-cache user-service
	docker-compose up -d user-service

# Laravel specific commands
laravel-migrate:
	docker-compose exec user-service php artisan migrate

laravel-migrate-fresh:
	docker-compose exec user-service php artisan migrate:fresh --seed

laravel-seed:
	docker-compose exec user-service php artisan db:seed

laravel-cache:
	docker-compose exec user-service php artisan config:cache
	docker-compose exec user-service php artisan route:cache
	docker-compose exec user-service php artisan view:cache

laravel-cache-clear:
	docker-compose exec user-service php artisan config:clear
	docker-compose exec user-service php artisan route:clear
	docker-compose exec user-service php artisan view:clear
	docker-compose exec user-service php artisan cache:clear

laravel-shell:
	docker-compose exec user-service sh

laravel-tinker:
	docker-compose exec user-service php artisan tinker

laravel-logs:
	docker-compose logs -f user-service

laravel-queue-work:
	docker-compose exec user-service php artisan queue:work

laravel-composer:
	docker-compose exec user-service composer install

laravel-octane-reload:
	docker-compose exec user-service php artisan octane:reload

laravel-octane-status:
	docker-compose exec user-service php artisan octane:status

# Install all dependencies (root + services)
install:
	pnpm install
	cd services/gateway-service && pnpm install
	cd services/template-service && pnpm install
	cd services/email-service && pnpm install
	docker-compose exec user-service composer install

# Format all code (prettier for JS/TS, pint for PHP)
format-all:
	pnpm run format
	docker-compose exec user-service ./vendor/bin/pint

# Run all tests
test-all:
	pnpm -r run test
	docker-compose exec user-service php artisan test
