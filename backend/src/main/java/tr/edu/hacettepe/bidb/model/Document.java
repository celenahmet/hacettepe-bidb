package tr.edu.hacettepe.bidb.model;

import jakarta.persistence.*;

/** Sayfaya bağlı indirilebilir belge (form, yönerge, kılavuz). */
@Entity
@Table(name = "document")
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "page_id")
    private Page page;

    @Column(nullable = false, length = 400)
    private String name;

    @Column(nullable = false, length = 700)
    private String url;

    @Column(length = 10)
    private String fileType;

    @Column(nullable = false)
    private int sortOrder = 0;

    public Long getId() { return id; }
    public Page getPage() { return page; }
    public void setPage(Page page) { this.page = page; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }
    public int getSortOrder() { return sortOrder; }
    public void setSortOrder(int sortOrder) { this.sortOrder = sortOrder; }
}
