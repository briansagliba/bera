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
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE emergencies;
  END IF;
END $$;
