.PHONY: help format lint lint-md type-check clean check

help:
	@echo "NeuralAtlas Development Commands"
	@echo ""
	@echo "  make format      - Format all code (Python)"
	@echo "  make lint        - Lint all code (Python + JS + Markdown)"
	@echo "  make lint-md     - Lint only markdown files"
	@echo "  make type-check  - Run type checkers (Python + TS)"
	@echo "  make clean       - Remove build artifacts"
	@echo "  make check       - Run all checks (format + lint + type)"

# Format everything
format:
	@echo "Formatting backend..."
	cd backend && ruff format .
	@echo "Backend formatted"

# Lint everything
lint: lint-md
	@echo "Linting backend..."
	cd backend && ruff check --fix .
	@echo "Linting frontend..."
	cd frontend && npm run lint
	@echo "Linting complete"

# Lint markdown files
lint-md:
	@echo "Linting markdown files..."
	@command -v markdownlint >/dev/null 2>&1 || { echo "markdownlint not installed. Run: npm install -g markdownlint-cli"; exit 0; }
	markdownlint --fix '**/*.md' --ignore '**/node_modules/**' --ignore '**/.conda/**' --ignore '**/dist/**' --ignore '**/.venv/**'
	@echo "Markdown linting complete"

# Type checking
type-check:
	@echo "Type checking backend..."
	cd backend && mypy app/
	@echo "Type checking frontend..."
	cd frontend && tsc --noEmit
	@echo "Type checking complete"

# Clean build artifacts
clean:
	@echo "Cleaning..."
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".mypy_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name "node_modules" -prune -o -type d -name "dist" -exec rm -rf {} + 2>/dev/null || true
	@echo "Cleaned"

# Run all checks
check: lint type-check
	@echo "All checks passed!"
# Run all checks
check: format lint type-check
	@echo "All checks passed!"
