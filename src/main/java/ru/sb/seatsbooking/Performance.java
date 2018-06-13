package ru.sb.seatsbooking;


import lombok.Data;
import javax.persistence.*;

@Data
@Entity
public class Performance {

    private @Id @GeneratedValue Long id;
    private String date;
    private String name;
    private String venue;
    private String type;

    private Performance() {}

    public Performance(String time, String name, String venue, String type) {
        this.date = time;
        this.name = name;
        this.venue = venue;
        this.type = type;
    }

    public Performance(String venue) {
        this.venue = venue;
    }
}