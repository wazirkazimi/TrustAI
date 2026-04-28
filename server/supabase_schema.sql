-- TrustAI Supabase Schema Migration
-- Run this in your Supabase SQL Editor

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  age INTEGER,
  goal TEXT,
  grading_system TEXT DEFAULT 'FoodTrust (AI)',
  health_mode TEXT DEFAULT 'default',
  veg_filter BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (Optional, but recommended)
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 2. Scans Table
CREATE TABLE IF NOT EXISTS scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  product_name TEXT DEFAULT 'Unknown Product',
  image_url TEXT,
  barcode_number TEXT,
  fssai_number TEXT,
  fssai_status TEXT CHECK (fssai_status IN ('valid', 'invalid', 'unverified')) DEFAULT 'unverified',
  veg_status TEXT CHECK (veg_status IN ('veg', 'nonVeg', 'unknown')) DEFAULT 'unknown',
  nutrition_data JSONB DEFAULT '{}'::jsonb,
  scores JSONB DEFAULT '{}'::jsonb,
  processing_level TEXT DEFAULT 'Unknown',
  additives TEXT[] DEFAULT '{}',
  health_mode TEXT DEFAULT 'default',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Bookmarks Table (Relationship Table)
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  scan_id UUID REFERENCES scans(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, scan_id)
);

-- 4. Reports Table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reported_by UUID REFERENCES users(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  fssai_number TEXT,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Enable useful extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
