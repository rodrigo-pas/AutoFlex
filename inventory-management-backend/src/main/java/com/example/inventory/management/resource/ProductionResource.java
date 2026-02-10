package com.example.inventory.management.resource;

import com.example.inventory.management.model.Product;
import com.example.inventory.management.model.RawMaterial;
import com.example.inventory.management.model.ProductRawMaterial;
import com.example.inventory.management.dto.ProductionSuggestionDTO;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.transaction.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST endpoint for generating production suggestions based on available raw materials.
 * Implements the business logic for RF004.
 */
@Path("/production")
@Produces(MediaType.APPLICATION_JSON)
public class ProductionResource {

    /**
     * Retrieves a list of suggested products that can be produced with current raw material stock.
     * Products are prioritized by their total value (highest value first).
     *
     * @return A list of ProductionSuggestionDTO objects.
     */
    @GET
    @Path("/suggested")
    @Transactional // Ensures all database operations within this method are part of a single transaction
    public List<ProductionSuggestionDTO> getSuggestedProduction() {
        // Fetch all necessary data from the database
        List<Product> products = Product.listAll();
        List<RawMaterial> rawMaterials = RawMaterial.listAll();
        List<ProductRawMaterial> productRawMaterials = ProductRawMaterial.listAll();

        // Create a map for quick lookup of available raw material stock by ID
        Map<Long, Integer> availableRawMaterialStock = new HashMap<>();
        for (RawMaterial rm : rawMaterials) {
            availableRawMaterialStock.put(rm.id, rm.quantityInStock);
        }

        List<ProductionSuggestionDTO> suggestions = new ArrayList<>();

        // Iterate through each product to determine how many units can be produced
        for (Product product : products) {
            int maxProducibleUnits = Integer.MAX_VALUE; // Initialize with a very large number

            // Filter raw materials specific to the current product
            List<ProductRawMaterial> productSpecificRawMaterials = productRawMaterials.stream()
                    .filter(prm -> prm.product.id.equals(product.id))
                    .toList();

            // If a product requires no raw materials or no associations are found, it cannot be produced by this logic
            if (productSpecificRawMaterials.isEmpty()) {
                continue; // Skip products without defined raw material requirements
            }

            // Calculate the maximum producible units based on the most limiting raw material
            for (ProductRawMaterial prm : productSpecificRawMaterials) {
                // Get available stock for the current raw material, default to 0 if not found
                Integer stock = availableRawMaterialStock.getOrDefault(prm.rawMaterial.id, 0);
                if (prm.quantityNeeded > 0) {
                    // Calculate how many units of the product can be made based on this specific raw material
                    int producibleBasedOnThisRawMaterial = stock / prm.quantityNeeded;
                    // Update maxProducibleUnits to be the minimum found so far
                    maxProducibleUnits = Math.min(maxProducibleUnits, producibleBasedOnThisRawMaterial);
                } else {
                    // If quantityNeeded is 0, this raw material does not limit production.
                    // This could indicate a data error or a raw material that's always available.
                    // For now, it's ignored as a limiting factor.
                }
            }

            // If at least one unit can be produced and it's not the initial large number
            if (maxProducibleUnits > 0 && maxProducibleUnits != Integer.MAX_VALUE) {
                suggestions.add(new ProductionSuggestionDTO(product, maxProducibleUnits));
            }
        }

        // Sort the suggestions based on the total value of producible units in descending order
        // This fulfills the prioritization requirement of RF004
        suggestions.sort(Comparator.comparingDouble((ProductionSuggestionDTO s) -> s.totalValue).reversed());

        return suggestions;
    }
}
