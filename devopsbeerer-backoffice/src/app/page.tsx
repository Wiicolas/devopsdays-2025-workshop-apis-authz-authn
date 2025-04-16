import { auth } from "@/auth";
import { columns } from "@/components/beers-list/columns";
import { DataTable } from "@/components/beers-list/data-table";
import { TopBar } from "@/components/top-bar";
import { ListBeer, listBeers } from "@/lib/http-client/beers.api.client";
import Beer from "@/lib/models/beer";

async function getData(token: string): Promise<Beer[]> {
  try {
    const response: ListBeer | null = await listBeers(token);
    return response ? response.data : []
  }
  catch (e) {
    return [];
  }
}

export default async function Home() {
  const session = await auth()

  console.log("accessToken", session?.accessToken);


  const data = await getData(session?.accessToken!)

  return (<>
    <TopBar />
    <div className="flex flex-col items-center min-h-svh gap-6 p-6 md:p-10">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Beers of my company</h1>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data} />
      </div>

    </div>
  </>);
}
