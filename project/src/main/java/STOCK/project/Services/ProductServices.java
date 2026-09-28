package STOCK.project.Services;

import STOCK.project.DTO.ProductRequestDTO;
import STOCK.project.DTO.ProductResponseDTO;
import STOCK.project.Models.Product;
import STOCK.project.Repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServices {

    private final ProductRepository productRepository;

    public ProductServices(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public ProductResponseDTO createproduct(ProductRequestDTO data) {

        Product product = new Product();

        product.setName(data.getName());
        product.setSKU(data.getSKU());
        product.setDescription(data.getDescription());
        product.setPrice(data.getPrice());
        product.setReorderThreshold(data.getReorderThreshold());

        Product savedProduct = productRepository.save(product);

        return new ProductResponseDTO(
                savedProduct.getId(),
                savedProduct.getName(),
                savedProduct.getSKU(),
                savedProduct.getDescription(),
                savedProduct.getPrice(),
                savedProduct.getReorderThreshold()
        );
    }

    public List<Product> getallproduct() {
        return productRepository.findAll();
    }

    public Product updateproduct(Product data) {
        return productRepository.save(data);
    }

    public Product getbyid(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public void deletebyid(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found");
        }

        productRepository.deleteById(id);
    }
}