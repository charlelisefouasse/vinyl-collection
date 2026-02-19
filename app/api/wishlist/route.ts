import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const searchTerm = searchParams.get("s");

  const wishlist = await prisma.wishlistAlbum.findMany({
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

  return NextResponse.json(wishlist);
}

import { authConfig } from "@/lib/auth";
import { AlbumUI } from "@/types/spotify";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authConfig);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const data: AlbumUI = req.body ? await req.json() : {};

    if (!data || !data.name || !data.artist) {
      return NextResponse.json(
        { error: "Invalid data: missing 'name' or 'artists'" },
        { status: 400 },
      );
    }

    const created = await prisma.wishlistAlbum.create({
      data,
    });

    revalidatePath("/");

    return NextResponse.json(
      { success: true, album: created },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/wishlist error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
}
