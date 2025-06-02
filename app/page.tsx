import prisma from "@/lib/prisma";

export default async function Home() {
  const albums = await prisma.album.findMany({ include: { artists: true } });
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            {albums.map((album) => (
              <div key={album.id}>
                {album.name} -{" "}
                {album.artists.map((artist) => artist.name).join(", ")}
              </div>
            ))}
          </li>
        </ol>
      </main>
    </div>
  );
}
