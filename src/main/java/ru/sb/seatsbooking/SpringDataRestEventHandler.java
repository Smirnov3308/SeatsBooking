package ru.sb.seatsbooking;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.core.annotation.HandleBeforeCreate;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RepositoryEventHandler(Performance.class)
public class SpringDataRestEventHandler {

    private final CustomerRepository customerRepository;

    @Autowired
    public SpringDataRestEventHandler(CustomerRepository managerRepository) {
        this.customerRepository = managerRepository;
    }

    @HandleBeforeCreate
    public void applyUserInformationUsingSecurityContext(Performance performance) {

        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        Customer customer = this.customerRepository.findByName(name);
        if (customer == null) {
            Customer newCustomer = new Customer();
            newCustomer.setName(name);
            newCustomer.setRoles(new String[]{"ROLE_MANAGER"});
            customer = this.customerRepository.save(newCustomer);
        }
        // performance.setCustomer(customer);
    }
}
