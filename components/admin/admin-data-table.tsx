import type { AdminTableColumn } from "@/types/admin";

type AdminDataTableProps<Row extends object> = {
  columns: AdminTableColumn<Row>[];
  rows: Row[];
  emptyMessage?: string;
};

function getCellValue<Row extends object>(
  row: Row,
  key: keyof Row | string,
) {
  return row[key as keyof Row];
}

export function AdminDataTable<Row extends object>({
  columns,
  rows,
  emptyMessage = "No records yet.",
}: AdminDataTableProps<Row>) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  scope="col"
                  className={`px-5 py-4 text-left text-xs font-bold uppercase tracking-[0.18em] text-slate-500 ${column.className ?? ""}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length ? (
              rows.map((row, rowIndex) => (
                <tr
                  key={String((row as { id?: unknown }).id ?? rowIndex)}
                  className="align-top"
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={`px-5 py-4 text-slate-700 ${column.className ?? ""}`}
                    >
                      {column.render
                        ? column.render(row)
                        : String(getCellValue(row, column.key) ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-10 text-center text-slate-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
