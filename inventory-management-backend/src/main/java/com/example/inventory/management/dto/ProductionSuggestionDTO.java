package com.example.inventory.management.dto;

import com.example.inventory.management.model.Product;

/**
 * Data Transfer Object (DTO) for conveying production suggestions.
 * It encapsulates a product, the quantity that can be produced,
 * and the total value obtained from producing that quantity.
 */
public class ProductionSuggestionDTO {
    /** The product for which the suggestion is made. */
    public Product product;
    /** The number of units of the product that can be produced with current raw materials. */
    public int quantityProducible;
    /** The total value if the producible quantity of the product is made and sold. */
    public double totalValue;

    /**
     * Constructor for ProductionSuggestionDTO.
     * @param product The product being suggested.
     * @param quantityProducible The calculated quantity that can be produced.
     */
    public ProductionSuggestionDTO(Product product, int quantityProducible) {
        this.product = product;
        this.quantityProducible = quantityProducible;
        // Calculate total value based on product's unit value and producible quantity
        this.totalValue = product.value * quantityProducible;
    }
}
