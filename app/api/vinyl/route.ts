import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const searchTerm = searchParams.get("s");

  const vinyls = await prisma.album.findMany({
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
              artist: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          ],
        }
      : undefined,
    orderBy: [{ artist: "asc" }, { release_date: "asc" }],
  });

  return NextResponse.json(vinyls);
}
