/*
  Warnings:

  - You are about to drop the column `primaryArtistName` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the `Artist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AlbumArtists` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_AlbumArtists" DROP CONSTRAINT "_AlbumArtists_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_AlbumArtists" DROP CONSTRAINT "_AlbumArtists_B_fkey";

-- AlterTable
ALTER TABLE "Album" DROP COLUMN "primaryArtistName",
ADD COLUMN     "artist" TEXT;

-- DropTable
DROP TABLE "public"."Artist";

-- DropTable
DROP TABLE "public"."_AlbumArtists";
