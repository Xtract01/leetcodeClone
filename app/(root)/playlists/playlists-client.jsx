"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  ListMusic,
  ArrowLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CreatePlaylistModal from "@/modules/problems/components/create-playlist";
import { toast } from "sonner";

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case "EASY":
      return "bg-green-100 text-green-800";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-800";
    case "HARD":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const PlaylistsClient = ({ playlists: initialPlaylists }) => {
  const router = useRouter();
  const [playlists, setPlaylists] = useState(initialPlaylists);
  const [expandedId, setExpandedId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreatePlaylist = async (data) => {
    try {
      const response = await fetch("/api/playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
        }),
      });
      const result = await response.json();
      if (result.success) {
        toast.success("Playlist created successfully");
        setTimeout(() => {
          setIsCreateModalOpen(false);
          router.refresh();
        }, 100);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error(error.message || "Failed to create playlist");
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    try {
      const response = await fetch(`/api/playlists/${playlistId}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        toast.success("Playlist deleted");
        setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete playlist");
    }
  };

  const handleRemoveProblem = async (playlistId, problemId) => {
    try {
      const response = await fetch(
        `/api/playlists/${playlistId}/problem/${problemId}`,
        {
          method: "DELETE",
        },
      );
      const result = await response.json();
      if (result.success) {
        toast.success("Problem removed from playlist");
        setPlaylists((prev) =>
          prev.map((p) =>
            p.id === playlistId
              ? {
                  ...p,
                  problems: p.problems.filter(
                    (pip) => pip.problem.id !== problemId,
                  ),
                }
              : p,
          ),
        );
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error(error.message || "Failed to remove problem");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/problems">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <ListMusic className="h-7 w-7" />
                My Playlists
              </h1>
              <p className="text-muted-foreground">
                {playlists.length} playlist{playlists.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Playlist
          </Button>
        </div>

        {/* Empty State */}
        {playlists.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent className="flex flex-col items-center gap-4">
              <BookOpen className="h-12 w-12 text-muted-foreground opacity-50" />
              <div>
                <p className="text-lg font-medium">No playlists yet</p>
                <p className="text-muted-foreground text-sm">
                  Create a playlist to organize your favorite problems
                </p>
              </div>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Create your first playlist
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {playlists.map((playlist) => (
              <Card key={playlist.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-xl">{playlist.name}</CardTitle>
                      {playlist.description && (
                        <CardDescription>
                          {playlist.description}
                        </CardDescription>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {playlist.problems.length} problem
                        {playlist.problems.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setExpandedId(
                            expandedId === playlist.id ? null : playlist.id,
                          )
                        }
                        className="gap-1"
                      >
                        {expandedId === playlist.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                        {expandedId === playlist.id ? "Hide" : "Show"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePlaylist(playlist.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {expandedId === playlist.id && (
                  <CardContent className="pt-0">
                    {playlist.problems.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground border rounded-lg">
                        <p className="text-sm">
                          No problems in this playlist yet.
                        </p>
                        <Link href="/problems">
                          <Button variant="link" size="sm" className="mt-1">
                            Browse problems
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {playlist.problems.map(({ problem }) => (
                          <div
                            key={problem.id}
                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Badge
                                className={`${getDifficultyColor(problem.difficulty)} border-0 text-xs font-medium`}
                              >
                                {problem.difficulty}
                              </Badge>
                              <Link
                                href={`/problem/${problem.id}`}
                                className="font-medium text-sm hover:underline text-primary"
                              >
                                {problem.title}
                              </Link>
                              <div className="flex gap-1 flex-wrap">
                                {problem.tags?.slice(0, 2).map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleRemoveProblem(playlist.id, problem.id)
                              }
                              className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      <CreatePlaylistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePlaylist}
      />
    </div>
  );
};

export default PlaylistsClient;
