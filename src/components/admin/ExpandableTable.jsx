import React, { useState } from "react";
import { ChevronDown, Plus, Minus, SearchX } from "lucide-react";

export default function ExpandableTable({
  columns,
  rows,
  renderCell,
  renderExpanded,
  emptyText = "No records matching your search",
}) {
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleRow = (id) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="bg-[#f6f8f8] p-6 rounded-full mb-4">
          <SearchX className="text-[#4c9a86] size-10" strokeWidth={1.5} />
        </div>
        <p className="text-[#0d1b18] font-[900] uppercase tracking-widest text-xs mb-1">Null Result</p>
        <p className="text-[#4c9a86] font-bold text-sm">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-[#f6f8f8]">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="sticky top-0 z-10 text-left px-8 py-5 text-[11px] font-[900] uppercase tracking-[0.2em] text-[#4c9a86] border-b-2 border-[#e7f3f0] whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
              <th className="sticky top-0 z-10 text-right px-8 py-5 text-[11px] font-[900] uppercase tracking-[0.2em] text-[#4c9a86] border-b-2 border-[#e7f3f0]">
                Expansion
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e7f3f0]">
            {rows.map((row) => {
              const isExpanded = expandedRows.has(row.id);
              return (
                <React.Fragment key={row.id}>
                  {/* Main Row */}
                  <tr 
                    className={`group transition-all duration-200 ${
                      isExpanded ? "bg-[#f6f8f8]/50" : "hover:bg-[#f6f8f8]/30"
                    }`}
                  >
                    {columns.map((col, idx) => (
                      <td
                        key={idx}
                        className="px-8 py-6 text-sm text-[#0d1b18] font-medium"
                      >
                        {renderCell(row, col)}
                      </td>
                    ))}
                    
                    {/* Expand Toggle Button */}
                    <td className="px-8 py-6 text-right">
                      <button
                        onClick={() => toggleRow(row.id)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all font-[900] text-[10px] uppercase tracking-widest ${
                          isExpanded 
                          ? "bg-[#0d1b18] border-[#0d1b18] text-white shadow-lg shadow-black/10" 
                          : "bg-white border-[#e7f3f0] text-[#0d1b18] hover:border-[#11d4a4]"
                        }`}
                      >
                        {isExpanded ? (
                          <>
                            <Minus className="size-3" strokeWidth={4} />
                            <span>Collapse</span>
                          </>
                        ) : (
                          <>
                            <Plus className="size-3 text-[#11d4a4]" strokeWidth={4} />
                            <span>Details</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Content Area */}
                  {isExpanded && (
                    <tr className="animate-in fade-in slide-in-from-top-1 duration-300">
                      <td colSpan={columns.length + 1} className="p-0">
                        <div className="mx-8 mb-6 mt-2 p-8 bg-white border-2 border-[#11d4a4]/20 rounded-[32px] shadow-sm">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="size-1.5 rounded-full bg-[#11d4a4] animate-pulse" />
                            <span className="text-[10px] font-[900] uppercase tracking-[0.3em] text-[#11d4a4]">
                              Extended Data View
                            </span>
                          </div>
                          {renderExpanded(row)}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}