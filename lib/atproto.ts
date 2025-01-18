import { BskyAgent } from '@atproto/api';
import 'dotenv/config';

if (!process.env.ATPROTO_USERNAME || !process.env.ATPROTO_PASSWORD) {
  throw new Error('ATPROTO_USERNAME and ATPROTO_PASSWORD must be defined in .env');
}

const agent = new BskyAgent({
  service: 'https://bsky.social',
});

export { agent, BskyAgent };

export async function login() {
  await agent.login({
    identifier: process.env.ATPROTO_USERNAME as string,
    password: process.env.ATPROTO_PASSWORD as string,
  });
}

export async function fetchFeed() {
  const response = await agent.getTimeline({
    limit: 20,
  });
  return response.data.feed;
}