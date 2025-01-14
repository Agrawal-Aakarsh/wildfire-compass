// src/components/Layout/Footer.jsx
function Footer() {
  return (
    <footer className="mt-auto bg-white border-t py-8">
      <div className="container mx-auto px-4 text-center text-sm text-gray-600">
        <div className="mb-2">Built by Aakarsh Agrawal • <a href="https://github.com/Agrawal-Aakarsh/wildfire-compass" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800"> Checkout GitHub Repo Here! </a></div>
        <div className="flex items-center justify-center space-x-2">
          <span>Powered by:</span>
          <div className="flex items-center space-x-2">
            <a href="https://firms.modaps.eosdis.nasa.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">NASA FIRMS</a>
            <span>•</span>
            <a href="https://reactjs.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">React</a>
            <span>•</span>
            <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Tailwind CSS</a>
            <span>•</span>
            <a href="https://ui.shadcn.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">shadcn/ui</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;