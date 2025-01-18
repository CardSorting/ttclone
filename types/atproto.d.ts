declare module '@atproto/api' {
  export class BskyAgent {
    constructor(config: { service: string });
    login(credentials: { identifier: string; password: string }): Promise<void>;
    getTimeline(options: { limit: number }): Promise<any>;
    uploadBlob(blob: Blob, options: { encoding: string }): Promise<any>;
    post(data: { text: string; embed: any }): Promise<void>;
  }
}