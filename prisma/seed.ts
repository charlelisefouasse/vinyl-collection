import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const userData: Prisma.AlbumCreateInput[] = [
  {
    id: "3p7m1Pmg6n3BlpL9Py7IUA",
    name: "THE DEATH OF PEACE OF MIND",
    image: "https://i.scdn.co/image/ab67616d0000b273e5f6f7ec99735d7b870f18ae",
    artists: {
      create: [
        {
          id: "3Ri4H12KFyu98LMjSoij5V",
          name: "Bad Omens",
        },
      ],
    },
    release_date: "2022-02-25",
    variant: "Argent",
  },
];

export async function main() {
  for (const u of userData) {
    await prisma.album.create({ data: u });
  }
}

main();
