import React, { useState, useEffect } from 'react';
import { useCreateRawMaterialMutation, useUpdateRawMaterialMutation, useGetRawMaterialByIdQuery } from './rawMaterialApi';

/**
 * Props for the RawMaterialForm component.
 * @property rawMaterialId - Optional ID of the raw material to edit. If not provided, the form is for creating a new raw material.
 * @property onSuccess - Callback function to execute upon successful form submission (creation or update).
 */
interface RawMaterialFormProps {
  rawMaterialId?: number;
  onSuccess: () => void;
}

/**
 * RawMaterialForm component provides a form for creating or updating raw materials.
 */
const RawMaterialForm: React.FC<RawMaterialFormProps> = ({ rawMaterialId, onSuccess }) => {
  // RTK Query hook to fetch raw material data for editing
  const { data: rawMaterialToEdit } = useGetRawMaterialByIdQuery(rawMaterialId!, {
    skip: !rawMaterialId, // Skip query if no rawMaterialId is provided
  });

  // State for form fields
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [quantityInStock, setQuantityInStock] = useState(0);

  // RTK Query mutation hooks for creating and updating raw materials
  const [createRawMaterial] = useCreateRawMaterialMutation();
  const [updateRawMaterial] = useUpdateRawMaterialMutation();

  // Effect to populate form fields when a raw material is selected for editing
  useEffect(() => {
    if (rawMaterialToEdit) {
      setCode(rawMaterialToEdit.code);
      setName(rawMaterialToEdit.name);
      setQuantityInStock(rawMaterialToEdit.quantityInStock);
    } else {
      // Clear form for new raw material
      setCode('');
      setName('');
      setQuantityInStock(0);
    }
  }, [rawMaterialToEdit]);

  /**
   * Handles the form submission for creating or updating a raw material.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (rawMaterialId) {
        // Update existing raw material
        await updateRawMaterial({ id: rawMaterialId, code, name, quantityInStock }).unwrap();
      } else {
        // Create new raw material
        await createRawMaterial({ code, name, quantityInStock }).unwrap();
      }
      onSuccess(); // Call success callback to clear form or navigate
    } catch (err) {
      console.error('Failed to save raw material: ', err);
      // TODO: Implement user-friendly error display
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
        <label htmlFor="quantityInStock">Quantity In Stock:</label>
        <input
          type="number"
          id="quantityInStock"
          value={quantityInStock}
          onChange={(e) => setQuantityInStock(parseInt(e.target.value))}
          required
        />
      </div>
      <button type="submit">{rawMaterialId ? 'Update Raw Material' : 'Add Raw Material'}</button>
    </form>
  );
};

export default RawMaterialForm;
