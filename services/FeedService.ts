import { FeedItem } from '@/types/feed';
import { login, fetchFeed } from '@/lib/atproto';

interface FeedResponseItem {
  post: {
    uri: string;
    embed?: {
      media?: {
        images?: Array<{
          fullsize: string;
        }>;
      };
    };
  };
}

class FeedService {
  private static instance: FeedService;
  private cache: FeedItem[] = [];
  private lastFetchTime: number = 0;
  private readonly CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

  private constructor() {}

  public static getInstance(): FeedService {
    if (!FeedService.instance) {
      FeedService.instance = new FeedService();
    }
    return FeedService.instance;
  }

  public async getFeed(): Promise<FeedItem[]> {
    const now = Date.now();
    
    if (this.cache.length > 0 && now - this.lastFetchTime < this.CACHE_DURATION) {
      return this.cache;
    }

    try {
      await login();
      const feed = await fetchFeed();
      
      const processedFeed = feed
        .filter((item: FeedResponseItem) => item.post.embed?.media?.images?.[0]?.fullsize)
        .map((item: FeedResponseItem) => ({
          id: item.post.uri,
          uri: item.post.embed?.media?.images?.[0]?.fullsize || '',
        }))
        .filter((item: FeedItem) => item.uri);

      this.cache = processedFeed;
      this.lastFetchTime = now;
      return processedFeed;
    } catch (error) {
      console.error('Failed to fetch feed:', error);
      throw new Error('Failed to load feed');
    }
  }

  public async refreshFeed(): Promise<FeedItem[]> {
    this.lastFetchTime = 0;
    return this.getFeed();
  }
}

export default FeedService.getInstance();