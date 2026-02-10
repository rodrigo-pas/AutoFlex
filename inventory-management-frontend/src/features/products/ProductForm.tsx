import React, { useState, useEffect } from 'react';
import { useCreateProductMutation, useUpdateProductMutation, useGetProductByIdQuery } from './productApi';
import { useGetRawMaterialsQuery } from '../rawMaterials/rawMaterialApi';
import {
  useGetProductRawMaterialsByProductIdQuery,
  useCreateProductRawMaterialMutation,
  useUpdateProductRawMaterialMutation,
  useDeleteProductRawMaterialMutation,
} from '../productRawMaterials/productRawMaterialApi';

// Assuming these interfaces are consistent across APIs
interface Product {
  id?: number;
  code: string;
  name: string;
  value: number;
}

interface RawMaterial {
  id: number;
  code: string;
  name: string;
  quantityInStock: number;
}

interface ProductRawMaterial {
  id?: number;
  product: Product;
  rawMaterial: RawMaterial;
  quantityNeeded: number;
}


/**
 * Props for the ProductForm component.
 * @property productId - Optional ID of the product to edit. If not provided, the form is for creating a new product.
 * @property onSuccess - Callback function to execute upon successful form submission (creation or update).
 */
interface ProductFormProps {
  productId?: number;
  onSuccess: () => void;
}

/**
 * ProductForm component provides a form for creating or updating products,
 * and for managing their associated raw materials and quantities needed.
 */
const ProductForm: React.FC<ProductFormProps> = ({ productId, onSuccess }) => {
  // RTK Query hooks for fetching product data (for editing) and raw materials
  const { data: productToEdit } = useGetProductByIdQuery(productId!, { skip: !productId });
  const { data: allRawMaterials = [] } = useGetRawMaterialsQuery();

  // RTK Query hooks for managing product-raw material associations
  const { data: productRawMaterials = [], refetch: refetchProductRawMaterials } = useGetProductRawMaterialsByProductIdQuery(productId!, {
    skip: !productId, // Skip this query if no product ID is provided (i.e., new product creation)
  });

  // State for product form fields
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [value, setValue] = useState(0);

  // RTK Query mutation hooks for products
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  // RTK Query mutation hooks for product-raw material associations
  const [createProductRawMaterial] = useCreateProductRawMaterialMutation();
  const [updateProductRawMaterial] = useUpdateProductRawMaterialMutation();
  const [deleteProductRawMaterial] = useDeleteProductRawMaterialMutation();

  // State for adding new raw material associations
  const [selectedRawMaterialId, setSelectedRawMaterialId] = useState<number | ''>('');
  const [newQuantityNeeded, setNewQuantityNeeded] = useState(1);


  // Effect to populate form fields when a product is selected for editing
  useEffect(() => {
    if (productToEdit) {
      setCode(productToEdit.code);
      setName(productToEdit.name);
      setValue(productToEdit.value);
    } else {
      // Clear form if no product is being edited
      setCode('');
      setName('');
      setValue(0);
    }
  }, [productToEdit]);

  /**
   * Handles the submission of the product main form (create/update product details).
   */
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (productId) {
        // Update existing product
        await updateProduct({ id: productId, code, name, value }).unwrap();
      } else {
        // Create new product
        const createdProduct = await createProduct({ code, name, value }).unwrap();
        // After creating, the form might need to switch to edit mode for the new product,
        // or simply call onSuccess. For now, just call onSuccess.
      }
      onSuccess(); // Call success callback to clear form or navigate
    } catch (err) {
      console.error('Failed to save product: ', err);
      // TODO: Implement user-friendly error display
    }
  };

  /**
   * Handles adding a new raw material association to the current product.
   */
  const handleAddRawMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate input and ensure a product is being edited
    if (!productId || selectedRawMaterialId === '' || newQuantityNeeded <= 0) return;

    const rawMaterial = allRawMaterials.find(rm => rm.id === selectedRawMaterialId);
    if (!rawMaterial) return; // Ensure selected raw material exists

    try {
      await createProductRawMaterial({
        product: { id: productId } as Product, // Pass only product ID for association
        rawMaterial: rawMaterial,
        quantityNeeded: newQuantityNeeded,
      }).unwrap();
      // Reset form fields for new association
      setSelectedRawMaterialId('');
      setNewQuantityNeeded(1);
      refetchProductRawMaterials(); // Re-fetch associations to update the list
    } catch (err) {
      console.error('Failed to add raw material association: ', err);
      // TODO: Implement user-friendly error display
    }
  };

  /**
   * Handles updating the quantity needed for an existing raw material association.
   */
  const handleUpdateRawMaterial = async (association: ProductRawMaterial, quantity: number) => {
    if (!association.id || quantity <= 0) return; // Validate input
    try {
      await updateProductRawMaterial({
        ...association, // Keep existing association data
        quantityNeeded: quantity, // Update only quantityNeeded
      }).unwrap();
      refetchProductRawMaterials(); // Re-fetch associations to update the list
    } catch (err) {
      console.error('Failed to update raw material association: ', err);
      // TODO: Implement user-friendly error display
    }
  };

  /**
   * Handles deleting a raw material association.
   */
  const handleDeleteRawMaterial = async (id: number) => {
    if (!id) return; // Ensure ID exists
    try {
      await deleteProductRawMaterial(id).unwrap();
      refetchProductRawMaterials(); // Re-fetch associations to update the list
    } catch (err) {
      console.error('Failed to delete raw material association: ', err);
      // TODO: Implement user-friendly error display
    }
  };


  return (
    <div>
      {/* Form for Product details (Code, Name, Value) */}
      <form onSubmit={handleProductSubmit}>
        <div>
          <label htmlFor="code">Code:</label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="value">Value:</label>
          <input
            type="number"
            id="value"
            value={value}
            onChange={(e) => setValue(parseFloat(e.target.value))}
            required
          />
        </div>
        <button type="submit">{productId ? 'Update Product' : 'Add Product'}</button>
      </form>

      {/* Section for managing Raw Material Associations (only visible when editing an existing product) */}
      {productId && (
        <section>
          <h3>Raw Material Associations for {productToEdit?.name}</h3>
          <div>
            <h4>Add New Raw Material</h4>
            <form onSubmit={handleAddRawMaterial}>
              <select
                value={selectedRawMaterialId}
                onChange={(e) => setSelectedRawMaterialId(parseInt(e.target.value))}
                required
              >
                <option value="">Select Raw Material</option>
                {/* Populate dropdown with all available raw materials */}
                {allRawMaterials.map((rm) => (
                  <option key={rm.id} value={rm.id}>
                    {rm.name} ({rm.code})
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={newQuantityNeeded}
                onChange={(e) => setNewQuantityNeeded(parseInt(e.target.value))}
                min="1"
                required
              />
              <button type="submit">Add Association</button>
            </form>
          </div>

          <h4>Current Associations</h4>
          {productRawMaterials.length === 0 ? (
            <p>No raw materials associated with this product.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Raw Material</th>
                  <th>Quantity Needed</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Display existing raw material associations for the product */}
                {productRawMaterials.map((association) => (
                  <tr key={association.id}>
                    <td>{association.rawMaterial.name} ({association.rawMaterial.code})</td>
                    <td>
                      <input
                        type="number"
                        value={association.quantityNeeded}
                        onChange={(e) => handleUpdateRawMaterial(association, parseInt(e.target.value))}
                        min="1"
                      />
                    </td>
                    <td>
                      <button onClick={() => handleDeleteRawMaterial(association.id!)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}
    </div>
  );
};

export default ProductForm;
