
import { UserData } from './types';

// Cache pour les données client avec temps d'expiration
const clientDataCache = new Map<string, { data: UserData | null, timestamp: number }>();
const CACHE_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes en millisecondes

/**
 * Vérifie si les données en cache sont encore valides
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
 * Met à jour le cache avec de nouvelles données
 */
export const updateCache = (userId: string, data: UserData | null): void => {
  clientDataCache.set(userId, { data, timestamp: Date.now() });
};

/**
 * Vide le cache des données client
 */
export const clearClientDataCache = (): void => {
  clientDataCache.clear();
};
