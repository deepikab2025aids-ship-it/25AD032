package STOCK.project.Models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class ReorderAlert {

    @Id
    @GeneratedValue
    Long Id;

    int CurrentStock;
    int ReorderThreshold;
    String Message;
    String Status;
    String AlertDate;

    @ManyToOne
    Product product;
}