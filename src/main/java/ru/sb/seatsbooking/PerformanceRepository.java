package ru.sb.seatsbooking;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.security.access.prepost.PreAuthorize;

@PreAuthorize("hasRole('ROLE_USER')")
public interface PerformanceRepository extends PagingAndSortingRepository<Performance, Long> {
    
}
