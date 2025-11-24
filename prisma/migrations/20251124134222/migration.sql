/*
  Warnings:

  - You are about to drop the column `albumId` on the `Artist` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Artist" DROP CONSTRAINT "Artist_albumId_fkey";

-- AlterTable
ALTER TABLE "Artist" DROP COLUMN "albumId";

-- CreateTable
CREATE TABLE "_AlbumArtists" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AlbumArtists_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AlbumArtists_B_index" ON "_AlbumArtists"("B");

-- AddForeignKey
ALTER TABLE "_AlbumArtists" ADD CONSTRAINT "_AlbumArtists_A_fkey" FOREIGN KEY ("A") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlbumArtists" ADD CONSTRAINT "_AlbumArtists_B_fkey" FOREIGN KEY ("B") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
