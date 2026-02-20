import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { AlbumUI } from "@/types/spotify";
import { revalidatePath } from "next/cache";


export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data: AlbumUI = req.body ? await req.json() : {};

    if (!data || !data.name || !data.artist || !data.type) {
      return NextResponse.json(
        { error: "Invalid data: missing 'name' or 'artists' or 'type'" },
        { status: 400 },
      );
    }

    // Check auth again defensively
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Force userId to match the current session user
    const albumData = {
      ...data,
      userId: session.user.id,
    };

    const created = await prisma.album.create({
      data: albumData,
    });

    revalidatePath("/");
    // @ts-ignore
    if (session.user.username) {
      // @ts-ignore
      revalidatePath(`/${session.user.username}`);
    }

    return NextResponse.json(
      { success: true, album: created },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/vinyl error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
}
