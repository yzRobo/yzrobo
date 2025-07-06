-- prisma/add_analytics.sql

-- Create PageView table for tracking views
CREATE TABLE "PageView" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "referrer" TEXT,
    "userAgent" TEXT,
    "ip" TEXT,
    "country" TEXT,
    "city" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);

-- Create ContentView table for tracking specific content views
CREATE TABLE "ContentView" (
    "id" TEXT NOT NULL,
    "contentType" TEXT NOT NULL, -- 'recipe', 'project', 'vehicle-post'
    "contentId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "referrer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentView_pkey" PRIMARY KEY ("id")
);

-- Create indexes for performance
CREATE INDEX "PageView_path_createdAt_idx" ON "PageView"("path", "createdAt");
CREATE INDEX "ContentView_contentType_contentId_idx" ON "ContentView"("contentType", "contentId");
CREATE INDEX "ContentView_slug_createdAt_idx" ON "ContentView"("slug", "createdAt");