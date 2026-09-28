package STOCK.project.Controller;

import STOCK.project.DTO.ProductRequestDTO;
import STOCK.project.DTO.ProductResponseDTO;
import STOCK.project.Models.Product;
import STOCK.project.Services.ProductServices;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product")
public class ProductController {

    private final ProductServices productServices;

    public ProductController(ProductServices productServices) {
        this.productServices = productServices;
    }

    @PostMapping
    public ProductResponseDTO createproduct(@RequestBody ProductRequestDTO data) {
        return productServices.createproduct(data);
    }

    @GetMapping
    public List<Product> getallproduct() {
        return productServices.getallproduct();
    }

    @GetMapping("/{id}")
    public Product getbyid(@PathVariable Long id) {
        return productServices.getbyid(id);
    }

    @PutMapping
    public Product updateproduct(@RequestBody Product data) {
        return productServices.updateproduct(data);
    }

    @DeleteMapping("/{id}")
    public String deletebyid(@PathVariable Long id) {
        productServices.deletebyid(id);
        return "Product deleted successfully";
    }
}