#!/bin/bash
# Load environment variables and construct DATABASE_URL

# Source the individual variables
export DB_USER="postgres.qshemnfxjpetiyimfdtc"
export DB_PASSWORD="Golem393Golem39"
export DB_HOST="aws-1-eu-west-1.pooler.supabase.com"
export DB_PORT="5432"
export DB_NAME="postgres"

# Construct the DATABASE_URL
export DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

echo "Environment loaded. DATABASE_URL set to:"
echo "$DATABASE_URL"
