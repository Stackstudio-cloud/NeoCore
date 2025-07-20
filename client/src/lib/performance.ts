// Performance optimization utilities
import React, { useCallback, useRef, useEffect } from 'react';

// Debounce hook for search and input
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Throttle hook for scroll and resize events
export function useThrottle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastExecRef = useRef<number>(0);

  return useCallback(
    ((...args) => {
      const now = Date.now();

      if (now - lastExecRef.current >= delay) {
        func(...args);
        lastExecRef.current = now;
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          func(...args);
          lastExecRef.current = Date.now();
        }, delay - (now - lastExecRef.current));
      }
    }) as T,
    [func, delay]
  );
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = React.useState(false);

  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      options
    );

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [elementRef, options]);

  return isIntersecting;
}

// Virtual scrolling for large lists
export function useVirtualScroll<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 5,
}: {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}) {
  const [scrollTop, setScrollTop] = React.useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    startIndex,
    endIndex,
    setScrollTop,
  };
}

// Memory usage monitoring
export function useMemoryUsage() {
  const [memoryInfo, setMemoryInfo] = React.useState<any>(null);

  useEffect(() => {
    const updateMemoryInfo = () => {
      if ('memory' in performance) {
        setMemoryInfo((performance as any).memory);
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000);

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
}

// Performance metrics tracking
export class PerformanceTracker {
  private static metrics: Map<string, number[]> = new Map();

  static startMeasure(name: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      
      if (!this.metrics.has(name)) {
        this.metrics.set(name, []);
      }
      
      const measurements = this.metrics.get(name)!;
      measurements.push(duration);
      
      // Keep only last 100 measurements
      if (measurements.length > 100) {
        measurements.shift();
      }
      
      console.log(`${name}: ${duration.toFixed(2)}ms`);
    };
  }

  static getMetrics(name: string) {
    const measurements = this.metrics.get(name) || [];
    
    if (measurements.length === 0) {
      return null;
    }

    const sorted = [...measurements].sort((a, b) => a - b);
    const avg = measurements.reduce((sum, val) => sum + val, 0) / measurements.length;
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const p95 = sorted[Math.floor(sorted.length * 0.95)];

    return { avg, min, max, p95, count: measurements.length };
  }

  static getAllMetrics() {
    const result: Record<string, any> = {};
    
    for (const [name] of this.metrics) {
      result[name] = this.getMetrics(name);
    }
    
    return result;
  }
}

// Bundle size analyzer
export function analyzeBundleSize() {
  const scripts = document.querySelectorAll('script[src]');
  const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
  
  return {
    scriptCount: scripts.length,
    stylesheetCount: stylesheets.length,
    scripts: Array.from(scripts).map(script => ({
      src: script.getAttribute('src'),
      size: script.getAttribute('data-size') || 'unknown'
    })),
    stylesheets: Array.from(stylesheets).map(link => ({
      href: link.getAttribute('href'),
      size: link.getAttribute('data-size') || 'unknown'
    }))
  };
}

// Image optimization utilities
export function optimizeImage(
  src: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpeg' | 'png';
  } = {}
): string {
  // For production, you would integrate with a service like Cloudinary or ImageKit
  // For now, return the original source with parameters
  const params = new URLSearchParams();
  
  if (options.width) params.set('w', options.width.toString());
  if (options.height) params.set('h', options.height.toString());
  if (options.quality) params.set('q', options.quality.toString());
  if (options.format) params.set('f', options.format);
  
  return params.toString() ? `${src}?${params}` : src;
}

// Code splitting utility
export function lazyLoad<T>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) {
  return React.lazy(() => 
    importFunc().catch(error => {
      console.error('Failed to load component:', error);
      return { default: fallback || (() => React.createElement('div', null, 'Failed to load')) };
    })
  );
}

// Service Worker registration
export function registerServiceWorker() {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
}