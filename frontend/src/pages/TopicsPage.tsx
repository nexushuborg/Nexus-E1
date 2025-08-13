import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { revisionTopics, type RevisionTopic, type RevisionStatus } from "@/data/revisionTopics";
import { formatDistanceToNow } from "date-fns";

// Mock API function (will be replaced with real API call)
const fetchTopics = async (): Promise<RevisionTopic[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return revisionTopics;
};

// Status dropdown component for reusability
const StatusDropdown = ({ 
  value, 
  onValueChange, 
  topicId 
}: { 
  value: RevisionStatus; 
  onValueChange: (value: RevisionStatus) => void;
  topicId: string;
}) => {
  const handleStatusChange = (newStatus: RevisionStatus) => {
    onValueChange(newStatus);
    // Log status change for future API integration
    console.log(`Topic ${topicId} status changed to: ${newStatus}`);
  };

  return (
    <Select value={value} onValueChange={handleStatusChange}>
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Not Started">Not Started</SelectItem>
        <SelectItem value="In Progress">In Progress</SelectItem>
        <SelectItem value="Completed">Completed</SelectItem>
      </SelectContent>
    </Select>
  );
};

// Status badge component
const StatusBadge = ({ status }: { status: RevisionStatus }) => {
  const getVariant = (status: RevisionStatus) => {
    switch (status) {
      case 'Not Started':
        return 'secondary';
      case 'In Progress':
        return 'default';
      case 'Completed':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <Badge variant={getVariant(status)} className="w-fit">
      {status}
    </Badge>
  );
};

export default function TopicsPage() {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  // Fetch topics using TanStack Query
  const { data: topics = [], isLoading, error } = useQuery({
    queryKey: ['revision-topics'],
    queryFn: fetchTopics,
  });

  // Define table columns
  const columns: ColumnDef<RevisionTopic>[] = [
    {
      accessorKey: "name",
      header: "Topic Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusDropdown
          value={row.getValue("status")}
          onValueChange={(newStatus) => {
            // Update local state (in real app, this would update the API)
            const updatedTopics = topics.map(topic => 
              topic.id === row.original.id 
                ? { ...topic, status: newStatus }
                : topic
            );
            console.log('Updated topics:', updatedTopics);
          }}
          topicId={row.original.id}
        />
      ),
    },
    {
      accessorKey: "lastReviewed",
      header: "Last Reviewed",
      cell: ({ row }) => {
        const lastReviewed = row.getValue("lastReviewed") as string | null;
        if (!lastReviewed) {
          return <span className="text-muted-foreground">Never</span>;
        }
        return (
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(lastReviewed), { addSuffix: true })}
          </span>
        );
      },
    },
    {
      accessorKey: "difficulty",
      header: "Difficulty",
      cell: ({ row }) => {
        const difficulty = row.getValue("difficulty") as string;
        const getDifficultyColor = (diff: string) => {
          switch (diff) {
            case 'Beginner':
              return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Intermediate':
              return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'Advanced':
              return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default:
              return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
          }
        };
        
        return (
          <Badge className={`${getDifficultyColor(difficulty)}`}>
            {difficulty}
          </Badge>
        );
      },
    },
    {
      accessorKey: "estimatedTime",
      header: "Est. Time",
      cell: ({ row }) => {
        const time = row.getValue("estimatedTime") as number;
        return (
          <span className="text-sm text-muted-foreground">
            {time} min
          </span>
        );
      },
    },
  ];

  // Initialize table
  const table = useReactTable({
    data: topics,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  // Handle row click navigation
  const handleRowClick = (topicId: string) => {
    navigate(`/topics/${topicId}`);
  };

  if (isLoading) {
    return (
      <main className="container py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading topics...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-destructive">Error loading topics</div>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-8">
      <Helmet>
        <title>Topics for Revision – DSA Tracker</title>
        <meta name="description" content="Track and manage your DSA revision topics." />
        <link rel="canonical" href="/topics" />
      </Helmet>

      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary mb-2">
          Topics for Revision
        </h1>
        <p className="text-muted-foreground">
          Track your progress and manage revision topics systematically
        </p>
      </header>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search topics..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setGlobalFilter('')}>
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topics.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {topics.filter(t => t.status === 'Completed').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {topics.filter(t => t.status === 'In Progress').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Not Started</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {topics.filter(t => t.status === 'Not Started').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Revision Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleRowClick(row.original.id)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="p-4 align-middle">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="h-24 text-center">
                      No topics found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
