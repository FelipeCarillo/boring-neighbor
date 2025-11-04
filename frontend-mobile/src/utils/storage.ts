import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './constants';

/**
 * Salva um item no AsyncStorage
 */
export const saveItem = async (key: string, value: any): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Error saving item to storage:', error);
    throw error;
  }
};

/**
 * Recupera um item do AsyncStorage
 */
export const getItem = async <T = any>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error getting item from storage:', error);
    return null;
  }
};

/**
 * Remove um item do AsyncStorage
 */
export const removeItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing item from storage:', error);
    throw error;
  }
};

/**
 * Limpa todos os itens do AsyncStorage
 */
export const clearAll = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
};

// =============== Auth Storage Helpers ===============

export const saveAuthTokens = async (accessToken: string, refreshToken: string): Promise<void> => {
  try {
    await Promise.all([
      saveItem(STORAGE_KEYS.TOKEN, accessToken),
      saveItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken),
    ]);
  } catch (error) {
    console.error('Error saving auth tokens:', error);
    throw error;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return await getItem<string>(STORAGE_KEYS.TOKEN);
};

export const getRefreshToken = async (): Promise<string | null> => {
  return await getItem<string>(STORAGE_KEYS.REFRESH_TOKEN);
};

export const clearAuthTokens = async (): Promise<void> => {
  try {
    await Promise.all([
      removeItem(STORAGE_KEYS.TOKEN),
      removeItem(STORAGE_KEYS.REFRESH_TOKEN),
      removeItem(STORAGE_KEYS.USER),
    ]);
  } catch (error) {
    console.error('Error clearing auth tokens:', error);
    throw error;
  }
};

// =============== User Storage Helpers ===============

export const saveUser = async (user: any): Promise<void> => {
  return await saveItem(STORAGE_KEYS.USER, user);
};

export const getUser = async <T = any>(): Promise<T | null> => {
  return await getItem<T>(STORAGE_KEYS.USER);
};

// =============== Cache Storage Helpers ===============

export const saveConstructionsCache = async (constructions: any[]): Promise<void> => {
  return await saveItem(STORAGE_KEYS.CONSTRUCTIONS_CACHE, {
    data: constructions,
    timestamp: Date.now(),
  });
};

export const getConstructionsCache = async (): Promise<{ data: any[]; timestamp: number } | null> => {
  return await getItem(STORAGE_KEYS.CONSTRUCTIONS_CACHE);
};

// =============== Pending Uploads Helpers ===============

export const savePendingUpload = async (upload: any): Promise<void> => {
  try {
    const pending = await getItem<any[]>(STORAGE_KEYS.PENDING_UPLOADS) || [];
    pending.push({ ...upload, id: Date.now().toString(), createdAt: Date.now() });
    await saveItem(STORAGE_KEYS.PENDING_UPLOADS, pending);
  } catch (error) {
    console.error('Error saving pending upload:', error);
    throw error;
  }
};

export const getPendingUploads = async (): Promise<any[]> => {
  return await getItem<any[]>(STORAGE_KEYS.PENDING_UPLOADS) || [];
};

export const removePendingUpload = async (uploadId: string): Promise<void> => {
  try {
    const pending = await getItem<any[]>(STORAGE_KEYS.PENDING_UPLOADS) || [];
    const filtered = pending.filter((item) => item.id !== uploadId);
    await saveItem(STORAGE_KEYS.PENDING_UPLOADS, filtered);
  } catch (error) {
    console.error('Error removing pending upload:', error);
    throw error;
  }
};

export const clearPendingUploads = async (): Promise<void> => {
  return await removeItem(STORAGE_KEYS.PENDING_UPLOADS);
};

