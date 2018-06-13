package ru.sb.seatsbooking;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;

@Data
@Entity
public class Seat {

    private @Id @GeneratedValue Long id;
    private @Version @JsonIgnore Long version;

    private @OneToOne Customer customer;
    private @ManyToOne Performance performance;

    private String type;
    private String row;
    private String place;
    private String price;

    private String performanceName;
    private String performanceDate;

    private Seat() {}

    public Seat (String type, String row, String place) {
        this.type = type;
        this.row = row;
        this.place = place;
    }

    public Seat (String type, String row, String place, Customer customer) {
        this.type = type;
        this.row = row;
        this.place = place;
        this.customer = customer;
    }

    public Seat (String type, String row, String place, String price, Performance performance) {
        this.type = type;
        this.row = row;
        this.place = place;
        this.price = price;
        this.performance = performance;
        this.performanceName = performance.getName();
        this.performanceDate = performance.getDate();

    }

    public Seat (String type, String row, String place, String price, Performance performance, Customer customer) {
        this.type = type;
        this.row = row;
        this.place = place;
        this.price = price;
        this.performance = performance;
        this.customer = customer;
    }
}