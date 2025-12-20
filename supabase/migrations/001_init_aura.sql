-- supabase/migrations/001_init_aura.sql

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  preferences JSONB DEFAULT '{}'::jsonb
);

-- Voice profiles (for voice cloning)
CREATE TABLE voice_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  voice_name TEXT NOT NULL,
  voice_id TEXT UNIQUE,
  sample_audio_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  training_status TEXT CHECK (training_status IN ('pending', 'trained', 'failed')) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now(),
  trained_at TIMESTAMP
);

-- Device registry (Tuya devices)
CREATE TABLE devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tuya_device_id TEXT NOT NULL,
  device_name TEXT NOT NULL,
  device_type TEXT NOT NULL, -- 'light', 'thermostat', 'lock', 'blinds', etc.
  room TEXT NOT NULL,
  dp_ids JSONB NOT NULL, -- Tuya data point IDs: { "brightness": 1, "color": 2, ... }
  is_online BOOLEAN DEFAULT false,
  last_heartbeat TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, tuya_device_id)
);

-- Plans (stored orchestration plans)
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  goal_text TEXT NOT NULL,
  goal_classification TEXT, -- 'movie_time', 'goodnight', 'leaving_home', etc.
  plan_data JSONB NOT NULL, -- Full plan structure with steps
  created_at TIMESTAMP DEFAULT now(),
  executed_at TIMESTAMP,
  execution_count INT DEFAULT 0
);

-- Execution logs (audit trail)
CREATE TABLE execution_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  started_at TIMESTAMP DEFAULT now(),
  completed_at TIMESTAMP,
  overall_status TEXT CHECK (overall_status IN ('success', 'partial', 'failed')) DEFAULT 'pending',
  steps_log JSONB NOT NULL, -- Array of step execution results
  duration_ms INT
);

-- Context snapshots (for learning & analytics)
CREATE TABLE context_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES plans(id) ON DELETE SET NULL,
  weather JSONB NOT NULL,
  calendar_busy BOOLEAN,
  occupancy_count INT,
  user_location TEXT,
  indoor_temp FLOAT,
  timestamp TIMESTAMP DEFAULT now()
);

-- Custom automation rules (user-defined scenarios)
CREATE TABLE automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rule_name TEXT NOT NULL,
  trigger JSONB NOT NULL, -- { "type": "time", "time": "22:00" } or { "type": "sensor", "device": "...", "threshold": 70 }
  action_plan_id UUID REFERENCES plans(id),
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  last_triggered TIMESTAMP
);

-- Indices for performance
CREATE INDEX idx_plans_user_id ON plans(user_id);
CREATE INDEX idx_execution_logs_user_id ON execution_logs(user_id);
CREATE INDEX idx_devices_user_id ON devices(user_id);
CREATE INDEX idx_voice_profiles_user_id ON voice_profiles(user_id);
CREATE INDEX idx_context_snapshots_user_id ON context_snapshots(user_id);
