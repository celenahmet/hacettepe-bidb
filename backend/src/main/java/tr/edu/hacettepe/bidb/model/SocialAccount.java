package tr.edu.hacettepe.bidb.model;

import jakarta.persistence.*;

/** Sosyal medya hesabı — yönetimden değiştirilebilir. */
@Entity
@Table(name = "social_account")
public class SocialAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 40, unique = true)
    private String network;

    @Column(nullable = false, length = 500)
    private String url;

    @Column(nullable = false)
    private int sortOrder = 0;

    @Column(nullable = false)
    private boolean published = true;

    public Long getId() { return id; }
    public String getNetwork() { return network; }
    public String getUrl() { return url; }
    public int getSortOrder() { return sortOrder; }
    public boolean isPublished() { return published; }

    public void setNetwork(String network) { this.network = network; }
    public void setUrl(String url) { this.url = url; }
    public void setSortOrder(int sortOrder) { this.sortOrder = sortOrder; }
    public void setPublished(boolean published) { this.published = published; }
}
