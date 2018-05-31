package ru.sb.seatsbooking;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseLoader implements CommandLineRunner {

    private final PerformanceRepository performances;
    private final CustomerRepository customers;

    @Autowired
    public DatabaseLoader(PerformanceRepository performanceRepository,
                          CustomerRepository customerRepository) {
        this.performances = performanceRepository;
        this.customers = customerRepository;
    }

    @Override
    public void run(String... strings) throws Exception {

        Customer vadim = this.customers.save(new Customer("vadim", "3045",
                "ROLE_USER"));

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("vadim", "doesn't matter",
                        AuthorityUtils.createAuthorityList("ROLE_USER")));

        this.performances.save(new Performance("04.06.2018", "Carmen Suite. Marguerite and Armand", "Mariinsky Theatre", "ballet"));
        this.performances.save(new Performance("04.06.2018", "Thomas Ospital", "Concert Hall", "concert", vadim.getName()));
        this.performances.save(new Performance("05.06.2018", "Raymonda", "Mariinsky Theatre", "ballet"));
        this.performances.save(new Performance("05.06.2018", "Prince Igor", "Mariinsky Theatre", "opera"));
        this.performances.save(new Performance("06.06.2018", "Otello", "Mariinsky II", "opera"));
        this.performances.save(new Performance("07.06.2018", "Wagner Gala", "Concert Hall", "concert"));
        this.performances.save(new Performance("07.06.2018", "Carmen Suite. Marguerite and Armand", "Mariinsky Theatre", "ballet"));
        this.performances.save(new Performance("08.06.2018", "Thomas Ospital", "Concert Hall", "concert"));
        this.performances.save(new Performance("09.06.2018", "Raymonda", "Mariinsky Theatre", "ballet"));
        this.performances.save(new Performance("10.06.2018", "Prince Igor", "Mariinsky Theatre", "opera"));
        this.performances.save(new Performance("10.06.2018", "Otello", "Mariinsky II", "opera"));
        this.performances.save(new Performance("12.06.2018", "Wagner Gala", "Concert Hall", "concert"));
        this.performances.save(new Performance("12.06.2018", "Carmen Suite. Marguerite and Armand", "Mariinsky Theatre", "ballet"));
        this.performances.save(new Performance("13.06.2018", "Thomas Ospital", "Concert Hall", "concert"));
        this.performances.save(new Performance("14.06.2018", "Raymonda", "Mariinsky Theatre", "ballet"));
        this.performances.save(new Performance("16.06.2018", "Prince Igor", "Mariinsky Theatre", "opera"));
        this.performances.save(new Performance("17.06.2018", "Otello", "Mariinsky II", "opera"));
        this.performances.save(new Performance("20.06.2018", "Wagner Gala", "Concert Hall", "concert"));

        SecurityContextHolder.clearContext();
    }
}