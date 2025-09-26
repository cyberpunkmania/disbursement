import React from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react';

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
  const items = Array.isArray(data) ? data : [];

  return (
    <Table
      aria-label="Data table"
      removeWrapper
    >
      <TableHeader columns={columns.map((c) => ({ key: c.key, name: c.header, className: c.className }))}>
        {(column: any) => (
          <TableColumn key={column.key} className={column.className}>{column.name}</TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={emptyLabel || 'No data available'} items={items}>
        {(row: T, rowIndex: number) => (
          <TableRow key={(row as any).uuid ?? rowIndex}>
            {(columnKey: React.Key) => {
              const col = columns.find((c) => c.key === columnKey);
              return (
                <TableCell key={String(columnKey)} className={col?.className}>
                  {col?.render ? col.render(row) : (row as any)[String(columnKey)]}
                </TableCell>
              );
            }}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default DataTable;



