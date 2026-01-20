.PHONY: up down test dev build lint import

# Start the development server
up:
	bun dev

dev: up

# Stop the development server (for docker-compose parity)
down:
	@echo "No services to stop (not using Docker)"

# Run type checking and linting
test:
	bun run lint
	bunx tsc --noEmit

# Build for production
build:
	bun run build

# Lint the codebase
lint:
	bun run lint

# Import restaurants from CSV
# Usage: make import FILE=path/to/restaurants.csv
import:
	@if [ -z "$(FILE)" ]; then \
		echo "Usage: make import FILE=path/to/restaurants.csv"; \
		exit 1; \
	fi
	bun run scripts/import-csv.ts $(FILE)

# Import sample data
import-sample:
	bun run scripts/import-csv.ts scripts/sample-data.csv
