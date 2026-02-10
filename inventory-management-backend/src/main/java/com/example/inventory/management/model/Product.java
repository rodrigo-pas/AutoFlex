package com.example.inventory.management.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Column;

/**
 * Represents a product in the inventory management system.
 * Extends PanacheEntity for simplified ORM operations.
 */
@Entity
public class Product extends PanacheEntity {

    /**
     * Unique code for the product.
     * Must be unique and not null.
     */
    @Column(unique = true, nullable = false)
    public String code;

    /**
     * Name of the product.
     * Must not be null.
     */
    @Column(nullable = false)
    public String name;

    /**
     * Value of the product.
     * Must not be null.
     */
    @Column(nullable = false)
    public Double value;
}
