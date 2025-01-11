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
      </div>
    </Router>
  )
}

export default App

// import Header from './components/Layout/Header'
// import StatsCard from './components/common/StatsCard'
// import { Flame, Wind, Map, Building } from 'lucide-react'
// import FireMap from './components/Map/FireMap'
// import NewsFeed from './components/Layout/NewsFeed'
// import SocialFeed from './components/Layout/SocialFeed'
// import ResourcesSection from './components/Layout/ResourcesSection'
// import Footer from './components/Layout/Footer'
// import { useStats } from './hooks/useStats'

// function App() {
//   const { stats, loading } = useStats();

//   const statsData = [
//     {
//       title: "Active Fires",
//       value: stats.activeFires,
//       icon: Flame
//     },
//     {
//       title: "Air Quality",
//       value: stats.airQuality,
//       icon: Wind
//     },
//     {
//       title: "Fire Area",
//       value: stats.fireArea,
//       icon: Map
//     },
//     {
//       title: "Structures Damaged",
//       value: stats.structuresThreatened,
//       icon: Building
//     }
//   ]

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       <Header />
//       <main className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//           {statsData.map((stat, index) => (
//             <StatsCard
//               key={index}
//               title={stat.title}
//               value={stat.value}
//               icon={stat.icon}
//             />
//           ))}
//         </div>
        
//         {/* Map */}
//         <div className="mb-20">
//           <FireMap />
//         </div>
        
//         {/* News and Social Feeds */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
//           <NewsFeed />
//           <SocialFeed />
//         </div>
        
//         {/* Resources Section */}
//         <div>
//           <ResourcesSection />
//         </div>
//       </main>
//       <Footer />
//     </div>
//   )
// }

// export default App

// import Header from './components/Layout/Header'
// import StatsCard from './components/common/StatsCard'
// import { Flame, Wind, Map, Building } from 'lucide-react'
// import FireMap from './components/Map/FireMap'
// import NewsFeed from './components/Layout/NewsFeed'
// import SocialFeed from './components/Layout/SocialFeed'
// import ResourcesSection from './components/Layout/ResourcesSection'
// import Footer from './components/Layout/Footer'
// import { useStats} from './hooks/useStats'
 

// function App() {
//   const statsData = [
//     {
//       title: "Active Fires",
//       value: loading ? "Loading..." : useStats.activeFires,
//       icon: Flame
//     },
//     {
//       title: "Air Quality",
//       value: useStats.airQuality,
//       icon: Wind
//     },
//     {
//       title: "Fire Area",
//       value: useStats.fireArea,
//       icon: Map
//     },
//     {
//       title: "Structures Threatened",
//       value: useStats.structuresThreatened,
//       icon: Building
//     }
//   ]

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       <Header />
//       <main className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//           {statsData.map((stat, index) => (
//             <StatsCard
//               key={index}
//               title={stat.title}
//               value={stat.value}
//               icon={stat.icon}
//             />
//           ))}
//         </div>
        
//         {/* Map */}
//         <div className="mb-20">
//           <FireMap />
//         </div>
        
//         {/* News and Social Feeds */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
//           <NewsFeed />
//           <SocialFeed />
//         </div>
        
//         {/* Resources Section */}
//         <div>
//           <ResourcesSection />
//         </div>
//       </main>
//       <Footer />
//     </div>
//   )
// }

// export default App


// // function App() {
// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       <Header />
// //     </div>
// //   )
// // }

// // export default App