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
    private final SeatRepository seats;

    @Autowired
    public DatabaseLoader(PerformanceRepository performanceRepository,
                          CustomerRepository customerRepository,
                          SeatRepository seatRepository) {
        this.performances = performanceRepository;
        this.customers = customerRepository;
        this.seats = seatRepository;
    }

    private void seatsOfMariinskyTheatre(Performance mariinskyTheatre) {
        this.performances.save(mariinskyTheatre);
        int price;

        // stalls
        price = 3500;
        for (int row = 1; row <= 10; row++) {
            price = price - 100;
            for (int place = 1; place <= 20; place++) {
                this.seats.save(new Seat("stalls", String.valueOf(row),
                        String.valueOf(place), String.valueOf(price), mariinskyTheatre));
            }
        }
        
        // stalls boxes
        price = 3000;
        for (int row = 1; row <= 3; row++) {
            price = price - 100;
            for (int place = 1; place <= 32; place++) {
                this.seats.save(new Seat("stalls boxes", String.valueOf(row),
                        String.valueOf(place), String.valueOf(price), mariinskyTheatre));
            }
        }
        
        // dress circle
        price = 2800;
        for (int row = 1; row <= 3; row++) {
            price = price - 100;
            for (int place = 1; place <= 36; place++) {
                this.seats.save(new Seat("dress circle", String.valueOf(row),
                        String.valueOf(place), String.valueOf(price), mariinskyTheatre));
            }
        }
        
        // balcony
        price = 2900;
        for (int row = 1; row <= 3; row++) {
            price = price - 100;
            for (int place = 1; place <= 28; place++) {
                this.seats.save(new Seat("balcony", String.valueOf(row),
                        String.valueOf(place), String.valueOf(price), mariinskyTheatre));
            }
        }
    }

    private void seatsOfMariinskyII(Performance mariinskyII) {
        this.performances.save(mariinskyII);
        int price;
        
        // stalls
        price = 3420;
        for (int row = 1; row <= 20; row++) {
            price = price - 20;
            for (int place = 1; place <= 26; place++) {
                this.seats.save(new Seat("stalls", String.valueOf(row),
                        String.valueOf(place), String.valueOf(price), mariinskyII));
            }
        }

        // stalls boxes
        price = 3300;
        for (int row = 1; row <= 3; row++) {
            price = price - 100;
            for (int place = 1; place <= 58; place++) {
                if (place < 20) price = price + 10;
                if (place > 38) price = price - 10;
                this.seats.save(new Seat("stalls boxes", String.valueOf(row),
                        String.valueOf(place), String.valueOf(price), mariinskyII));
            }
        }

        // dress circle left
        price = 3200;
        for (int row = 1; row <= 4; row++) {
            price = price - 100;
            for (int place = 1; place <= 26; place++) {
                this.seats.save(new Seat("dress circle left", String.valueOf(row),
                        String.valueOf(place), String.valueOf(price), mariinskyII));
            }
        }

        // dress circle right
        price = 3200;
        for (int row = 1; row <= 4; row++) {
            price = price - 100;
            for (int place = 1; place <= 26; place++) {
                this.seats.save(new Seat("dress circle right", String.valueOf(row),
                        String.valueOf(place), String.valueOf(price), mariinskyII));
            }
        }

        // 1st tier left
        price = 2100;
        for (int row = 1; row <= 2; row++) {
            price = price - 100;
            for (int place = 1; place <= 28; place++) {
                this.seats.save(new Seat("1st tier left", String.valueOf(row),
                        String.valueOf(place), String.valueOf(price), mariinskyII));
            }
        }

        // 1st tier right
        price = 2100;
        for (int row = 1; row <= 2; row++) {
            price = price - 100;
            for (int place = 1; place <= 28; place++) {
                this.seats.save(new Seat("1st tier right", String.valueOf(row),
                        String.valueOf(place), String.valueOf(price), mariinskyII));
            }
        }

        // Box D
        price = 4000;
        for (int row = 1; row <= 4; row++) {
            price = price - 100;
            for (int place = 1; place <= 7; place++) {
                this.seats.save(new Seat("Box D", String.valueOf(row),
                        String.valueOf(place), String.valueOf(price), mariinskyII));
            }
        }

        // Balcony
        price = 2000;
        for (int row = 1; row <= 3; row++) {
            price = price - 100;
            for (int place = 1; place <= 56; place++) {
                this.seats.save(new Seat("Balcony", String.valueOf(row),
                        String.valueOf(place), String.valueOf(price), mariinskyII));
            }
        }
    }

    private void seatsOfConcertHall(Performance concertHall) {
        this.performances.save(concertHall);
        int price;
        
        // stalls
        price = 3100;
        for (int row = 1; row <= 10; row++) {
            price = price - 50;
            for (int place = 1; place <= 20; place++) {
                this.seats.save(new Seat("stalls", String.valueOf(row),
                        String.valueOf(place), String.valueOf(price), concertHall));
            }
        }
        
        // stalls boxes
        price = 3000;
        for (int row = 1; row <= 3; row++) {
            price = price - 100;
            for (int place = 1; place <= 32; place++) {
                this.seats.save(new Seat("stalls boxes", String.valueOf(row),
                        String.valueOf(place), String.valueOf(price), concertHall));
            }
        }
        // balcony
        price = 2800;
        for (int row = 1; row <= 3; row++) {
            price = price - 100;
            for (int place = 1; place <= 28; place++) {
                this.seats.save(new Seat("balcony", String.valueOf(row),
                        String.valueOf(place), String.valueOf(price), concertHall));
            }
        }
    }

    @Override
    public void run(String... strings) throws Exception {

        Customer vadim = this.customers.save(new Customer("vadim", "3045",
                "ROLE_USER"));

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("vadim", "doesn't matter",
                        AuthorityUtils.createAuthorityList("ROLE_USER")));

        seatsOfConcertHall(new Performance("04.06.2018", "Thomas Ospital", "Mariinsky II", "concert"));
        seatsOfMariinskyTheatre(new Performance("05.06.2018", "Raymonda", "Mariinsky Theatre", "ballet"));
        seatsOfMariinskyTheatre(new Performance("05.06.2018", "Prince Igor", "Mariinsky Theatre", "opera"));
        seatsOfMariinskyII(new Performance("06.06.2018", "Otello", "Mariinsky II", "opera"));
        seatsOfConcertHall(new Performance("07.06.2018", "Wagner Gala", "Concert Hall", "concert"));
        seatsOfMariinskyTheatre(new Performance("07.06.2018", "Carmen Suite. Marguerite and Armand", "Mariinsky Theatre", "ballet"));
        seatsOfConcertHall(new Performance("08.06.2018", "Thomas Ospital", "Concert Hall", "concert"));
        seatsOfMariinskyTheatre(new Performance("09.06.2018", "Raymonda", "Mariinsky Theatre", "ballet"));
        seatsOfMariinskyTheatre(new Performance("10.06.2018", "Prince Igor", "Mariinsky Theatre", "opera"));
        seatsOfMariinskyII(new Performance("10.06.2018", "Otello", "Mariinsky II", "opera"));
        seatsOfConcertHall(new Performance("12.06.2018", "Wagner Gala", "Concert Hall", "concert"));

        SecurityContextHolder.clearContext();
    }
}