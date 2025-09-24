import React from 'react';

type Column<T> = {
  key: string;
  header: string;
  className?: string;
  render?: (row: T) => React.ReactNode;
};

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyLabel?: string;
}

export function DataTable<T extends { uuid?: string | number }>({ columns, data, emptyLabel }: DataTableProps<T>) {
  if (!data || data.length === 0) {
    return (
      <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
        {emptyLabel || 'No data available'}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
        <thead className="bg-gray-50 dark:bg-dark-700/50">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className={`px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${c.className || ''}`}>{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
          {data.map((row, idx) => (
            <tr key={(row as any).uuid ?? idx}>
              {columns.map((c) => (
                <td key={c.key} className={`px-4 py-3 text-sm ${c.className || ''}`}>
                  {c.render ? c.render(row) : (row as any)[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;


