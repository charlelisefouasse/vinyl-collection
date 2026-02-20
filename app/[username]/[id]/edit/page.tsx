"use client";

import { AlbumForm } from "@/components/album-form";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetAlbum, useUpdateAlbum } from "@/services/albums/service";

import { ArrowLeft } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function EditAlbumPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const session = useSession();

  useEffect(() => {
    if (!session.isPending && !session.data) {
      router.push("/login");
    }
  }, [session.data, session.isPending, router]);

  const updateAlbum = useUpdateAlbum({
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la mise à jour de l'album",
      );
    },
    onSuccess: () => {
      toast.success("Album modifié avec succès !");
      router.back();
    },
  });

  const album = useGetAlbum(id);

  if (session.isPending || album.isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (album.error || !album.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-destructive">Erreur : Album introuvable</p>
        <Button asChild variant="outline">
          <Link href="/">Retour</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Header hideUserDropdown hideLogo>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            size="icon"
            className="shrink-0"
          >
            <ArrowLeft />
          </Button>
          <h1 className="text-xl md:text-2xl font-bold truncate">
            Modifier l'album
          </h1>
        </div>
      </Header>
      <main className="container mx-auto px-4 py-8">
        <div className="container mx-auto space-y-8 max-w-2xl">
          <Card className=" bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-md">
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={album.data.image}
                    alt={album.data.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, (max-width: 1536px) 25vw, 20vw"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold line-clamp-2">
                    {album.data.name}
                  </h3>
                  <p className="text-muted-foreground">{album.data.artist}</p>
                  {album.data.release_date && (
                    <p className="text-sm text-muted-foreground">
                      {new Date(album.data.release_date).getFullYear()}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-md">
            <CardContent>
              <AlbumForm
                album={album.data}
                mode="edit"
                onSubmit={(payload) => updateAlbum.mutate(payload)}
                isLoading={updateAlbum.isPending}
                onCancel={() => router.back()}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
