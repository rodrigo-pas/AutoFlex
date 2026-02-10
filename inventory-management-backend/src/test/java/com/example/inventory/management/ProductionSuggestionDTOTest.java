package com.example.inventory.management;

import com.example.inventory.management.dto.ProductionSuggestionDTO;
import com.example.inventory.management.model.Product;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class ProductionSuggestionDTOTest {

    @Test
    public void testTotalValueCalculation() {
        // Given
        Product product = new Product();
        product.value = 10.0; // Product with a value of 10.0

        int quantityProducible = 5; // Can produce 5 units

        // When
        ProductionSuggestionDTO suggestion = new ProductionSuggestionDTO(product, quantityProducible);

        // Then
        // Expected total value should be product.value * quantityProducible = 10.0 * 5 = 50.0
        assertEquals(50.0, suggestion.totalValue, "Total value should be correctly calculated.");
    }

    @Test
    public void testTotalValueCalculationWithZeroQuantity() {
        // Given
        Product product = new Product();
        product.value = 10.0;

        int quantityProducible = 0; // Can produce 0 units

        // When
        ProductionSuggestionDTO suggestion = new ProductionSuggestionDTO(product, quantityProducible);

        // Then
        assertEquals(0.0, suggestion.totalValue, "Total value should be 0.0 when quantity producible is zero.");
    }

    @Test
    public void testTotalValueCalculationWithDifferentProductValue() {
        // Given
        Product product = new Product();
        product.value = 25.5; // Product with a different value

        int quantityProducible = 2;

        // When
        ProductionSuggestionDTO suggestion = new ProductionSuggestionDTO(product, quantityProducible);

        // Then
        assertEquals(51.0, suggestion.totalValue, "Total value should be correctly calculated for different product value.");
    }
}
