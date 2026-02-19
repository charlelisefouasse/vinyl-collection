-- CreateTable
CREATE TABLE "WishlistAlbum" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "release_date" TEXT NOT NULL,
    "genres" TEXT[],
    "variant" TEXT,
    "artist" TEXT NOT NULL,

    CONSTRAINT "WishlistAlbum_pkey" PRIMARY KEY ("id")
);
