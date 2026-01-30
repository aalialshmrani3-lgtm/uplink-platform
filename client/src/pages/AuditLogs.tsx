import { useState } from 'react';
import { trpc } from '../lib/trpc';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { FileText, Download, Filter, Search } from 'lucide-react';

export default function AuditLogs() {
  const [filters, setFilters] = useState({
    resource: '',
    action: '',
    status: '' as '' | 'success' | 'failure',
    startDate: '',
    endDate: '',
  });
  const [page, setPage] = useState(0);
  const limit = 50;

  const { data: logs, isLoading } = trpc.audit.getAllLogs.useQuery({
    limit,
    offset: page * limit,
    ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== '')),
  });

  const { data: count } = trpc.audit.getLogsCount.useQuery(
    Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''))
  );

  const { data: byResource } = trpc.audit.getLogsByResource.useQuery();
  const { data: byAction } = trpc.audit.getLogsByAction.useQuery();

  const handleExport = () => {
    if (!logs) return;
    const csv = [
      ['ID', 'User ID', 'Action', 'Resource', 'Resource ID', 'Status', 'IP', 'Created At'].join(','),
      ...logs.map(log => [
        log.id,
        log.userId || 'System',
        log.action,
        log.resource,
        log.resourceId || '',
        log.status,
        log.ipAddress || '',
        new Date(log.createdAt).toISOString(),
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${Date.now()}.csv`;
    a.click();
  };

  const totalPages = Math.ceil((count || 0) / limit);

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Audit Logs
          </h1>
          <p className="text-muted-foreground mt-1">
            Track all system activities and user actions
          </p>
        </div>
        <Button onClick={handleExport} disabled={!logs || logs.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Logs</div>
          <div className="text-2xl font-bold">{count?.toLocaleString() || 0}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Resources Tracked</div>
          <div className="text-2xl font-bold">{byResource?.length || 0}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Action Types</div>
          <div className="text-2xl font-bold">{byAction?.length || 0}</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Input
            placeholder="Resource..."
            value={filters.resource}
            onChange={(e) => setFilters({ ...filters, resource: e.target.value })}
          />
          <Input
            placeholder="Action..."
            value={filters.action}
            onChange={(e) => setFilters({ ...filters, action: e.target.value })}
          />
          <Select value={filters.status} onValueChange={(v: any) => setFilters({ ...filters, status: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Status..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="failure">Failure</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          />
          <Input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          />
        </div>
      </Card>

      {/* Logs Table */}
      <Card className="p-4">
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : !logs || logs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No logs found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">ID</th>
                    <th className="text-left p-2">User</th>
                    <th className="text-left p-2">Action</th>
                    <th className="text-left p-2">Resource</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">IP</th>
                    <th className="text-left p-2">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-accent">
                      <td className="p-2">{log.id}</td>
                      <td className="p-2">{log.userId || 'System'}</td>
                      <td className="p-2">
                        <Badge variant="outline">{log.action}</Badge>
                      </td>
                      <td className="p-2">{log.resource}</td>
                      <td className="p-2">
                        <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                          {log.status}
                        </Badge>
                      </td>
                      <td className="p-2 text-sm text-muted-foreground">{log.ipAddress || '-'}</td>
                      <td className="p-2 text-sm">{new Date(log.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Page {page + 1} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= totalPages - 1}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
