import { auth } from "@/auth";
import { BeerTableContainer } from "@/components/beers-list/beer-table-container";
import { MenuDock } from "@/components/dock";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { ListBeer, listBeers } from "@/lib/http-client/beers.api.client";
import Beer from "@/lib/models/beer";
import { cn } from "@/lib/utils";

// Make the page dynamic to prevent caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getData(): Promise<Beer[]> {
  try {
    const session = await auth();
    if (!session?.accessToken) return [];

    const response: ListBeer | null = await listBeers(session.accessToken);
    return response ? response.data : []
  }
  catch (e) {
    console.error('Error fetching beers:', e);
    return [];
  }
}

export default async function Home() {
  const data = await getData();

  return (
    <>
      <div className="relative flex flex-col h-full w-[900px] flex-col items-center justify-center overflow-hidden p-20 bg-background mx-auto">
        <DotPattern
          width={20}
          height={20}
          cx={1}
          cy={1}
          cr={1}
          className={cn(
            "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] ",
          )}
        />
        <MenuDock />
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mt-8">
          Beers of my company
        </h1>
        <div className="container mx-auto ">
          <BeerTableContainer initialData={data} />
        </div>
      </div>
    </>
  );
}