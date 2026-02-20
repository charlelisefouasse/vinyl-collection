"use client";

import { useState } from "react";
import { useDebounce } from "use-debounce";
import { useGetUsers } from "@/services/users/service";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Search, ChevronRight } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  const { data: users, isLoading } = useGetUsers(debouncedSearch);

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

        <div className="space-y-6">
          <InputGroup>
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          {isLoading && (
            <div className="flex justify-center py-8">
              <Spinner className="h-8 w-8 text-muted-foreground" />
            </div>
          )}

          <div className="flex flex-col gap-2">
            {users?.map((user: any) => (
              <Link href={`/${user.username}`} key={user.username}>
                <Card className="hover:bg-accent transition-colors">
                  <CardContent className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <h3 className="font-semibold">
                        {user.name || user.username}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        @{user.username}
                      </p>
                    </div>
                    <ChevronRight />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          {debouncedSearch && users?.length === 0 && !isLoading && (
            <div className="text-center py-8 text-muted-foreground">
              Aucun utilisateur trouvé correspondant à "{debouncedSearch}"
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
