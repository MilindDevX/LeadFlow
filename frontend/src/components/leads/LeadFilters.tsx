import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { LeadFilters, LEAD_STATUSES, LEAD_SOURCES, DEFAULT_FILTERS } from '@/types';

interface LeadFiltersBarProps {
  filters: LeadFilters;
  onFilterChange: (updates: Partial<LeadFilters>) => void;
  onSearchChange: (value: string) => void; // Separate to handle debounce at page level
  searchInput: string; // Raw (non-debounced) value for display
}

const statusOptions = [
  { value: '', label: 'All Statuses' },
  ...LEAD_STATUSES.map((s) => ({ value: s, label: s })),
];

const sourceOptions = [
  { value: '', label: 'All Sources' },
  ...LEAD_SOURCES.map((s) => ({ value: s, label: s })),
];

const sortOptions = [
  { value: 'latest', label: 'Latest First' },
  { value: 'oldest', label: 'Oldest First' },
];

export const LeadFiltersBar: React.FC<LeadFiltersBarProps> = ({
  filters,
  onFilterChange,
  onSearchChange,
  searchInput,
}) => {
  const hasActiveFilters =
    filters.status !== DEFAULT_FILTERS.status ||
    filters.source !== DEFAULT_FILTERS.source ||
    filters.search !== DEFAULT_FILTERS.search ||
    filters.sort !== DEFAULT_FILTERS.sort;

  const handleReset = () => {
    onSearchChange('');
    onFilterChange({
      status: '',
      source: '',
      sort: 'latest',
      page: 1,
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="w-64">
        <Input
          placeholder="Search by name or email..."
          icon={<Search size={14} />}
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Status filter */}
      <div className="w-40">
        <Select
          options={statusOptions}
          value={filters.status}
          onChange={(e) => onFilterChange({ status: e.target.value, page: 1 })}
        />
      </div>

      {/* Source filter */}
      <div className="w-40">
        <Select
          options={sourceOptions}
          value={filters.source}
          onChange={(e) => onFilterChange({ source: e.target.value, page: 1 })}
        />
      </div>

      {/* Sort */}
      <div className="w-36">
        <Select
          options={sortOptions}
          value={filters.sort}
          onChange={(e) =>
            onFilterChange({ sort: e.target.value as 'latest' | 'oldest', page: 1 })
          }
        />
      </div>

      {/* Clear filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          icon={<X size={14} />}
        >
          Clear
        </Button>
      )}
    </div>
  );
};
