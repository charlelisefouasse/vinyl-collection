import { Header } from "@/components/header";
import { UserSearch } from "@/components/user-search";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header logoFull />

      <main className="container mx-auto px-4 py-12 max-w-2xl space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Découvrir des collections
          </h2>
          <p className="text-muted-foreground">
            Recherchez des utilisateurs pour voir leurs collections de vinyles.
          </p>
        </div>

        <UserSearch />
      </main>
    </div>
  );
}
