// Global error handler utilities
import { toast } from "@/hooks/use-toast";

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

export function handleApiError(error: unknown, customMessage?: string): ApiError {
  console.error('API Error:', error);
  
  // Handle network errors
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return {
      message: customMessage || 'Unable to connect to the server. Please check your internet connection.',
      status: 0,
      code: 'NETWORK_ERROR'
    };
  }
  
  // Handle HTTP errors
  if (error instanceof Response) {
    return {
      message: customMessage || `Server error (${error.status}): ${error.statusText}`,
      status: error.status,
      code: 'HTTP_ERROR'
    };
  }
  
  // Handle structured API errors
  if (error && typeof error === 'object' && 'message' in error) {
    return {
      message: customMessage || (error as any).message,
      status: (error as any).status,
      code: (error as any).code
    };
  }
  
  // Generic error fallback
  return {
    message: customMessage || 'An unexpected error occurred. Please try again.',
    code: 'UNKNOWN_ERROR'
  };
}

export function showErrorToast(error: unknown, customMessage?: string) {
  const apiError = handleApiError(error, customMessage);
  
  toast({
    title: "Error",
    description: apiError.message,
    variant: "destructive",
  });
}

// Retry utility for failed requests
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: unknown;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)));
    }
  }
  
  throw lastError;
}

// Development mode error logging
export function logErrorDetails(error: unknown, context?: string) {
  if (process.env.NODE_ENV === 'development') {
    console.group(`Error ${context ? `in ${context}` : ''}`);
    console.error('Error object:', error);
    
    if (error instanceof Error) {
      console.error('Stack trace:', error.stack);
    }
    
    console.groupEnd();
  }
}

// User-friendly error messages for common issues
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection and try again.',
  UNAUTHORIZED: 'You need to sign in to access this feature.',
  FORBIDDEN: 'You don\'t have permission to perform this action.',
  NOT_FOUND: 'The requested resource could not be found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'A server error occurred. Our team has been notified.',
  DATABASE_ERROR: 'Database connection issue. Please try again in a moment.',
  RATE_LIMIT: 'Too many requests. Please wait a moment and try again.',
} as const;