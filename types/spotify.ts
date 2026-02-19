import { Album } from "@/app/generated/prisma";
import { v4 as uuid } from "uuid";

// Reusable types
export type SpotifyExternalUrl = {
  spotify: string;
};

export type SpotifyImage = {
  url: string;
  height: number;
  width: number;
};

export type SpotifyArtistBrief = {
  external_urls: SpotifyExternalUrl;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
};

export type SpotifyAlbum = {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: SpotifyExternalUrl;
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  release_date: string;
  release_date_precision: string;
  restrictions: {
    reason: string;
  };
  type: string;
  uri: string;
  artists: SpotifyArtistBrief[];
};

export type SpotifyPaging<T> = {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
  items: T[];
};

export type SpotifySearchResponse = {
  albums: SpotifyPaging<SpotifyAlbum>;
};

export type AlbumUI = Album;

export const mapAlbumsToUI = (
  response: SpotifySearchResponse,
): Array<AlbumUI> => {
  return response.albums.items.map((album) => ({
    name: album.name,
    genres: [],
    image: album.images[0]?.url,
    id: uuid(),
    release_date: album.release_date,
    variant: null,
    artist: album.artists.map((artist) => artist.name).join(", "),
  }));
};
