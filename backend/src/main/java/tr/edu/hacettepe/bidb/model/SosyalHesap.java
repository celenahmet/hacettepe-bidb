package tr.edu.hacettepe.bidb.model;

import jakarta.persistence.*;

/** Sosyal medya hesabı — yönetimden değiştirilebilir. */
@Entity
@Table(name = "sosyal_hesap")
public class SosyalHesap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 40, unique = true)
    private String ag;

    @Column(nullable = false, length = 500)
    private String adres;

    @Column(nullable = false)
    private int sira = 0;

    @Column(nullable = false)
    private boolean yayinda = true;

    public Long getId() { return id; }
    public String getAg() { return ag; }
    public String getAdres() { return adres; }
    public int getSira() { return sira; }
    public boolean isYayinda() { return yayinda; }
}
