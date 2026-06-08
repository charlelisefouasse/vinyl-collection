"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlbumCard } from "@/components/album-card";
import { ShuffleIcon } from "lucide-react";
import { AlbumUI } from "@/types/spotify";

export function RandomAlbumDialog({
  albums,
}: {
  albums: AlbumUI[] | undefined;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumUI | null>(null);

  const pickRandom = () => {
    if (!albums || albums.length === 0) return;
    const randomIndex = Math.floor(Math.random() * albums.length);
    setSelectedAlbum(albums[randomIndex]);
  };

  if (!albums || albums.length === 0) return null;

  return (
    <>
      <Button
        variant="outline"
        onClick={() => {
          pickRandom();
          setIsOpen(true);
        }}
        className="gap-2"
        aria-label="Choisir un album aléatoire"
      >
        <ShuffleIcon />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Écouter un album</DialogTitle>
            <DialogDescription>
              Voici un album choisi au hasard dans la collection.
            </DialogDescription>
          </DialogHeader>

          {selectedAlbum && (
            <div className="py-4 flex justify-center">
              <AlbumCard
                album={selectedAlbum}
                isInModal={true}
                className="w-full "
              />
            </div>
          )}

          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Fermer
            </Button>
            <Button onClick={pickRandom} className="gap-2">
              <ShuffleIcon className="h-4 w-4" />
              Relancer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
