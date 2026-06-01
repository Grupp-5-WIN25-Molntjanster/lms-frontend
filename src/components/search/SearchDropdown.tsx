"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon, FileIcon } from "@/components/icons";
import { Badge } from "@/components/ui/Badge";
import { searchAll } from "@/lib/search";
import type { SearchResult } from "@/lib/search";

export function SearchDropdown() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const doSearch = useCallback(async (q: string) => {
        if (!q.trim()) { setResults([]); setOpen(false); return; }
        setLoading(true); setOpen(true);
        try {
            const data = await searchAll(q);
            setResults(data);
        } catch { /* aborted or network error */ }
        finally { setLoading(false); }
    }, []);

    const handleChange = useCallback((value: string) => {
        setQuery(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => doSearch(value), 300);
    }, [doSearch]);
    const handleSelect = useCallback((result: SearchResult) => {
        setOpen(false); setQuery("");
        router.push(result.url);
    }, [router]);

    // Close on click outside
    useEffect(() => {
        function onClick(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node))
                setOpen(false);
        }
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, []);

    // Close on Escape
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, []);
    return (
        <div ref={containerRef} className="relative flex-1 max-w-[480px]">
            <label className="flex items-center gap-3 rounded-2xl bg-bg px-5 py-3.5">
                <SearchIcon className="shrink-0 text-muted" />
                <input
                    type="search"
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => handleChange(e.target.value)}
                    onFocus={() => { if (results.length > 0) setOpen(true); }}
                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
                />
            </label>
            {open && (
                <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl border border-secondary/10 bg-white p-2 shadow-lg">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        </div>
                    ) : results.length === 0 ? (
                        <p className="py-8 text-center text-sm text-muted">No results found</p>
                    ) : (
                        <ul className="flex flex-col gap-1">
                            {results.map((result) => (
                                <li key={result.id}>
                                    <button
                                        onClick={() => handleSelect(result)}
                                        className="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-bg"
                                    >
                                        <FileIcon className="mt-0.5 shrink-0 text-muted" />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-secondary truncate">
                                                    {result.title}
                                                </span>
                                                <Badge size="sm" color="primary">{result.type}</Badge>
                                            </div>
                                            <p className="mt-0.5 text-xs text-muted truncate">
                                                {result.excerpt}
                                            </p>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                    <p className="border-t border-secondary/10 pt-2 text-center text-xs text-muted">
                        {results.length} result{results.length !== 1 ? "s" : ""}
                    </p>
                </div>
            )}
        </div>
    );
}