package STOCK.project.Services;

import STOCK.project.DTO.ReorderAlertRequestDTO;
import STOCK.project.DTO.ReorderAlertResponseDTO;
import STOCK.project.Models.Product;
import STOCK.project.Models.ReorderAlert;
import STOCK.project.Repository.ProductRepository;
import STOCK.project.Repository.ReorderAlertRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReorderAlertServices {

    private final ReorderAlertRepository reorderAlertRepository;
    private final ProductRepository productRepository;

    public ReorderAlertServices(
            ReorderAlertRepository reorderAlertRepository,
            ProductRepository productRepository) {

        this.reorderAlertRepository = reorderAlertRepository;
        this.productRepository = productRepository;
    }

    public ReorderAlertResponseDTO createreorderalert(
            ReorderAlertRequestDTO data) {

        Product product = productRepository.findById(data.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        ReorderAlert reorderAlert = new ReorderAlert();

        reorderAlert.setCurrentStock(data.getCurrentStock());
        reorderAlert.setReorderThreshold(data.getReorderThreshold());
        reorderAlert.setMessage(data.getMessage());
        reorderAlert.setStatus(data.getStatus());
        reorderAlert.setAlertDate(data.getAlertDate());
        reorderAlert.setProduct(product);

        ReorderAlert savedData =
                reorderAlertRepository.save(reorderAlert);

        return new ReorderAlertResponseDTO(
                savedData.getId(),
                savedData.getCurrentStock(),
                savedData.getReorderThreshold(),
                savedData.getMessage(),
                savedData.getStatus(),
                savedData.getAlertDate(),
                savedData.getProduct().getId()
        );
    }

    public List<ReorderAlert> getallreorderalert() {
        return reorderAlertRepository.findAll();
    }

    public ReorderAlert updatereorderalert(ReorderAlert data) {
        return reorderAlertRepository.save(data);
    }

    public ReorderAlert getbyid(Long id) {
        return reorderAlertRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Reorder Alert not found"));
    }

    public void deletebyid(Long id) {

        if (!reorderAlertRepository.existsById(id)) {
            throw new RuntimeException("Reorder Alert not found");
        }

        reorderAlertRepository.deleteById(id);
    }
}