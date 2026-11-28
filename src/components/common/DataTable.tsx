'use client';

import type { ReactNode } from 'react';

export interface DataTableColumn<T> {
  key: string;
  header: ReactNode;
  className?: string;
  render: (row: T, index: number) => ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string;
  emptyState?: ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyState,
}: DataTableProps<T>) {
  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-[#E8DFD1] bg-white shadow-xs">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-[#E8DFD1] bg-[#FAF6F0] text-xs font-bold uppercase tracking-wider text-[#7A6A58]">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={`px-4 py-3.5 ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F0E8DC]">
          {data.map((row, idx) => (
            <tr key={keyExtractor(row, idx)} className="transition hover:bg-[#FAF7F2]/70">
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-3.5 ${col.className || ''}`}>
                  {col.render(row, idx)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
