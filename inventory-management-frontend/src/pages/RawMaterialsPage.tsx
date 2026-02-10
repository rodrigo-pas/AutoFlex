import React, { useState } from 'react';
import RawMaterialList from '../features/rawMaterials/RawMaterialList';
import RawMaterialForm from '../features/rawMaterials/RawMaterialForm';

/**
 * RawMaterialsPage component serves as the main page for managing raw materials.
 * It integrates the RawMaterialList and RawMaterialForm components.
 */
const RawMaterialsPage: React.FC = () => {
  // State to track which raw material is currently being edited.
  // `undefined` means a new raw material is being created.
  const [editingRawMaterialId, setEditingRawMaterialId] = useState<number | undefined>(undefined);

  /**
   * Handles the initiation of editing a raw material.
   * Sets the `editingRawMaterialId` state to the ID of the raw material to be edited.
   * @param id The ID of the raw material to edit.
   */
  const handleEdit = (id: number) => {
    setEditingRawMaterialId(id);
  };

  /**
   * Callback function executed when a RawMaterialForm submission is successful.
   * It clears the `editingRawMaterialId` state, effectively resetting the form to "create" mode.
   */
  const handleFormSuccess = () => {
    setEditingRawMaterialId(undefined); // Clear form after success
  };

  return (
    <div>
      <h2>Raw Materials Management</h2>
      {/* RawMaterialForm component for adding new raw materials or editing existing ones.
          The `rawMaterialId` prop determines if it's an edit or create operation. */}
      <RawMaterialForm rawMaterialId={editingRawMaterialId} onSuccess={handleFormSuccess} />
      {/* RawMaterialList component displays all raw materials and allows selecting one for editing. */}
      <RawMaterialList onEdit={handleEdit} />
    </div>
  );
};

export default RawMaterialsPage;

