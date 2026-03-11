import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import PlaylistsClient from "./playlists-client";

const PlaylistsPage = async () => {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const dbUser = await db.user.findUnique({
    where: { clerkId: user.id },
  });

  if (!dbUser) redirect("/sign-in");

  const playlists = await db.playlist.findMany({
    where: { userId: dbUser.id },
    include: {
      problems: {
        include: {
          problem: {
            select: {
              id: true,
              title: true,
              difficulty: true,
              tags: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return <PlaylistsClient playlists={playlists} />;
};

export default PlaylistsPage;
