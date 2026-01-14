"use client";

import React, { useState, useMemo } from "react";
import type { ProgramDetails } from "./types";
import { MapPin } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

interface SelectedProgramsProps {
  programs?: ProgramDetails[];
  onSelect?: (program: ProgramDetails) => void;
  itemsPerPage?: number;
  activeFilters?: {
    audience?: string;
    province?: string;
    city?: string;
    country?: string;
  };
}

/*
  Render a compact, accessible list of selected programs with pagination.
  Each card is a button that calls onSelect(program) when clicked.
  Cards have consistent styling with proper spacing and hover states.
*/
export function SelectedPrograms({
  programs = [],
  onSelect,
  itemsPerPage = 10,
  activeFilters = {},
}: SelectedProgramsProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(programs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPrograms = useMemo(
    () => programs.slice(startIndex, endIndex),
    [programs, startIndex, endIndex]
  );

  // Reset to page 1 when programs change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [programs.length]);

  // Generate page numbers for pagination
  const pages = useMemo(() => {
    const pageNumbers: (number | string)[] = [];
    if (totalPages > 0) pageNumbers.push(1);
    if (currentPage > 3) pageNumbers.push("ellipsis-start");

    // Show nearby pages
    for (let p = currentPage - 1; p <= currentPage + 1; p++) {
      if (p > 1 && p < totalPages) pageNumbers.push(p);
    }

    // If far from last page, show ellipsis
    if (currentPage < totalPages - 2) pageNumbers.push("ellipsis-end");

    if (totalPages > 1) pageNumbers.push(totalPages);
    return pageNumbers;
  }, [currentPage, totalPages]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of panel when page changes
    const panel = document.querySelector('.side-panel');
    if (panel) {
      panel.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Get active filter labels for display
  const activeFilterLabels = useMemo(() => {
    const labels: string[] = [];
    if (activeFilters.audience && activeFilters.audience !== 'all') {
      labels.push(activeFilters.audience);
    }
    if (activeFilters.province && activeFilters.province !== 'all') {
      labels.push(activeFilters.province);
    }
    if (activeFilters.city && activeFilters.city !== 'all') {
      labels.push(activeFilters.city);
    }
    if (activeFilters.country && activeFilters.country !== 'all') {
      labels.push(activeFilters.country);
    }
    return labels;
  }, [activeFilters]);

  return (
    <div className="flex flex-col h-full">
      {/* Sticky header with Results for */}
      <div className="sticky bg-white z-10 pb-2 px-4 mb-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="text-lg font-medium text-gray-900">
            Results for
          </div>
          {activeFilterLabels.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {activeFilterLabels.map((label, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
                >
                  {label}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-xs text-gray-900">All Programs</div>
          )}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        {programs.length === 0 ? (
          <div className="text-xs text-gray-500">No programs found.</div>
        ) : (
          <>
            <div className="space-y-3">
              {currentPrograms.map((p) => (
                <div
                  key={p.id ?? p.name}
                  className="w-full bg-[#F6F7FA] text-left p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all focus-within:ring-2 focus-within:ring-black focus-within:ring-offset-2 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-black break-words flex-1">
                    {p.name}
                  </div>
                    <div className="text-gray-300 text-xs select-none ml-2">›</div>
                  </div>

                  <div className="text-xs text-gray-600 flex items-start gap-1.5">
                    <MapPin
                      className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5"
                      aria-hidden
                    />
                  <div className="flex-1 break-words">
                    {p.address ?? p.city ?? "No address available"}
                  </div>
                  </div>

                  {p.category && (
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-900 border border-gray-300 w-fit">
                      {p.category}
                    </div>
                  )}

                  <div className="mt-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => onSelect?.(p)}
                      className="bg-black text-white text-xs font-medium px-3 py-1.5 rounded hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-opacity"
                    >
                      View More →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Pagination className="justify-center">
                  <PaginationContent>
                    {/* Previous */}
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {/* Page Numbers */}
                    {pages.map((p, idx) =>
                      p === "ellipsis-start" || p === "ellipsis-end" ? (
                        <PaginationItem key={`ellipsis-${idx}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={p}>
                          <PaginationLink
                            isActive={p === currentPage}
                            onClick={() => handlePageChange(p as number)}
                            className="cursor-pointer"
                          >
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}

                    {/* Next */}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          currentPage < totalPages && handlePageChange(currentPage + 1)
                        }
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
