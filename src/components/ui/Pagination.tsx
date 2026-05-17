"use client";

import { cn } from "@/lib/cn";

type PaginationStyle = "sharp" | "radius" | "full";

type PaginationProps = {
  page: number;
  totalPages: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  style?: PaginationStyle;
  showAdvance?: boolean;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  className?: string;
};

const RADIUS: Record<PaginationStyle, string> = {
  sharp: "rounded-none",
  radius: "rounded-lg",
  full: "rounded-full",
};

function Chevron({ direction }: { direction: "left" | "right" | "left-double" | "right-double" }) {
  const path = {
    left: "M15 18l-6-6 6-6",
    right: "M9 18l6-6-6-6",
    "left-double": "M11 18l-6-6 6-6 M19 18l-6-6 6-6",
    "right-double": "M13 18l6-6-6-6 M5 18l6-6-6-6",
  }[direction];
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
}

function pageList(current: number, total: number): Array<number | "ellipsis"> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "ellipsis", total];
  if (current >= total - 3) return [1, "ellipsis", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total];
}

export function Pagination({
  page,
  totalPages,
  pageSize = 7,
  onPageChange,
  style = "sharp",
  showAdvance = true,
  showFirstLast = true,
  showPrevNext = true,
  className,
}: PaginationProps) {
  const radius = RADIUS[style];
  const go = (p: number) => onPageChange?.(Math.max(1, Math.min(totalPages, p)));

  return (
    <div className={cn("flex items-center gap-6 px-6 py-4", className)}>
      {showAdvance && (
        <p className="w-[200px] text-sm text-neutral-500">
          Page {page} of {totalPages}
        </p>
      )}

      <div className="flex flex-1 items-center justify-center gap-2">
        {showFirstLast && (
          <button onClick={() => go(1)} aria-label="First page" className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-700">
            <Chevron direction="left-double" />
          </button>
        )}
        {showPrevNext && (
          <button onClick={() => go(page - 1)} aria-label="Previous page" className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-700">
            <Chevron direction="left" />
          </button>
        )}

        {pageList(page, totalPages).map((p, i) =>
          p === "ellipsis" ? (
            <span key={`e-${i}`} className={cn("px-1.5 py-1.5 text-sm text-neutral-500 border border-neutral-200", radius)}>…</span>
          ) : (
            <button
              key={p}
              onClick={() => go(p)}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                "min-w-8 px-1.5 py-1.5 text-sm font-medium border bg-white",
                p === page
                  ? "border-primary text-primary"
                  : "border-neutral-200 text-neutral-700 hover:bg-neutral-50",
                radius,
              )}
            >
              {p}
            </button>
          ),
        )}

        {showPrevNext && (
          <button onClick={() => go(page + 1)} aria-label="Next page" className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-700">
            <Chevron direction="right" />
          </button>
        )}
        {showFirstLast && (
          <button onClick={() => go(totalPages)} aria-label="Last page" className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-700">
            <Chevron direction="right-double" />
          </button>
        )}
      </div>

      {showAdvance && (
        <div className="flex w-[200px] justify-end">
          <button className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-sm shadow-sm">
            {pageSize} / page
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
