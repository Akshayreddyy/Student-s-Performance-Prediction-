-- Update the check constraint to allow "No Risk" as a valid risk level
ALTER TABLE predictions DROP CONSTRAINT IF EXISTS predictions_risk_level_check;

ALTER TABLE predictions ADD CONSTRAINT predictions_risk_level_check 
CHECK (risk_level IN ('High Risk', 'Risk', 'Low Risk', 'No Risk'));