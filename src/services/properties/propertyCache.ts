
import { Property } from "@/types/property";

// Cache for property data with expiration time
const propertyCache = new Map<string, { data: Property[]; timestamp: number; totalCount: number }>();
const CACHE_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Property cache service that handles caching of property data
 */
export const propertyCache = {
  /**
   * Retrieves cached property data if available and not expired
   */
  get(page: number, pageSize: number): { data: Property[]; totalCount: number } | null {
    const cacheKey = `properties_${page}_${pageSize}`;
    const cachedData = propertyCache.get(cacheKey);
    const now = Date.now();
    
    if (cachedData && (now - cachedData.timestamp < CACHE_EXPIRY_TIME)) {
      console.log("Using cached property data for page:", page);
      return { 
        data: cachedData.data,
        totalCount: cachedData.totalCount
      };
    }
    
    return null;
  },
  
  /**
   * Stores property data in the cache
   */
  set(page: number, pageSize: number, data: Property[], totalCount: number): void {
    const cacheKey = `properties_${page}_${pageSize}`;
    propertyCache.set(cacheKey, { 
      data,
      timestamp: Date.now(),
      totalCount
    });
  },
  
  /**
   * Clears all cached property data
   */
  clear(): void {
    propertyCache.clear();
  }
};

// Add automatic cleanup to prevent memory leaks
if (typeof window !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, cacheEntry] of propertyCache.entries()) {
      if (now - cacheEntry.timestamp > CACHE_EXPIRY_TIME) {
        propertyCache.delete(key);
      }
    }
  }, 15 * 60 * 1000); // Run cleanup every 15 minutes
}
