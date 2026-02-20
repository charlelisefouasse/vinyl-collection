import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const album = await prisma.album.findUnique({
      where: { id },
    });

    if (!album) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 });
    }

    return NextResponse.json(album);
  } catch (error) {
    console.error("GET /api/vinyl/[id] error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;

    // Authorization Check
    const album = await prisma.album.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!album) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (album.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: You do not own this album" },
        { status: 403 },
      );
    }

    const data = await req.json();

    const updated = await prisma.album.update({
      where: { id },
      data: { ...data, userId: album.userId },
    });

    revalidatePath("/");

    return NextResponse.json(
      { success: true, album: updated },
      { status: 200 },
    );
  } catch (error) {
    console.error("PUT /api/vinyl/[id] error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;

    // Authorization Check
    const album = await prisma.album.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!album) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (album.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: You do not own this album" },
        { status: 403 },
      );
    }

    await prisma.album.delete({
      where: { id },
    });

    revalidatePath("/");

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/vinyl/[id] error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
}
