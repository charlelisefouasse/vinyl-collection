-- AlterTable
ALTER TABLE "Album" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'collection';

-- Move data from WishlistAlbum to Album
INSERT INTO "Album" ("id", "name", "image", "release_date", "genres", "variant", "artist", "type")
SELECT "id", "name", "image", "release_date", "genres", "variant", "artist", 'wishlist'
FROM "WishlistAlbum";

-- DropTable
DROP TABLE "WishlistAlbum";
