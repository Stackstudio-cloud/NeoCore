import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Command } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  category: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface SearchBarProps {
  onSearch?: (query: string) => void;
  results?: SearchResult[];
  onSelect?: (result: SearchResult) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ 
  onSearch, 
  results = [], 
  onSelect, 
  placeholder = "Search commands, pages, or documentation...",
  className 
}: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    onSearch?.(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!results.length) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % results.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev <= 0 ? results.length - 1 : prev - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
        break;
    }
  };

  const handleSelect = (result: SearchResult) => {
    onSelect?.(result);
    setIsOpen(false);
    setQuery('');
    inputRef.current?.blur();
  };

  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={cn(
            "w-full pl-10 pr-20 py-2 bg-gray-800/50 border border-gray-600/30 rounded-lg",
            "text-gray-200 placeholder-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50",
            "transition-all duration-200"
          )}
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery('');
                onSearch?.('');
              }}
              className="p-1 h-auto"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Results dropdown */}
      {isOpen && (query || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-sm border border-gray-600/30 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
          {Object.keys(groupedResults).length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No results found</p>
              {query && (
                <p className="text-sm mt-1">Try searching for pages, commands, or documentation</p>
              )}
            </div>
          ) : (
            Object.entries(groupedResults).map(([category, categoryResults]) => (
              <div key={category} className="py-2">
                <div className="px-3 py-1 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {category}
                </div>
                {categoryResults.map((result, index) => {
                  const globalIndex = Object.values(groupedResults)
                    .flat()
                    .indexOf(result);
                  
                  return (
                    <button
                      key={result.id}
                      onClick={() => handleSelect(result)}
                      className={cn(
                        "w-full px-3 py-2 text-left hover:bg-blue-400/10 transition-colors",
                        "flex items-center space-x-3",
                        selectedIndex === globalIndex && "bg-blue-400/20"
                      )}
                    >
                      {result.icon && <result.icon className="w-4 h-4 text-gray-400" />}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-200 truncate">{result.title}</div>
                        {result.description && (
                          <div className="text-xs text-gray-400 truncate">{result.description}</div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}