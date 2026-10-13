'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { searchTickers } from '@/lib/api';
import { useRouter } from 'next/navigation';
import type { SearchResult } from '@/lib/data/types';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const search = useCallback(async (q: string) => {
    if (q.length < 1) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    setIsLoading(true);
    setIsOpen(true);
    try {
      setResults(await searchTickers(q));
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);
    setSelectedIndex(-1);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => search(value), 300);
  };

  const handleSelect = (ticker: string) => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.blur();
    router.push(`/stock/${encodeURIComponent(ticker.toUpperCase())}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0) handleSelect(results[selectedIndex].ticker);
      else if (query.trim()) handleSelect(query.trim());
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative w-full max-w-xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Analyze a ticker, e.g. AAPL"
          className="w-full pl-10 pr-10 py-2.5 bg-surface-container border border-border-default rounded-xl text-sm text-foreground-emphasis placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]); setIsOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-2 w-full bg-surface-elevated border border-border-default rounded-xl shadow-xl overflow-hidden z-50"
        >
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-gray-400">Searching...</div>
          ) : results.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-400">No matches. Press Enter to analyze &quot;{query.toUpperCase()}&quot;.</div>
          ) : (
            <ul>
              {results.map((result, index) => (
                <li
                  key={result.ticker}
                  onClick={() => handleSelect(result.ticker)}
                  className={cn(
                    'px-4 py-3 cursor-pointer flex items-center justify-between hover:bg-white/5 transition-colors',
                    index === selectedIndex && 'bg-white/5'
                  )}
                >
                  <div className="min-w-0 truncate">
                    <span className="font-medium text-foreground-emphasis">{result.ticker}</span>
                    <span className="ml-2 text-sm text-gray-400">{result.name}</span>
                  </div>
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{result.exchange}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
