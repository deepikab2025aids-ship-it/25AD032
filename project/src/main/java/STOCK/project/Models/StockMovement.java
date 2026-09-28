package STOCK.project.Models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class StockMovement {

    @Id
    @GeneratedValue
    Long Id;

    int Quantity;
    String Reason;
    String MovementDate;

    @ManyToOne
    Product product;
}