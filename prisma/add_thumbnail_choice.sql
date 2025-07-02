-- /prisma/add_thumbnail_choice.sql

-- Create the new Enum type for our choice
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'thumbnaidisplay') THEN
        CREATE TYPE "ThumbnailDisplay" AS ENUM ('HERO', 'INGREDIENTS');
    END IF;
END$$;

-- Add the new column to the Recipe table to store the choice
-- It defaults to 'HERO' (the finished dish image) for all existing recipes
ALTER TABLE "Recipe" ADD COLUMN IF NOT EXISTS "thumbnailDisplay" "ThumbnailDisplay" NOT NULL DEFAULT 'HERO';