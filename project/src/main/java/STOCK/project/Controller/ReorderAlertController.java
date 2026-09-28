package STOCK.project.Controller;

import STOCK.project.DTO.ReorderAlertRequestDTO;
import STOCK.project.DTO.ReorderAlertResponseDTO;
import STOCK.project.Models.ReorderAlert;
import STOCK.project.Services.ReorderAlertServices;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reorderalert")
public class ReorderAlertController {

    private final ReorderAlertServices reorderAlertServices;

    public ReorderAlertController(ReorderAlertServices reorderAlertServices) {
        this.reorderAlertServices = reorderAlertServices;
    }

    @PostMapping
    public ReorderAlertResponseDTO createreorderalert(
            @RequestBody ReorderAlertRequestDTO data) {

        return reorderAlertServices.createreorderalert(data);
    }

    @GetMapping
    public List<ReorderAlert> getallreorderalert() {
        return reorderAlertServices.getallreorderalert();
    }

    @GetMapping("/{id}")
    public ReorderAlert getbyid(@PathVariable Long id) {
        return reorderAlertServices.getbyid(id);
    }

    @PutMapping
    public ReorderAlert updatereorderalert(
            @RequestBody ReorderAlert data) {

        return reorderAlertServices.updatereorderalert(data);
    }

    @DeleteMapping("/{id}")
    public String deletebyid(@PathVariable Long id) {

        reorderAlertServices.deletebyid(id);

        return "Reorder Alert deleted successfully";
    }
}