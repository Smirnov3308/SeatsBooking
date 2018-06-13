package ru.sb.seatsbooking;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.security.access.prepost.PreAuthorize;



@PreAuthorize("hasRole('ROLE_USER')")
public interface SeatRepository extends CrudRepository<Seat, Long> {
    
    @Override
    Seat save(@Param("seat") Seat seat);
}