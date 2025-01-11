// // src/services/news.js
// const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
// const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

// // Define trusted news sources
// const TRUSTED_SOURCES = [
//   'bbc-news',
//   'cnn',
//   'the-washington-post',
//   'the-new-york-times',
//   'associated-press',
//   'reuters',
//   'los-angeles-times',
//   'abc-news',
//   'cbs-news',
//   'nbc-news'
// ].join(',');

// export const newsService = {
//   getLatestNews: async (page = 1) => {
//     try {
//       // Using multiple relevant search terms for better coverage
//       const searchTerms = '(wildfire OR fire OR "cal fire" OR evacuation) AND ("los angeles" OR "LA" OR "southern california" OR "pacific palisades" OR "brentwood")';
      
//       const response = await fetch(
//         `${NEWS_API_BASE_URL}/everything?` + 
//         `q=${encodeURIComponent(searchTerms)}` +
//         `&domains=bbc.com,cnn.com,nytimes.com,washingtonpost.com,latimes.com,apnews.com,reuters.com` +
//         `&sources=${TRUSTED_SOURCES}` +
//         `&language=en` +
//         `&sortBy=publishedAt` +
//         `&pageSize=3` +
//         `&page=${page}` +
//         `&apiKey=${NEWS_API_KEY}`
//       );

//       if (!response.ok) {
//         throw new Error('Failed to fetch news');
//       }

//       const data = await response.json();
      
//       // Additional filter to ensure relevance and recency
//       const filteredArticles = data.articles
//         .filter(article => {
//           const isRecent = new Date(article.publishedAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
//           const isValidArticle = article.title && 
//                                 article.source && 
//                                 article.source.name && 
//                                 article.title !== '[Removed]' &&
//                                 !article.title.includes('[Removed]') &&
//                                 article.source.name !== '[Removed]' &&
//                                 !article.source.name.includes('[Removed]');
          
//           return isRecent && isValidArticle;
//         })
//         .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)); // Ensure newest first

//       return {
//         articles: filteredArticles,
//         totalResults: data.totalResults
//       };
//     } catch (error) {
//       console.error('Error fetching news:', error);
//       throw error;
//     }
//   }
// };

// src/services/news.js
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
const ARTICLES_PER_PAGE = 3;

// Define trusted news sources
const TRUSTED_SOURCES = [
  'bbc-news',
  'cnn',
  'the-washington-post',
  'the-new-york-times',
  'associated-press',
  'reuters',
  'los-angeles-times',
  'abc-news',
  'cbs-news',
  'nbc-news'
].join(',');

let cachedArticles = null;
let lastFetchTime = null;

export const newsService = {
  getLatestNews: async (page = 1) => {
    try {
      // Check if we need to fetch new data
      const now = Date.now();
      if (!cachedArticles || !lastFetchTime || (now - lastFetchTime) > CACHE_DURATION) {
        const searchTerms = '(wildfire OR fire OR "cal fire" OR evacuation) AND ("los angeles" OR "LA" OR "southern california" OR "pacific palisades" OR "brentwood")';
        
        const response = await fetch(
          `${NEWS_API_BASE_URL}/everything?` + 
          `q=${encodeURIComponent(searchTerms)}` +
          `&domains=bbc.com,cnn.com,nytimes.com,washingtonpost.com,latimes.com,apnews.com,reuters.com` +
          `&sources=${TRUSTED_SOURCES}` +
          `&language=en` +
          `&sortBy=publishedAt` +
          `&pageSize=20` + // Fetch 20 articles at once
          `&apiKey=${NEWS_API_KEY}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }

        const data = await response.json();
        
        // Filter and process all articles at once
        cachedArticles = data.articles
          .filter(article => {
            const isRecent = new Date(article.publishedAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            const isValidArticle = article.title && 
                                 article.source && 
                                 article.source.name && 
                                 article.title !== '[Removed]' &&
                                 !article.title.includes('[Removed]') &&
                                 article.source.name !== '[Removed]' &&
                                 !article.source.name.includes('[Removed]');
            
            return isRecent && isValidArticle;
          })
          .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

        lastFetchTime = now;
      }

      // Calculate pagination
      const totalArticles = cachedArticles.length;
      const startIndex = (page - 1) * ARTICLES_PER_PAGE;
      const endIndex = startIndex + ARTICLES_PER_PAGE;
      const paginatedArticles = cachedArticles.slice(startIndex, endIndex);

      // Calculate total pages
      const totalPages = Math.ceil(totalArticles / ARTICLES_PER_PAGE);

      return {
        articles: paginatedArticles,
        totalResults: totalArticles,
        totalPages,
        currentPage: page
      };
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  },

  // Helper method to clear cache if needed
  clearCache: () => {
    cachedArticles = null;
    lastFetchTime = null;
  }
};