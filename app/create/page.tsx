"use client";

import Image from "next/image";
import { useState } from "react";
import { useGetAlbums } from "@/app/create/service";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  const searchAlbums = useGetAlbums(searchTerm);

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold">Albums</h1>
      <input
        name="search"
        placeholder="Chercher un album"
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
      />
      <ul className="mt-4">
        {searchAlbums.isLoading && <div>Chargement...</div>}
        {searchAlbums.isError && (
          <div>Erreur lors de la recherche d&apos;album</div>
        )}
        {!searchAlbums.isLoading &&
          !!searchTerm &&
          !searchAlbums.data?.length && <div>Aucun résultat</div>}
        {!!searchAlbums.data?.length &&
          !searchAlbums.isLoading &&
          searchAlbums.data?.map((album) => (
            <li key={album.id} className="mb-2">
              {album.name} -{" "}
              {album.artists.map((artist) => artist.name).join(", ")}
              <Image src={album.image} alt="" width={200} height={200} />
            </li>
          ))}
      </ul>
    </main>
  );
}
