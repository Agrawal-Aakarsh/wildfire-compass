import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"
import { MessageCircle } from 'lucide-react'
import { blueskyService } from "../../services/bluesky"
import LoadingSpinner from "../common/LoadingSpinner"

function SocialFeed() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fallback data in case BlueSky is down
  const fallbackUpdates = [
    {
      author: "@CAL_FIRE",
      displayName: "CAL FIRE",
      content: "For the latest official fire updates, please visit fire.ca.gov",
      time: "Just now"
    },
    {
      author: "@CalOES",
      displayName: "Cal OES",
      content: "Stay prepared and have an evacuation plan ready. Visit caloes.ca.gov for emergency preparedness guides.",
      time: "1h ago"
    },
    {
      author: "@NWS",
      displayName: "NWS Los Angeles",
      content: "Monitor local weather conditions and fire warnings at weather.gov",
      time: "2h ago"
    }
  ];


  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        setLoading(true);
        const posts = await blueskyService.getLatestPosts();
        const formattedPosts = posts.map(post => ({
          author: post.author,
          displayName: post.displayName,
          content: post.content,
          time: new Date(post.timestamp).toRelative(),
          id: post.id
        }));
        setUpdates(formattedPosts.length > 0 ? formattedPosts : fallbackUpdates);
      } catch (err) {
        setUpdates(fallbackUpdates);
        setError("Failed to load social updates");
        console.error("Social feed error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
    // Refresh every 5 minutes
    const interval = setInterval(fetchUpdates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <Card className="h-[400px]">
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <CardTitle className="text-lg">Social Updates (from BlueSky) </CardTitle>
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
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5" />
          <CardTitle className="text-lg">Social Updates (from BlueSky) </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y overflow-auto h-[332px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner />
            </div>
          ) : (
            updates.map((update, index) => (
              <div key={update.id || index} className="p-4 hover:bg-gray-50">
                <div className="flex items-center mb-1">
                  <span className="font-medium text-blue-500">@{update.displayName}</span>
                  <span className="text-sm text-gray-500 ml-2">{update.time}</span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{update.content}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )

}

export default SocialFeed