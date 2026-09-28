package STOCK.project.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReorderAlertRequestDTO {

    private int CurrentStock;
    private int ReorderThreshold;
    private String Message;
    private String Status;
    private String AlertDate;
    private Long ProductId;
}