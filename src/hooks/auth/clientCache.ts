
import { UserData } from './types';

// Cache for client data with expiration time and a cleanup mechanism
const clientDataCache = new Map<string, { data: UserData | null, timestamp: number }>();
const CACHE_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

// Set a cleanup interval to prevent memory leaks
if (typeof window !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [userId, cacheEntry] of clientDataCache.entries()) {
      if (now - cacheEntry.timestamp > CACHE_EXPIRY_TIME) {
        clientDataCache.delete(userId);
      }
    }
  }, 15 * 60 * 1000); // Run cleanup every 15 minutes
}

/**
 * Checks if cached data is still valid
 */
export const isValidCache = (userId: string): { isValid: boolean, cachedData?: UserData | null } => {
  const cachedData = clientDataCache.get(userId);
  const now = Date.now();
  
  if (cachedData && (now - cachedData.timestamp < CACHE_EXPIRY_TIME)) {
    return { isValid: true, cachedData: cachedData.data };
  }
  
  return { isValid: false };
};

/**
 * Updates the cache with new data
 */
export const updateCache = (userId: string, data: UserData | null): void => {
  clientDataCache.set(userId, { data, timestamp: Date.now() });
};

/**
 * Clears the client data cache
 */
export const clearClientDataCache = (): void => {
  clientDataCache.clear();
};

/**
 * Gets cached data or null if not available
 */
export const getCachedData = (userId: string): UserData | null => {
  const { isValid, cachedData } = isValidCache(userId);
  return isValid ? cachedData || null : null;
};
