"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    RowSelectionState,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    onSelectionChange?: (selectedIds: string[]) => void
    resetSelection?: boolean
}

export function DataTable<TData, TValue>({
    columns,
    data,
    onSelectionChange,
    resetSelection = false,
}: DataTableProps<TData, TValue>) {
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

    // Reset selection when resetSelection prop changes
    useEffect(() => {
        if (resetSelection) {
            setRowSelection({})
        }
    }, [resetSelection])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        enableRowSelection: true,
        onRowSelectionChange: (updater) => {
            setRowSelection(updater)
            const newSelection = typeof updater === 'function'
                ? updater(rowSelection)
                : updater

            if (onSelectionChange) {
                const selectedRows = Object.keys(newSelection)
                    .filter(key => newSelection[key])
                    .map(key => (table.getRow(key).original as any).id)
                onSelectionChange(selectedRows)
            }
        },
        state: {
            rowSelection,
        },
    })

    if (!data) {
        return <>No access</>
    }

    return (
        <div className="rounded-md border">
            <Table className="z-10 bg-white rounded-md">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {cell.column.id === "createdDate"
                                            ? new Date(cell.getValue() as string).toLocaleDateString()
                                            : flexRender(cell.column.columnDef.cell, cell.getContext())
                                        }
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}