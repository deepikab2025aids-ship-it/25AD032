package STOCK.project.Controller;

import STOCK.project.DTO.StockMovementRequestDTO;
import STOCK.project.DTO.StockMovementResponseDTO;
import STOCK.project.Models.StockMovement;
import STOCK.project.Services.StockMovementServices;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stockmovement")
public class StockMovementController {

    private final StockMovementServices stockMovementServices;

    public StockMovementController(StockMovementServices stockMovementServices) {
        this.stockMovementServices = stockMovementServices;
    }

    @PostMapping
    public StockMovementResponseDTO createstockmovement(
            @RequestBody StockMovementRequestDTO data) {

        return stockMovementServices.createstockmovement(data);
    }

    @GetMapping
    public List<StockMovement> getallstockmovement() {
        return stockMovementServices.getallstockmovement();
    }

    @GetMapping("/{id}")
    public StockMovement getbyid(@PathVariable Long id) {
        return stockMovementServices.getbyid(id);
    }

    @PutMapping
    public StockMovement updatestockmovement(
            @RequestBody StockMovement data) {

        return stockMovementServices.updatestockmovement(data);
    }

    @DeleteMapping("/{id}")
    public String deletebyid(@PathVariable Long id) {

        stockMovementServices.deletebyid(id);

        return "Stock Movement deleted successfully";
    }
}