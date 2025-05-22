-- Add responder_id column to emergencies table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'emergencies' 
        AND column_name = 'responder_id'
    ) THEN
        ALTER TABLE emergencies ADD COLUMN responder_id UUID REFERENCES responders(id);
    END IF;
END $$;

-- Create index on responder_id for better query performance
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_indexes 
        WHERE tablename = 'emergencies' 
        AND indexname = 'emergencies_responder_id_idx'
    ) THEN
        CREATE INDEX emergencies_responder_id_idx ON emergencies(responder_id);
    END IF;
END $$;

-- Update RLS policy to allow responder assignment
DROP POLICY IF EXISTS "Allow responder assignment" ON emergencies;
CREATE POLICY "Allow responder assignment"
ON emergencies
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Ensure the emergencies table is included in realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE emergencies;
