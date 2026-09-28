package STOCK.project.Repository;

import STOCK.project.Models.ReorderAlert;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReorderAlertRepository extends JpaRepository<ReorderAlert, Long> {
}