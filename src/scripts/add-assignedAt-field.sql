-- Add assignedAt field to Badge table
ALTER TABLE Badge ADD COLUMN assignedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);