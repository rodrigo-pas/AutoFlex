package com.example.inventory.management.resource;

import com.example.inventory.management.model.RawMaterial;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

/**
 * REST endpoint for managing RawMaterial entities.
 * Provides CRUD operations for raw materials.
 */
@Path("/rawmaterials")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RawMaterialResource {

    /**
     * Retrieves all raw materials.
     * @return A list of all raw materials.
     */
    @GET
    public List<RawMaterial> getAllRawMaterials() {
        return RawMaterial.listAll();
    }

    /**
     * Retrieves a raw material by its ID.
     * @param id The ID of the raw material to retrieve.
     * @return A Response containing the raw material if found, or NOT_FOUND status.
     */
    @GET
    @Path("/{id}")
    public Response getRawMaterialById(@PathParam("id") Long id) {
        RawMaterial rawMaterial = RawMaterial.findById(id);
        if (rawMaterial != null) {
            return Response.ok(rawMaterial).build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }

    /**
     * Creates a new raw material.
     * @param rawMaterial The raw material object to create.
     * @return A Response containing the created raw material and CREATED status, or BAD_REQUEST if ID is provided.
     */
    @POST
    @Transactional // Ensures the operation is atomic within a transaction
    public Response createRawMaterial(RawMaterial rawMaterial) {
        // Prevent client from setting ID on creation
        if (rawMaterial.id != null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("RawMaterial ID must be null for creation").build();
        }
        RawMaterial.persist(rawMaterial); // Persist the new raw material using Panache's active record pattern
        return Response.status(Response.Status.CREATED).entity(rawMaterial).build();
    }

    /**
     * Updates an existing raw material.
     * @param id The ID of the raw material to update.
     * @param updatedRawMaterial The raw material object with updated details.
     * @return A Response containing the updated raw material if found, or NOT_FOUND status.
     */
    @PUT
    @Path("/{id}")
    @Transactional // Ensures the operation is atomic within a transaction
    public Response updateRawMaterial(@PathParam("id") Long id, RawMaterial updatedRawMaterial) {
        RawMaterial rawMaterial = RawMaterial.findById(id); // Find the existing raw material
        if (rawMaterial != null) {
            // Update fields of the managed entity
            rawMaterial.code = updatedRawMaterial.code;
            rawMaterial.name = updatedRawMaterial.name;
            rawMaterial.quantityInStock = updatedRawMaterial.quantityInStock;
            return Response.ok(rawMaterial).build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }

    /**
     * Deletes a raw material by its ID.
     * @param id The ID of the raw material to delete.
     * @return A Response with NO_CONTENT status if deleted, or NOT_FOUND status.
     */
    @DELETE
    @Path("/{id}")
    @Transactional // Ensures the operation is atomic within a transaction
    public Response deleteRawMaterial(@PathParam("id") Long id) {
        boolean deleted = RawMaterial.deleteById(id); // Delete raw material by ID
        if (deleted) {
            return Response.noContent().build(); // 204 No Content
        } else {
            return Response.status(Response.Status.NOT_FOUND).build(); // 404 Not Found
        }
    }
}
