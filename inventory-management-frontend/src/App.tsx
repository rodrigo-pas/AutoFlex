
import React from 'react';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import routing components
import ProductsPage from './pages/ProductsPage';
import RawMaterialsPage from './pages/RawMaterialsPage';
import ProductionPage from './pages/ProductionPage';

/**
 * The main application component.
 * It sets up the routing for different sections of the application
 * and includes the navigation bar.
 */
function App() {
  return (
    // BrowserRouter provides the routing context to the entire application
    <Router>
      <div className="App">
        {/* Navbar component for navigation across different pages */}
        <Navbar />
        {/* Routes component defines the different routes and their corresponding components */}
        <Routes>
          {/* Default route for the home page */}
          <Route path="/" element={<h1>Welcome to Inventory Management</h1>} />
          {/* Route for the Products management page */}
          <Route path="/products" element={<ProductsPage />} />
          {/* Route for the Raw Materials management page */}
          <Route path="/raw-materials" element={<RawMaterialsPage />} />
          {/* Route for the Production suggestions page */}
          <Route path="/production" element={<ProductionPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
