import React from 'react';
import ProductionList from '../features/production/ProductionList';

/**
 * ProductionPage component serves as the main page for displaying production suggestions.
 * It integrates the ProductionList component.
 */
const ProductionPage: React.FC = () => {
  return (
    <div>
      <h2>Production Suggestions</h2>
      {/* ProductionList component fetches and displays the suggested products for production. */}
      <ProductionList />
    </div>
  );
};

export default ProductionPage;

