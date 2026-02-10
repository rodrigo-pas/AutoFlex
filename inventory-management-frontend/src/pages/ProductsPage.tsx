import React, { useState } from 'react';
import ProductList from '../features/products/ProductList';
import ProductForm from '../features/products/ProductForm';

/**
 * ProductsPage component serves as the main page for managing products.
 * It integrates the ProductList and ProductForm components.
 */
const ProductsPage: React.FC = () => {
  // State to track which product is currently being edited.
  // `undefined` means a new product is being created.
  const [editingProductId, setEditingProductId] = useState<number | undefined>(undefined);

  /**
   * Handles the initiation of editing a product.
   * Sets the `editingProductId` state to the ID of the product to be edited.
   * @param id The ID of the product to edit.
   */
  const handleEdit = (id: number) => {
    setEditingProductId(id);
  };

  /**
   * Callback function executed when a ProductForm submission is successful.
   * It clears the `editingProductId` state, effectively resetting the form to "create" mode.
   */
  const handleFormSuccess = () => {
    setEditingProductId(undefined); // Clear form after success
  };

  return (
    <div>
      <h2>Products Management</h2>
      {/* ProductForm component for adding new products or editing existing ones.
          The `productId` prop determines if it's an edit or create operation. */}
      <ProductForm productId={editingProductId} onSuccess={handleFormSuccess} />
      {/* ProductList component displays all products and allows selecting one for editing. */}
      <ProductList onEdit={handleEdit} />
    </div>
  );
};

export default ProductsPage;

