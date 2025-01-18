export interface FeedItem {
  id: string;
  uri: string;
  metadata?: {
    createdAt: string;
    source: string;
    [key: string]: unknown;
  };
}
