import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const searchTerm = searchParams.get("s");
  const type = searchParams.get("type") || "collection";
  const username = searchParams.get("u");

  const whereClause: any = {
    type: type,
  };

  if (username) {
    const user = await prisma.user.findUnique({
      where: { username },
    });
    if (user) {
      whereClause.userId = user.id;
    }
  }

  if (searchTerm) {
    whereClause.OR = [
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
    ];
  }

  const vinyls = await prisma.album.findMany({
    where: whereClause,
    orderBy: [{ artist: "asc" }, { release_date: "asc" }],
  });

  return NextResponse.json(vinyls);
}
