import { authConfig } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AlbumUI } from "@/types/spotify";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

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

    if (!data || !data.name || !data.artists?.length) {
      return NextResponse.json(
        { error: "Invalid data: missing 'name' or 'artists'" },
        { status: 400 }
      );
    }

    const created = await prisma.album.create({
      data: {
        ...data,
        artists: {
          connectOrCreate: data.artists.map((artist) => ({
            where: { id: artist.id },
            create: { id: artist.id, name: artist.name },
          })),
        },
      },
    });

    revalidatePath("/");

    return NextResponse.json(
      { success: true, album: created },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/album/create error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}
