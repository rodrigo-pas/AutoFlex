import React from 'react';
import { useGetRawMaterialsQuery, useDeleteRawMaterialMutation } from './rawMaterialApi';

/**
 * Props for the RawMaterialList component.
 * @property onEdit - A callback function to handle editing a raw material, taking the raw material's ID.
 */
interface RawMaterialListProps {
  onEdit: (id: number) => void;
}

/**
 * RawMaterialList component displays a table of all raw materials
 * and provides options to edit or delete them.
 */
const RawMaterialList: React.FC<RawMaterialListProps> = ({ onEdit }) => {
  // Fetch all raw materials using RTK Query hook
  const { data: rawMaterials, error, isLoading } = useGetRawMaterialsQuery();
  // Mutation hook for deleting a raw material
  const [deleteRawMaterial] = useDeleteRawMaterialMutation();

  // Display loading state
  if (isLoading) return <div>Loading raw materials...</div>;
  // Display error state
  if (error) return <div>Error: {error.message || 'An unknown error occurred'}</div>;

  return (
    <div>
      <h3>All Raw Materials</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Code</th>
            <th>Name</th>
            <th>Quantity in Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Map through raw materials and render each one as a table row */}
          {rawMaterials?.map((rm) => (
            <tr key={rm.id}>
              <td>{rm.id}</td>
              <td>{rm.code}</td>
              <td>{rm.name}</td>
              <td>{rm.quantityInStock}</td>
              <td>
                {/* Button to trigger the edit form with the raw material's ID */}
                <button onClick={() => onEdit(rm.id!)}>Edit</button> {/* 'id!' asserts id is not null */}
                {/* Button to delete the raw material */}
                <button onClick={() => deleteRawMaterial(rm.id!)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RawMaterialList;
