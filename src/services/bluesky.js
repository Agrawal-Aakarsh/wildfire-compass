// src/services/bluesky.js
import { BskyAgent } from '@atproto/api';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache
const agent = new BskyAgent({ service: 'https://bsky.social' });

// Official emergency accounts to follow
const EMERGENCY_ACCOUNTS = [
  'calfire.bsky.social',
  'governor.ca.gov',
  'lapd.bsky.social',
  'lafd.bsky.social',
  'nws.bsky.social'
];

let cachedPosts = null;
let lastFetchTime = null;

export const blueskyService = {
  init: async () => {
    try {
      await agent.login({
        identifier: import.meta.env.VITE_BSKY_USERNAME,
        password: import.meta.env.VITE_BSKY_PASSWORD
      });
    } catch (error) {
      console.error('Failed to initialize Bluesky service:', error);
      throw error;
    }
  },

  getLatestPosts: async () => {
    try {
      // Check cache first
      const now = Date.now();
      if (cachedPosts && lastFetchTime && (now - lastFetchTime) < CACHE_DURATION) {
        return cachedPosts;
      }

      // Initialize if not already done
      if (!agent.session) {
        await blueskyService.init();
      }

      // Fetch posts from all emergency accounts
      const allPosts = [];
      
      for (const account of EMERGENCY_ACCOUNTS) {
        try {
          // Get the DID for the account
          const profile = await agent.getProfile({ actor: account });
          
          // Fetch recent posts
          const response = await agent.getAuthorFeed({ actor: profile.data.did });
          
          // Process posts
          const posts = response.data.feed
            .filter(post => post.post?.record?.text) // Ensure post has content
            .map(post => ({
              id: post.post.cid,
              author: account,
              displayName: profile.data.displayName || account,
              content: post.post.record.text,
              timestamp: new Date(post.post.indexedAt),
            }));
            
          allPosts.push(...posts);
        } catch (err) {
          console.warn(`Failed to fetch posts for ${account}:`, err);
          continue;
        }
      }

      // Sort by timestamp and take most recent
      const sortedPosts = allPosts
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 10); // Keep top 10 most recent posts

      // Update cache
      cachedPosts = sortedPosts;
      lastFetchTime = now;

      return sortedPosts;
    } catch (error) {
      console.error('Failed to fetch Bluesky posts:', error);
      throw error;
    }
  },

  clearCache: () => {
    cachedPosts = null;
    lastFetchTime = null;
  }
};