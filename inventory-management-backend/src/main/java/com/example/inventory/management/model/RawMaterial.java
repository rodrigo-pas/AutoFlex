package com.example.inventory.management.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Column;

/**
 * Represents a raw material (insum) in the inventory management system.
 * Extends PanacheEntity for simplified ORM operations.
 */
@Entity
public class RawMaterial extends PanacheEntity {

    /**
     * Unique code for the raw material.
     * Must be unique and not null.
     */
    @Column(unique = true, nullable = false)
    public String code;

    /**
     * Name of the raw material.
     * Must not be null.
     */
    @Column(nullable = false)
    public String name;

    /**
     * Quantity of the raw material currently in stock.
     * Must not be null.
     */
    @Column(nullable = false)
    public Integer quantityInStock;
}
