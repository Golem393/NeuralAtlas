# Supabase Database Schema

This folder contains the **source of truth** for the NeuralAtlas database schema.

## Core Rules

1. **Source of Truth**: Files in `schemas/` represent the desired state of the database
2. **No Manual Migrations**: Never write files in `supabase/migrations/` manually
3. **Strict Ordering**: All schema files must start with a number (e.g., `01_init.sql`, `10_buildings.sql`)

## Schema Files

- `01_init.sql` - Extensions (PostGIS, UUID)
- `10_buildings.sql` - Buildings table with spatial data
- `99_seed.sql` - Sample data for development

## Current Workflow (Production-Only)

**We are NOT using local Supabase CLI yet.** All changes go directly to production.

### Making Schema Changes

1. **Edit the schema file directly** in `schemas/`
   - Example: To add a column to buildings, edit `10_buildings.sql`
   - Modify the `CREATE TABLE` statement (don't write `ALTER TABLE`)
   - Use idempotent statements (`IF NOT EXISTS`, `DO $$ IF NOT EXISTS`)

2. **Apply to Production**:
   - Go to **SQL Editor** in Supabase Dashboard
   - Copy the entire modified schema file
   - Paste and run in SQL Editor
   - Idempotent statements make this safe to re-run

3. **Commit**:
   - Commit the modified `schemas/` file to git

### First-Time Setup

1. Go to **SQL Editor** in Supabase Dashboard
2. Run each schema file in order:
   - `01_init.sql`
   - `10_buildings.sql`
   - `99_seed.sql`

### Future: With Supabase CLI (When Ready)

Eventually, you can set up local development:

```bash
# Install CLI
npm install -g supabase

# Start local instance
supabase start

# Test changes
supabase db reset

# Generate migration for production
supabase db diff -f descriptive_name

# Push to production
supabase db push
```

## Adding New Tables

1. Create new file with numbered prefix (e.g., `20_textures.sql`)
2. Define the complete table structure
3. Run `supabase db reset` to test locally
4. Run `supabase db diff -f add_textures` to generate migration

## Why This Approach?

- **Single Source of Truth**: Schema files are authoritative, not migrations
- **Reproducible**: Can recreate entire DB from scratch
- **AI-Friendly**: AI can understand current state without reading all migrations
- **Less Error-Prone**: No manual migration writing means fewer mistakes
