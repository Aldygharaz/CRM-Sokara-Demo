"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, X } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useStore } from "@/store/useStore";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface PresetFilter {
  label: string;
  value: string; // The filter key to activate
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchKey?: keyof T;
  presetFilters?: PresetFilter[];
  activePreset?: string | null;
  onPresetChange?: (preset: string | null) => void;
  onRowClick?: (item: T) => void;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  searchPlaceholder = "Search...",
  searchKey,
  presetFilters = [],
  activePreset = null,
  onPresetChange,
  onRowClick,
}: DataTableProps<T>) {
  const { language } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Handle Ctrl+Shift+F to reset filters
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "f") {
        e.preventDefault();
        setSearchTerm("");
        if (onPresetChange) onPresetChange(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onPresetChange]);

  // Filtering
  const filteredData = data.filter((item) => {
    if (!searchTerm || !searchKey) return true;
    const value = item[searchKey as keyof T];
    if (typeof value === "string") {
      return value.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  // Sorting
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if ((aValue as any) < (bValue as any)) return sortConfig.direction === "asc" ? -1 : 1;
    if ((aValue as any) > (bValue as any)) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Preset Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {presetFilters.map((preset) => (
            <button
              key={preset.value}
              onClick={() => onPresetChange && onPresetChange(activePreset === preset.value ? null : preset.value)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-all border",
                activePreset === preset.value
                  ? "bg-brand text-white border-brand shadow-sm shadow-brand/20"
                  : "bg-elevated text-text-secondary border-border-divider hover:border-text-muted hover:text-text-primary"
              )}
            >
              {preset.label}
            </button>
          ))}
          {(activePreset || searchTerm) && (
            <button
              onClick={() => {
                setSearchTerm("");
                if (onPresetChange) onPresetChange(null);
              }}
              className="px-3 py-1.5 rounded-full text-sm font-medium text-text-muted hover:text-text-primary transition-colors flex items-center gap-1"
              title="Reset Filters (Ctrl+Shift+F)"
            >
              <X className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>

        {/* Search */}
        {searchKey && (
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-elevated border border-border-divider rounded-lg pl-9 pr-4 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
            />
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-canvas border-b border-border-divider text-text-muted uppercase text-xs">
              <tr>
                {columns.map((col, index) => (
                  <th
                    key={index}
                    className={cn(
                      "px-6 py-4 font-semibold tracking-wider",
                      col.sortable && "cursor-pointer hover:text-text-primary select-none transition-colors"
                    )}
                    onClick={() => col.sortable && handleSort(col.accessorKey as string)}
                  >
                    <div className="flex items-center gap-1.5">
                      {col.header}
                      {col.sortable && sortConfig?.key === col.accessorKey && (
                        sortConfig.direction === "asc" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-divider">
              {paginatedData.map((item, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={cn(
                    "bg-elevated transition-colors animate-in fade-in slide-in-from-bottom-2 duration-300",
                    onRowClick && "cursor-pointer hover:bg-hover"
                  )}
                  style={{ animationFillMode: "both", animationDelay: `${rowIndex * 40}ms` }}
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 text-text-primary whitespace-nowrap">
                      {col.cell ? col.cell(item) : String(item[col.accessorKey as keyof T] || "-")}
                    </td>
                  ))}
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-base border border-border-divider flex items-center justify-center">
                        <Search className="w-8 h-8 text-text-muted" />
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-text-primary">
                          {language === 'id' ? 'Tidak ada data ditemukan' : 'No data found'}
                        </h4>
                        <p className="text-sm text-text-muted mt-1 max-w-sm mx-auto">
                          {language === 'id' 
                            ? 'Kami tidak dapat menemukan data yang cocok dengan filter atau pencarian Anda. Coba sesuaikan ulang parameter Anda.' 
                            : 'We couldn’t find any data matching your filter or search. Try adjusting your parameters.'}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-canvas border-t border-border-divider">
            <span className="text-sm text-text-muted">
              {language === 'id' ? 'Menampilkan' : 'Showing'}{" "}
              <span className="font-medium text-text-primary">{(currentPage - 1) * itemsPerPage + 1}</span>{" "}
              {language === 'id' ? 'ke' : 'to'}{" "}
              <span className="font-medium text-text-primary">
                {Math.min(currentPage * itemsPerPage, sortedData.length)}
              </span>{" "}
              {language === 'id' ? 'dari' : 'of'}{" "}
              <span className="font-medium text-text-primary">{sortedData.length}</span>{" "}
              {language === 'id' ? 'hasil' : 'results'}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
