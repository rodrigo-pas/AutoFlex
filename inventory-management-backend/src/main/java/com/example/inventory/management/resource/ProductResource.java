package com.example.inventory.management.resource;

import com.example.inventory.management.model.Product;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

/**
 * REST endpoint for managing Product entities.
 * Provides CRUD operations for products.
 */
@Path("/products")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductResource {

    /**
     * Retrieves all products.
     * @return A list of all products.
     */
    @GET
    public List<Product> getAllProducts() {
        return Product.listAll();
    }

    /**
     * Retrieves a product by its ID.
     * @param id The ID of the product to retrieve.
     * @return A Response containing the product if found, or NOT_FOUND status.
     */
    @GET
    @Path("/{id}")
    public Response getProductById(@PathParam("id") Long id) {
        Product product = Product.findById(id);
        if (product != null) {
            return Response.ok(product).build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }

    /**
     * Creates a new product.
     * @param product The product object to create.
     * @return A Response containing the created product and CREATED status, or BAD_REQUEST if ID is provided.
     */
    @POST
    @Transactional // Ensures the operation is atomic within a transaction
    public Response createProduct(Product product) {
        // Prevent client from setting ID on creation
        if (product.id != null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Product ID must be null for creation").build();
        }
        Product.persist(product); // Persist the new product using Panache's active record pattern
        return Response.status(Response.Status.CREATED).entity(product).build();
    }

    /**
     * Updates an existing product.
     * @param id The ID of the product to update.
     * @param updatedProduct The product object with updated details.
     * @return A Response containing the updated product if found, or NOT_FOUND status.
     */
    @PUT
    @Path("/{id}")
    @Transactional // Ensures the operation is atomic within a transaction
    public Response updateProduct(@PathParam("id") Long id, Product updatedProduct) {
        Product product = Product.findById(id); // Find the existing product
        if (product != null) {
            // Update fields of the managed entity
            product.code = updatedProduct.code;
            product.name = updatedProduct.name;
            product.value = updatedProduct.value;
            // No need to call persist again, Panache automatically tracks changes in a transactional context
            return Response.ok(product).build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }

    /**
     * Deletes a product by its ID.
     * @param id The ID of the product to delete.
     * @return A Response with NO_CONTENT status if deleted, or NOT_FOUND status.
     */
    @DELETE
    @Path("/{id}")
    @Transactional // Ensures the operation is atomic within a transaction
    public Response deleteProduct(@PathParam("id") Long id) {
        boolean deleted = Product.deleteById(id); // Delete product by ID
        if (deleted) {
            return Response.noContent().build(); // 204 No Content
        } else {
            return Response.status(Response.Status.NOT_FOUND).build(); // 404 Not Found
        }
    }
}
