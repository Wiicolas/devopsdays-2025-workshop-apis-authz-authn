"use client"

import Beer from "@/lib/models/beer"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Beer>[] = [
    {
        accessorKey: "name",
        header: "Name",
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
