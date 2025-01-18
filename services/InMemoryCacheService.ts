import { CacheService } from './FeedService';
import { FeedItem } from '@/types/feed';

interface CacheEntry {
  value: FeedItem[];
  expiresAt: number;
}

export class InMemoryCacheService implements CacheService {
  private cache: Map<string, CacheEntry> = new Map();

  public get(key: string): FeedItem[] | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.delete(key);
      return null;
    }

    return entry.value;
  }

  public set(key: string, value: FeedItem[], ttl: number): void {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttl
    });
  }

  public delete(key: string): void {
    this.cache.delete(key);
  }
}
