package STOCK.project.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockMovementRequestDTO {

    private int Quantity;
    private String Reason;
    private String MovementDate;
    private Long ProductId;
}