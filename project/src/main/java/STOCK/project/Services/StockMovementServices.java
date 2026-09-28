package STOCK.project.Services;

import STOCK.project.DTO.StockMovementRequestDTO;
import STOCK.project.DTO.StockMovementResponseDTO;
import STOCK.project.Models.Product;
import STOCK.project.Models.StockMovement;
import STOCK.project.Repository.ProductRepository;
import STOCK.project.Repository.StockMovementRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockMovementServices {

    private final StockMovementRepository stockMovementRepository;
    private final ProductRepository productRepository;

    public StockMovementServices(
            StockMovementRepository stockMovementRepository,
            ProductRepository productRepository) {

        this.stockMovementRepository = stockMovementRepository;
        this.productRepository = productRepository;
    }

    public StockMovementResponseDTO createstockmovement(
            StockMovementRequestDTO data) {

        Product product = productRepository.findById(data.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        StockMovement stockMovement = new StockMovement();

        stockMovement.setQuantity(data.getQuantity());
        stockMovement.setReason(data.getReason());
        stockMovement.setMovementDate(data.getMovementDate());
        stockMovement.setProduct(product);

        StockMovement savedData =
                stockMovementRepository.save(stockMovement);

        return new StockMovementResponseDTO(
                savedData.getId(),
                savedData.getQuantity(),
                savedData.getReason(),
                savedData.getMovementDate(),
                savedData.getProduct().getId()
        );
    }

    public List<StockMovement> getallstockmovement() {
        return stockMovementRepository.findAll();
    }

    public StockMovement updatestockmovement(StockMovement data) {
        return stockMovementRepository.save(data);
    }

    public StockMovement getbyid(Long id) {
        return stockMovementRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Stock Movement not found"));
    }

    public void deletebyid(Long id) {

        if (!stockMovementRepository.existsById(id)) {
            throw new RuntimeException("Stock Movement not found");
        }

        stockMovementRepository.deleteById(id);
    }
}