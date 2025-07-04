-- prisma/add_vehicle_blog.sql

-- CreateTable for Vehicle Blog Posts
CREATE TABLE "VehicleBlogPost" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "heroImage" TEXT,
    "heroImageAlt" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "vehicleId" TEXT NOT NULL,

    CONSTRAINT "VehicleBlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable for Vehicle Tags
CREATE TABLE "VehicleTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "VehicleTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable for the relation between Posts and Tags
CREATE TABLE "_VehicleBlogPostToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_VehicleBlogPostToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "VehicleBlogPost_slug_idx" ON "VehicleBlogPost"("slug");

-- CreateIndex
CREATE INDEX "VehicleBlogPost_vehicleId_published_publishedAt_idx" ON "VehicleBlogPost"("vehicleId", "published", "publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleBlogPost_vehicleId_slug_key" ON "VehicleBlogPost"("vehicleId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleTag_name_key" ON "VehicleTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleTag_slug_key" ON "VehicleTag"("slug");

-- CreateIndex
CREATE INDEX "_VehicleBlogPostToTag_B_index" ON "_VehicleBlogPostToTag"("B");

-- AddForeignKey
ALTER TABLE "VehicleBlogPost" ADD CONSTRAINT "VehicleBlogPost_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VehicleBlogPostToTag" ADD CONSTRAINT "_VehicleBlogPostToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "VehicleBlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VehicleBlogPostToTag" ADD CONSTRAINT "_VehicleBlogPostToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "VehicleTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;