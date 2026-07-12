"use client"

import * as React from "react"
import { 
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ShieldAlert, AlertTriangle, AlertCircle, ArrowUpDown, ChevronDown, CheckCircle, ShieldOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import useSWR from "swr"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

// Mock Triage Data
type TriageAlert = {
  id: string
  timestamp: string
  riskScore: number
  ruleTriggered: string
  entityType: "Transaction" | "Account" | "Device"
  amount?: string
  status: "Unassigned" | "Assigned"
  priority: "Critical" | "High" | "Medium"
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function TriagePage() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [rowSelection, setRowSelection] = React.useState({})
  const router = useRouter()

  const { data, error, isLoading, mutate } = useSWR('http://localhost:4000/api/v1/alerts/triage', fetcher, {
    refreshInterval: 5000 // Poll every 5s for new alerts
  })

  const alertsData = React.useMemo(() => {
    if (!data?.data?.alerts) return []
    return data.data.alerts.map((a: any) => ({
      id: a.id,
      timestamp: a.created_at,
      riskScore: Math.round(a.risk_score * 100),
      ruleTriggered: a.severity + ' Alert: ' + (a.recommended_action || 'Review needed'),
      entityType: "Transaction",
      amount: `$${a.transaction?.amount?.toFixed(2) || '0.00'}`,
      status: a.status === 'OPEN' ? 'Unassigned' : 'Assigned',
      priority: a.severity === 'CRITICAL' ? 'Critical' : a.severity === 'HIGH' ? 'High' : 'Medium'
    })) as TriageAlert[]
  }, [data])

  const columns: ColumnDef<TriageAlert>[] = [
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
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const priority = row.getValue("priority") as string
        if (priority === "Critical") return <Badge variant="destructive" className="bg-red-600"><ShieldAlert className="mr-1 h-3 w-3" /> Critical</Badge>
        if (priority === "High") return <Badge variant="destructive" className="bg-orange-500"><AlertTriangle className="mr-1 h-3 w-3" /> High</Badge>
        return <Badge variant="secondary"><AlertCircle className="mr-1 h-3 w-3" /> Medium</Badge>
      },
    },
    {
      accessorKey: "riskScore",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Score
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-bold text-center px-4">{row.getValue("riskScore")}</div>,
    },
    {
      accessorKey: "ruleTriggered",
      header: "Alert Reason",
    },
    {
      accessorKey: "entityType",
      header: "Entity",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return <span className={status === "Unassigned" ? "text-muted-foreground italic" : "font-medium"}>{status}</span>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm">Assign to me</Button>
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10"><ShieldOff className="h-4 w-4" /></Button>
          </div>
        )
      },
    }
  ]

  const table = useReactTable({
    data: alertsData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      rowSelection,
    },
  })

  const handleBulkEscalate = async () => {
    const selectedRows = table.getSelectedRowModel().rows
    if (selectedRows.length === 0) return

    const alertIds = selectedRows.map(r => r.original.id)
    try {
      const res = await fetch('http://localhost:4000/api/v1/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Bulk Escalation - ${alertIds.length} Alerts`,
          priority: 'HIGH',
          alertIds: alertIds
        })
      })
      if (res.ok) {
        const json = await res.json()
        toast.success("Case Created", { description: `Escalated ${alertIds.length} alerts to a new case.` })
        mutate() // Refresh data
        table.resetRowSelection()
        router.push(`/cases/${json.data.case.id}`)
      } else {
        toast.error("Error", { description: "Failed to create case" })
      }
    } catch (err) {
      console.error(err)
      toast.error("Error", { description: "Failed to create case" })
    }
  }

  return (
    <div className="flex h-full flex-col space-y-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Alert Triage Queue</h2>
          <p className="text-muted-foreground">
            Review and assign unhandled high-risk alerts before they breach SLAs.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => table.resetRowSelection()}><CheckCircle className="mr-2 h-4 w-4" /> Clear Selection</Button>
          <Button onClick={handleBulkEscalate} disabled={Object.keys(rowSelection).length === 0}>
            <ShieldAlert className="mr-2 h-4 w-4" /> Bulk Escalate to Case
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
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
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No pending alerts.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
