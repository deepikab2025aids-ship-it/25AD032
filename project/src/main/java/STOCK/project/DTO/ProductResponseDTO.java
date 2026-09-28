package STOCK.project.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponseDTO {

    private Long Id;
    private String Name;
    private String SKU;
    private String Description;
    private double Price;
    private int ReorderThreshold;
}