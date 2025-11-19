import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const searchTerm = searchParams.get("s");

  const vinyls = await prisma.album
    .findMany({
      where: searchTerm
        ? {
            OR: [
              {
                name: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              },
              {
                artists: {
                  some: {
                    name: {
                      contains: searchTerm,
                      mode: "insensitive",
                    },
                  },
                },
              },
            ],
          }
        : undefined,
      include: { artists: true },
    })
    .then((value) =>
      [...value].sort((a, b) => {
        const artistA = a.artists[0]?.name || "";
        const artistB = b.artists[0]?.name || "";
        return artistA.localeCompare(artistB);
      })
    );

  return NextResponse.json(vinyls);
}
