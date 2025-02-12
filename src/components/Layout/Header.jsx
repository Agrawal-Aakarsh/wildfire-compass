// src/components/Layout/Header.jsx
import { Mail } from 'lucide-react'
import { Button } from '../ui/button'
import { Link, useLocation } from 'react-router-dom'

function Header() {
  const location = useLocation();
  const isDashboard = location.pathname === '/';
  const isInventory = location.pathname === '/inventory';

  return (
    <div className="bg-white shadow-sm">
      {/* Main header */}
      <header className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <span className="text-2xl">🔥</span>
            <h1 className="text-xl font-bold whitespace-nowrap">Wildfire Compass</h1>
          </Link>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button 
              variant="default"
              className="bg-black text-white hover:bg-gray-800 text-xs sm:text-sm px-2 sm:px-4"
              onClick={() => window.open('mailto:aakarsh@seas.upenn.edu', '_blank')}
            >
              <span className="hidden sm:inline">Help Improve This</span>
              <span className="sm:hidden">Feedback</span>
            </Button>
            
            <Button 
              className="text-sm px-2 py-1 sm:px-4 sm:py-2 bg-blue-500 hover:bg-blue-700 text-white whitespace-nowrap"
              onClick={() => window.open('https://www.fire.ca.gov/', '_blank')}
            >
              <span className="hidden sm:inline">Go to CAL FIRE</span>
              <span className="sm:hidden">CAL FIRE</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation bar */}
      <nav className="border-t">
        <div className="container mx-auto px-4">
          <div className="flex space-x-6">
            <Link 
              to="/"
              className={`py-3 font-medium ${
                isDashboard 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/inventory"
              className={`py-3 font-medium ${
                isInventory 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Insurance Inventory List Manager
            </Link>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Header