package com.example.inventory.management.resource;

import com.example.inventory.management.model.Product;
import com.example.inventory.management.model.RawMaterial;
import com.example.inventory.management.model.ProductRawMaterial;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

/**
 * REST endpoint for managing ProductRawMaterial entities,
 * which associate products with their required raw materials and quantities.
 * Provides CRUD operations for these associations.
 */
@Path("/productrawmaterials")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductRawMaterialResource {

    /**
     * Retrieves all product-raw material associations.
     * @return A list of all associations.
     */
    @GET
    public List<ProductRawMaterial> getAllProductRawMaterials() {
        return ProductRawMaterial.listAll();
    }

    /**
     * Retrieves a product-raw material association by its ID.
     * @param id The ID of the association to retrieve.
     * @return A Response containing the association if found, or NOT_FOUND status.
     */
    @GET
    @Path("/{id}")
    public Response getProductRawMaterialById(@PathParam("id") Long id) {
        ProductRawMaterial productRawMaterial = ProductRawMaterial.findById(id);
        if (productRawMaterial != null) {
            return Response.ok(productRawMaterial).build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }

    /**
     * Creates a new product-raw material association.
     * @param productRawMaterial The association object to create.
     * @return A Response containing the created association and CREATED status, or BAD_REQUEST if invalid product/raw material.
     */
    @POST
    @Transactional // Ensures the operation is atomic within a transaction
    public Response createProductRawMaterial(ProductRawMaterial productRawMaterial) {
        // Prevent client from setting ID on creation
        if (productRawMaterial.id != null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("ID must be null for creation").build();
        }

        // Ensure Product and RawMaterial exist before creating association
        Product product = Product.findById(productRawMaterial.product.id);
        RawMaterial rawMaterial = RawMaterial.findById(productRawMaterial.rawMaterial.id);

        if (product == null || rawMaterial == null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Product or RawMaterial not found").build();
        }

        // Set managed entities to ensure proper relationships
        productRawMaterial.product = product;
        productRawMaterial.rawMaterial = rawMaterial;

        ProductRawMaterial.persist(productRawMaterial); // Persist the new association
        return Response.status(Response.Status.CREATED).entity(productRawMaterial).build();
    }

    /**
     * Updates an existing product-raw material association.
     * @param id The ID of the association to update.
     * @param updatedProductRawMaterial The association object with updated details.
     * @return A Response containing the updated association if found, or NOT_FOUND status.
     */
    @PUT
    @Path("/{id}")
    @Transactional // Ensures the operation is atomic within a transaction
    public Response updateProductRawMaterial(@PathParam("id") Long id, ProductRawMaterial updatedProductRawMaterial) {
        ProductRawMaterial productRawMaterial = ProductRawMaterial.findById(id); // Find the existing association
        if (productRawMaterial != null) {
            // Ensure Product and RawMaterial exist before updating association
            Product product = Product.findById(updatedProductRawMaterial.product.id);
            RawMaterial rawMaterial = RawMaterial.findById(updatedProductRawMaterial.rawMaterial.id);

            if (product == null || rawMaterial == null) {
                return Response.status(Response.Status.BAD_REQUEST).entity("Product or RawMaterial not found").build();
            }

            // Update fields of the managed entity
            productRawMaterial.product = product;
            productRawMaterial.rawMaterial = rawMaterial;
            productRawMaterial.quantityNeeded = updatedProductRawMaterial.quantityNeeded;
            // No need to call persist again, Panache automatically tracks changes in a transactional context
            return Response.ok(productRawMaterial).build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }

    /**
     * Deletes a product-raw material association by its ID.
     * @param id The ID of the association to delete.
     * @return A Response with NO_CONTENT status if deleted, or NOT_FOUND status.
     */
    @DELETE
    @Path("/{id}")
    @Transactional // Ensures the operation is atomic within a transaction
    public Response deleteProductRawMaterial(@PathParam("id") Long id) {
        boolean deleted = ProductRawMaterial.deleteById(id); // Delete association by ID
        if (deleted) {
            return Response.noContent().build(); // 204 No Content
        } else {
            return Response.status(Response.Status.NOT_FOUND).build(); // 404 Not Found
        }
    }

    /**
     * Retrieves all product-raw material associations for a specific product ID.
     * This endpoint supports fetching associations relevant to a particular product,
     * useful for displaying in product-specific forms.
     * @param productId The ID of the product to filter associations by.
     * @return A list of ProductRawMaterial associations for the given product.
     */
    @GET
    @Path("/byProduct/{productId}")
    public List<ProductRawMaterial> getProductRawMaterialsByProductId(@PathParam("productId") Long productId) {
        // Panache list method with a query string to filter by product ID
        return ProductRawMaterial.list("product.id", productId);
    }
}
