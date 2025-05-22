-- Add responder_id column to emergencies table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'emergencies' AND column_name = 'responder_id') THEN
        ALTER TABLE emergencies ADD COLUMN responder_id UUID REFERENCES responders(id);
    END IF;
END
$$;

-- Add responding_to column to responders table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'responders' AND column_name = 'responding_to') THEN
        ALTER TABLE responders ADD COLUMN responding_to UUID REFERENCES emergencies(id);
    END IF;
END
$$;
