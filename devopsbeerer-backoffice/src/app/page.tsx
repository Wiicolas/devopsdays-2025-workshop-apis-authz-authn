import { auth } from "@/auth";
import { columns } from "@/components/beers-list/columns";
import { DataTable } from "@/components/beers-list/data-table";
import { TopBar } from "@/components/top-bar";
import { headers } from "next/headers";

type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export const payments: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  // ...
]

async function getData(token: string | null): Promise<Payment[]> {

  
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    // ...
  ]
}

export default async function Home() {
  const session = await auth()

  const data = await getData("")

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
