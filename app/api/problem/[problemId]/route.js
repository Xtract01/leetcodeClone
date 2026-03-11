import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const dbUser = await db.user.findUnique({ where: { clerkId: user.id } });
    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    const { playlistId, problemId } = await params;

    // Verify playlist belongs to user
    const playlist = await db.playlist.findFirst({
      where: { id: playlistId, userId: dbUser.id },
    });

    if (!playlist) {
      return NextResponse.json(
        { success: false, error: "Playlist not found" },
        { status: 404 },
      );
    }

    await db.problemInPlaylist.delete({
      where: {
        playlistId_problemId: { playlistId, problemId },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing problem from playlist:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove problem" },
      { status: 500 },
    );
  }
}
