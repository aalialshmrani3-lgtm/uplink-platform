import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Filter, X, Save, Share2 } from 'lucide-react';

export interface ChartFilterState {
  startDate: string;
  endDate: string;
  department: string;
  project: string;
  status: string;
}

interface ChartFiltersProps {
  onFilterChange: (filters: ChartFilterState) => void;
  onSaveView?: () => void;
  onShareView?: () => void;
}

export function ChartFilters({ onFilterChange, onSaveView, onShareView }: ChartFiltersProps) {
  const [filters, setFilters] = useState<ChartFilterState>({
    startDate: '',
    endDate: '',
    department: '',
    project: '',
    status: '',
  });

  const handleFilterChange = (key: keyof ChartFilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters: ChartFilterState = {
      startDate: '',
      endDate: '',
      department: '',
      project: '',
      status: '',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <h3 className="font-semibold">Chart Filters</h3>
        </div>
        <div className="flex gap-2">
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={handleReset}>
              <X className="h-4 w-4 mr-1" />
              Reset
            </Button>
          )}
          {onSaveView && (
            <Button variant="outline" size="sm" onClick={onSaveView}>
              <Save className="h-4 w-4 mr-1" />
              Save View
            </Button>
          )}
          {onShareView && (
            <Button variant="outline" size="sm" onClick={onShareView}>
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Start Date</label>
          <Input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-1 block">End Date</label>
          <Input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Department</label>
          <Select value={filters.department} onValueChange={(v) => handleFilterChange('department', v)}>
            <SelectTrigger>
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="hr">HR</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Project</label>
          <Select value={filters.project} onValueChange={(v) => handleFilterChange('project', v)}>
            <SelectTrigger>
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="project1">Project Alpha</SelectItem>
              <SelectItem value="project2">Project Beta</SelectItem>
              <SelectItem value="project3">Project Gamma</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Status</label>
          <Select value={filters.status} onValueChange={(v) => handleFilterChange('status', v)}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}
