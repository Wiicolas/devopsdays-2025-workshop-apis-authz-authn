"use client"

import Beer from "@/lib/models/beer"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "../ui/checkbox"
import Link from "next/link"

export const columns: ColumnDef<Beer>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    }, {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            const beer = row.original
            return (
                <Link
                    href={`/beers/${beer.id}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                    {beer.name}
                </Link>
            )
        }
    },
    {
        accessorKey: "style",
        header: "Style",
    },
    {
        accessorKey: "quantity",
        header: "Quantity",
    },
    {
        accessorKey: "createdDate",
        header: "Created",
    },
]
