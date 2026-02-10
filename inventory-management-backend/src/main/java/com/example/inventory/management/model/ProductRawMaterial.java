package com.example.inventory.management.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Column;

/**
 * Represents the association between a Product and a RawMaterial,
 * specifying the quantity of that raw material needed to produce one unit of the product.
 * Extends PanacheEntity for simplified ORM operations.
 */
@Entity
public class ProductRawMaterial extends PanacheEntity {

    /**
     * The product associated with this raw material requirement.
     * Many-to-one relationship.
     * Must not be null.
     */
    @ManyToOne
    @JoinColumn(nullable = false)
    public Product product;

    /**
     * The raw material required for the product.
     * Many-to-one relationship.
     * Must not be null.
     */
    @ManyToOne
    @JoinColumn(nullable = false)
    public RawMaterial rawMaterial;

    /**
     * The quantity of the raw material needed to produce one unit of the associated product.
     * Must not be null.
     */
    @Column(nullable = false)
    public Integer quantityNeeded;
}
