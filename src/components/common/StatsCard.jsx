// src/components/common/StatsCard.jsx
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"

function StatsCard({ title, value, icon: Icon }) {
  const isLoading = value === 'Loading...';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {Icon && (
          <Icon className={`h-4 w-4 ${isLoading ? 'text-gray-300' : 'text-muted-foreground'}`} />
        )}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${isLoading ? 'text-gray-300' : ''}`}>
          {value}
        </div>
      </CardContent>
    </Card>
  )
}

export default StatsCard