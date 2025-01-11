// src/components/Layout/NewsFeed.jsx
import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"
import { Newspaper, Flame } from 'lucide-react'
import { newsService } from "../../services/news"
import LoadingSpinner from "../common/LoadingSpinner"

function NewsFeed() {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const data = await newsService.getLatestNews(currentPage);
        setNewsItems(data.articles.map(article => ({
          title: article.title,
          source: article.source.name,
          time: new Date(article.publishedAt).toRelative(),
          url: article.url
        })));
        setTotalPages(data.totalPages);
      } catch (err) {
        setError("Failed to load news. Upgrade News API plan");
        console.error("News fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [currentPage]);

  // If there are fewer than 3 articles on the current page and we're not on page 1,
  // automatically go to the previous page
  useEffect(() => {
    if (!loading && newsItems.length < 3 && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [loading, newsItems.length, currentPage]);

  if (error) {
    return (
      <Card className="h-[400px]">
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex items-center space-x-2">
            <Newspaper className="h-5 w-5" />
            <CardTitle className="text-lg">Fire News Updates</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[332px]">
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[400px] overflow-hidden">
      <CardHeader className="bg-gray-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Newspaper className="h-5 w-5" />
            <CardTitle className="text-lg">News Feed</CardTitle>
          </div>
          {!loading && newsItems.length > 0 && (
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={currentPage >= totalPages}
                  className="p-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y overflow-auto h-[332px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner />
            </div>
          ) : newsItems.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              No current fire news updates available
            </div>
          ) : (
            newsItems.map((item, index) => (
              <div 
                key={index} 
                className="p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => window.open(item.url, '_blank')}
              >
                <h3 className="font-medium mb-1">{item.title}</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <span>{item.source}</span>
                  <span className="mx-2">•</span>
                  <span>{item.time}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default NewsFeed

// import { useEffect, useState } from "react"
// import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"
// import { Newspaper, Flame } from 'lucide-react'
// import { newsService } from "../../services/news"
// import LoadingSpinner from "../common/LoadingSpinner"

// function NewsFeed() {
//   const [newsItems, setNewsItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalResults, setTotalResults] = useState(0);

//   useEffect(() => {
//     const fetchNews = async () => {
//       try {
//         setLoading(true);
//         const data = await newsService.getLatestNews(currentPage);
//         setNewsItems(data.articles.map(article => ({
//           title: article.title,
//           source: article.source.name,
//           time: new Date(article.publishedAt).toRelative(),
//           url: article.url
//         })));
//         setTotalResults(data.totalResults);
//       } catch (err) {
//         setError("Failed to load fire news updates");
//         console.error("News fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNews();
//   }, [currentPage]);

//   if (error) {
//     return (
//       <Card className="h-[400px]">
//         <CardHeader className="bg-gray-50 border-b">
//           <div className="flex items-center space-x-2">
//             <Flame className="h-5 w-5 text-red-500" />
//             <CardTitle className="text-lg">Fire News Updates</CardTitle>
//           </div>
//         </CardHeader>
//         <CardContent className="flex items-center justify-center h-[332px]">
//           <p className="text-red-500">{error}</p>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <Card className="h-[400px] overflow-hidden">
//       <CardHeader className="bg-gray-50 border-b">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <Flame className="h-5 w-5 text-red-500" />
//             <CardTitle className="text-lg">Fire News Updates</CardTitle>
//           </div>
//           {!loading && newsItems.length > 0 && (
//             <div className="flex items-center space-x-4">
//               <div className="text-sm text-gray-500">
//                 Page {currentPage}
//               </div>
//               <div className="flex items-center space-x-2">
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//                   disabled={currentPage === 1}
//                   className="p-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
//                 >
//                   Previous
//                 </button>
//                 <button
//                   onClick={() => setCurrentPage(prev => prev + 1)}
//                   disabled={currentPage * 3 >= totalResults}
//                   className="p-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </CardHeader>
//       <CardContent className="p-0">
//         <div className="divide-y overflow-auto h-[332px]">
//           {loading ? (
//             <div className="flex items-center justify-center h-full">
//               <LoadingSpinner />
//             </div>
//           ) : newsItems.length === 0 ? (
//             <div className="flex items-center justify-center h-full text-gray-500">
//               No current fire news updates available
//             </div>
//           ) : (
//             newsItems
//               // .filter(item => 
//               //   item.title && 
//               //   item.source && 
//               //   !item.title.includes('[Removed]') && 
//               //   !item.source.includes('[Removed]')
//               // )
//               .map((item, index) => (
//               <div 
//                 key={index} 
//                 className="p-4 hover:bg-gray-50 cursor-pointer"
//                 onClick={() => window.open(item.url, '_blank')}
//               >
//                 <h3 className="font-medium mb-1">{item.title}</h3>
//                 <div className="flex items-center text-sm text-gray-500">
//                   <span>{item.source}</span>
//                   <span className="mx-2">•</span>
//                   <span>{item.time}</span>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// export default NewsFeed