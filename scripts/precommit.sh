#!/bin/bash

# Pre-commit check script for NeuralAtlas
# Runs linting, formatting, and type checking with auto-fix

set -e

echo "🔍 Running pre-commit checks..."

# Change to frontend directory
cd "$(dirname "$0")/../frontend"

echo ""
echo "📝 Auto-fixing linting issues..."
npm run lint:fix || {
  echo "❌ Linting failed. Please fix errors manually."
  exit 1
}

echo ""
echo "🎨 Auto-formatting code..."
npm run format || {
  echo "❌ Formatting failed."
  exit 1
}

echo ""
echo "🔎 Type checking..."
npm run type-check || {
  echo "❌ Type check failed. Please fix type errors."
  exit 1
}

echo ""
echo "✅ All checks passed! Ready to commit."
