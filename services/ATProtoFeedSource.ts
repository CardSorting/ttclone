import { FeedItem } from '@/types/feed';
import { login, fetchFeed } from '@/lib/atproto';
import { FeedSource } from './FeedService';

interface ATProtoFeedItem {
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

export class ATProtoFeedSource implements FeedSource {
  private isAuthenticated = false;

  public async fetchFeed(): Promise<unknown[]> {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }
    return fetchFeed();
  }

  public processFeedItem(rawItem: unknown): FeedItem | null {
    const item = rawItem as ATProtoFeedItem;
    
    if (!item.post.embed?.media?.images?.[0]?.fullsize) {
      return null;
    }

    return {
      id: item.post.uri,
      uri: item.post.embed.media.images[0].fullsize,
      metadata: {
        createdAt: new Date().toISOString(),
        source: 'ATProto'
      }
    };
  }

  private async authenticate(): Promise<void> {
    try {
      await login();
      this.isAuthenticated = true;
    } catch (error) {
      console.error('Authentication failed:', error);
      throw new Error('Failed to authenticate with AT Protocol');
    }
  }
}
