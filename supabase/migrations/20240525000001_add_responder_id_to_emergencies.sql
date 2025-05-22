-- Add responder_id column to emergencies table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'emergencies' 
                   AND column_name = 'responder_id') THEN
        ALTER TABLE emergencies ADD COLUMN responder_id UUID REFERENCES responders(id);
    END IF;
END $$;

-- Enable realtime for the emergencies table
alter publication supabase_realtime add table emergencies;
