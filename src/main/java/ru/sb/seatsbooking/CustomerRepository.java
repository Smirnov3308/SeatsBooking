package ru.sb.seatsbooking;

import org.springframework.data.repository.Repository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported = false)
public interface CustomerRepository extends Repository<Customer, Long> {

    Customer save(Customer customer);
    Customer findByName(String name);

}