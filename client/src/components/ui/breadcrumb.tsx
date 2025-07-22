import React from 'react';
import { Link } from 'wouter';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn("flex items-center space-x-1 text-sm", className)} aria-label="Breadcrumb">
      <Link href="/" className="flex items-center text-gray-400 hover:text-blue-400 transition-colors">
        <Home className="w-4 h-4" />
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={`breadcrumb-${index}`}>
          <ChevronRight className="w-4 h-4 text-gray-500" />
          
          {item.href ? (
            <Link 
              href={item.href}
              className="flex items-center space-x-1 text-gray-400 hover:text-blue-400 transition-colors"
            >
              {item.icon && <item.icon className="w-4 h-4" />}
              <span>{item.label}</span>
            </Link>
          ) : (
            <span className="flex items-center space-x-1 text-gray-200">
              {item.icon && <item.icon className="w-4 h-4" />}
              <span>{item.label}</span>
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

// Utility hook for generating breadcrumbs based on current path
export function useBreadcrumbs(currentPath: string, customItems?: BreadcrumbItem[]) {
  const pathSegments = currentPath.split('/').filter(Boolean);
  
  const defaultItems: BreadcrumbItem[] = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    const label = segment.charAt(0).toUpperCase() + segment.slice(1);
    
    return {
      label,
      href: index === pathSegments.length - 1 ? undefined : href, // Last item shouldn't be a link
    };
  });

  return customItems || defaultItems;
}