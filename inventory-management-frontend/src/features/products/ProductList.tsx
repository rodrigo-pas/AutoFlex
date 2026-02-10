import React from 'react';
import { useGetProductsQuery, useDeleteProductMutation } from './productApi';

/**
 * Props for the ProductList component.
 * @property onEdit - A callback function to handle editing a product, taking the product's ID.
 */
interface ProductListProps {
  onEdit: (id: number) => void;
}

/**
 * ProductList component displays a table of all products
 * and provides options to edit or delete them.
 */
const ProductList: React.FC<ProductListProps> = ({ onEdit }) => {
  // Fetch all products using RTK Query hook
  const { data: products, error, isLoading } = useGetProductsQuery();
  // Mutation hook for deleting a product
  const [deleteProduct] = useDeleteProductMutation();

  // Display loading state
  if (isLoading) return <div>Loading products...</div>;
  // Display error state
  if (error) return <div>Error: {error.message || 'An unknown error occurred'}</div>; // Ensure error is displayed safely

  return (
    <div>
      <h3>All Products</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Code</th>
            <th>Name</th>
            <th>Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Map through products and render each one as a table row */}
          {products?.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.code}</td>
              <td>{product.name}</td>
              <td>{product.value}</td>
              <td>
                {/* Button to trigger the edit form with the product's ID */}
                <button onClick={() => onEdit(product.id!)}>Edit</button> {/* 'id!' asserts id is not null */}
                {/* Button to delete the product */}
                <button onClick={() => deleteProduct(product.id!)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
