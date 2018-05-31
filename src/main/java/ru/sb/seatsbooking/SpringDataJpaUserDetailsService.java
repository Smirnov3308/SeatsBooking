package ru.sb.seatsbooking;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;


@Component
public class SpringDataJpaUserDetailsService implements UserDetailsService {

    private final CustomerRepository repository;

    @Autowired
    public SpringDataJpaUserDetailsService(CustomerRepository repository) {
        this.repository = repository;
    }

    @Override
    public UserDetails loadUserByUsername(String name) throws UsernameNotFoundException {
        Customer customer = this.repository.findByName(name);
        return new User(customer.getName(), customer.getPassword(),
                AuthorityUtils.createAuthorityList(customer.getRoles()));
    }
}
