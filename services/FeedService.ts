import { FeedItem } from '@/types/feed';

export interface FeedSource {
  fetchFeed(): Promise<unknown[]>;
  processFeedItem(rawItem: unknown): FeedItem | null;
}

export interface CacheService {
  get(key: string): FeedItem[] | null;
  set(key: string, value: FeedItem[], ttl: number): void;
  delete(key: string): void;
}

export class FeedService {
  private feedSource: FeedSource;
  private cacheService: CacheService;
  private readonly CACHE_KEY = 'feed_cache';
  private readonly CACHE_TTL = 1000 * 60 * 5; // 5 minutes

  constructor(feedSource: FeedSource, cacheService: CacheService) {
    this.feedSource = feedSource;
    this.cacheService = cacheService;
  }

  public async getFeed(): Promise<FeedItem[]> {
    const cachedFeed = this.cacheService.get(this.CACHE_KEY);
    if (cachedFeed) {
      return cachedFeed;
    }

    try {
      const rawFeed = await this.feedSource.fetchFeed();
      const processedFeed = rawFeed
        .map((item) => this.feedSource.processFeedItem(item))
        .filter((item): item is FeedItem => item !== null);

      this.cacheService.set(this.CACHE_KEY, processedFeed, this.CACHE_TTL);
      return processedFeed;
    } catch (error) {
      console.error('Failed to fetch feed:', error);
      throw new Error('Failed to load feed');
    }
  }

  public async refreshFeed(): Promise<FeedItem[]> {
    this.cacheService.delete(this.CACHE_KEY);
    return this.getFeed();
  }
}
