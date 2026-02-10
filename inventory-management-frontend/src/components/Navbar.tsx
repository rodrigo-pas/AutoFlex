import React from 'react';
import './Navbar.css'; // Import CSS for styling the Navbar

/**
 * Navbar component provides navigation links for the application.
 */
const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      {/* Application brand/title */}
      <div className="navbar-brand">InventoryApp</div>
      {/* Navigation links */}
      <ul className="navbar-nav">
        <li className="nav-item">
          {/* Link to the Products management page */}
          <a href="/products" className="nav-link">Products</a>
        </li>
        <li className="nav-item">
          {/* Link to the Raw Materials management page */}
          <a href="/raw-materials" className="nav-link">Raw Materials</a>
        </li>
        <li className="nav-item">
          {/* Link to the Production suggestions page */}
          <a href="/production" className="nav-link">Production</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
