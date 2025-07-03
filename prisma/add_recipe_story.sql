-- /prisma/add_recipe_story.sql
ALTER TABLE "Recipe" ADD COLUMN IF NOT EXISTS "story" TEXT;