package STOCK.project.Models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class Product {

    @Id
    @GeneratedValue
    Long Id;

    String Name;
    String SKU;
    String Description;
    double Price;
    int ReorderThreshold;

    @OneToMany
    List<StockMovement> stockMovements;

    @OneToMany
    List<ReorderAlert> reorderAlerts;
}