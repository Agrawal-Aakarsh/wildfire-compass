import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Layout/Header'
import InventoryForm from './components/InventoryManager/InventoryForm'
import StatsCard from './components/common/StatsCard'
import { Flame, Wind, Map, Building } from 'lucide-react'
import FireMap from './components/Map/FireMap'
import NewsFeed from './components/Layout/NewsFeed'
import SocialFeed from './components/Layout/SocialFeed'
import ResourcesSection from './components/Layout/ResourcesSection'
import Footer from './components/Layout/Footer'
import { useStats } from './hooks/useStats'
import { Analytics } from "@vercel/analytics/react"

// Dashboard component to keep App.jsx clean
function Dashboard({ stats }) {
  const statsData = [
    {
      title: "Active Fires",
      value: stats.activeFires,
      icon: Flame
    },
    {
      title: "Air Quality",
      value: stats.airQuality,
      icon: Wind
    },
    {
      title: "Fire Area",
      value: stats.fireArea,
      icon: Map
    },
    {
      title: "Structures Damaged",
      value: stats.structuresDamaged,
      icon: Building
    }
  ]

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsData.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>
      
      <div className="mb-20">
        <FireMap />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        <NewsFeed />
        <SocialFeed />
      </div>
      
      <div>
        <ResourcesSection />
      </div>
    </main>
  )
}

function App() {
  const { stats } = useStats();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard stats={stats} />} />
          <Route path="/inventory" element={<InventoryForm />} />
        </Routes>
        <Footer />
        <Analytics />
      </div>
    </Router>
  )
}

export default App