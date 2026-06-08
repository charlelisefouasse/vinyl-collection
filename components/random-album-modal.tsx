"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { ShuffleIcon } from "lucide-react";
import { AlbumUI } from "@/types/spotify";
import { AlbumCard } from "@/components/album-card";

export function RandomAlbumModal({
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

      <Modal open={isOpen} onOpenChange={setIsOpen}>
        <ModalContent className="sm:max-w-lg">
          <ModalHeader className="text-left pt-4 sm:p-0">
            <ModalTitle>Écouter un album</ModalTitle>
            <ModalDescription>
              Voici un album choisi au hasard dans la collection.
            </ModalDescription>
          </ModalHeader>

          {selectedAlbum && (
            <div className="p-4 sm:p-0 flex justify-center">
              <AlbumCard
                album={selectedAlbum}
                isInModal={true}
                className="w-full shadow-none"
              />
            </div>
          )}

          <ModalFooter className="flex-col sm:flex-row gap-2 sm:justify-end pb-12 sm:p-0">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="hidden sm:flex"
            >
              Fermer
            </Button>
            <Button onClick={pickRandom} className="gap-2 w-full sm:w-auto">
              <ShuffleIcon className="h-4 w-4" />
              Relancer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
