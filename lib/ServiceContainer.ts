import { FeedSource } from '@/services/FeedService';
import { CacheService } from '@/services/FeedService';
import { FeedService } from '@/services/FeedService';
import { ATProtoFeedSource } from '@/services/ATProtoFeedSource';
import { InMemoryCacheService } from '@/services/InMemoryCacheService';

export class ServiceContainer {
  private static instance: ServiceContainer;
  private services: Map<string, any> = new Map();

  private constructor() {
    this.initializeServices();
  }

  public static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
    }
    return ServiceContainer.instance;
  }

  private initializeServices(): void {
    // Initialize dependencies
    const feedSource = new ATProtoFeedSource();
    const cacheService = new InMemoryCacheService();

    // Configure FeedService
    const feedService = new FeedService(feedSource, cacheService);
    this.services.set('FeedService', feedService);
  }

  public getService<T>(serviceName: string): T {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found`);
    }
    return service as T;
  }
}

export const serviceContainer = ServiceContainer.getInstance();