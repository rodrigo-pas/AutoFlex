import React from 'react';
import { useGetProductionSuggestionsQuery } from './productionApi';

/**
 * ProductionList component displays a table of suggested products for production.
 * It fetches the suggestions from the backend using RTK Query.
 */
const ProductionList: React.FC = () => {
  // Fetch production suggestions using RTK Query hook
  const { data: suggestions, error, isLoading } = useGetProductionSuggestionsQuery();

  // Display loading state
  if (isLoading) return <div>Loading production suggestions...</div>;
  // Display error state
  if (error) return <div>Error: {error.message || 'An unknown error occurred'}</div>;

  return (
    <div>
      <h3>Suggested Production</h3>
      {/* Check if there are no suggestions available */}
      {suggestions && suggestions.length === 0 ? (
        <p>No production suggestions available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Product Code</th>
              <th>Product Name</th>
              <th>Quantity Producible</th>
              <th>Total Value</th>
            </tr>
          </thead>
          <tbody>
            {/* Map through suggestions and render each one as a table row */}
            {suggestions?.map((suggestion) => (
              // Using product ID as key, assuming it's unique
              <tr key={suggestion.product.id}>
                <td>{suggestion.product.code}</td>
                <td>{suggestion.product.name}</td>
                <td>{suggestion.quantityProducible}</td>
                {/* Format total value to two decimal places */}
                <td>{suggestion.totalValue.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductionList;
