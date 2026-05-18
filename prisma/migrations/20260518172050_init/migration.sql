-- CreateTable
CREATE TABLE "Link" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "image" TEXT,
    "favicon" TEXT,
    "siteName" TEXT,
    "extras" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);
