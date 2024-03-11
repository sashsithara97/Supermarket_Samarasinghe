package com.samarasinghesuper.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "invoice")

public class Invoice {

    @Id
    @Column(name = "id")
    @Basic(optional = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "invoiceno")
    @Basic(optional = false)
    private String invoiceno;

    @Column(name = "cusname")
    private String cusname;

    @Column(name = "cusmobile")
    private String cusmobile;

    @Column(name = "createddatetime")
    @Basic(optional = false)
    private LocalDateTime createddatetime;

    @Column(name = "totalamount")
    @Basic(optional = false)
    private BigDecimal  totalamount;

    @Column(name = "discountratio")
    @Basic(optional = false)
    private BigDecimal  discountratio;

    @Column(name = "netamount ")
    @Basic(optional = false)
    private BigDecimal  netamount;

    @Column(name = "paidamount ")
    @Basic(optional = false)
    private BigDecimal  paidamount;

    @Column(name = "balanceamount")
    @Basic(optional = false)
    private BigDecimal  balanceamount;

    @Column(name = "description")
    private String description;

    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private Employee employee_id;

    @JoinColumn(name = "invoicestatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private InvoiceStatus  invoicestatus_id;

    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    @ManyToOne(fetch = FetchType.EAGER)
    private Customer  customer_id;

    @JoinColumn(name = "corder_id", referencedColumnName = "id")
    @ManyToOne(fetch = FetchType.EAGER)
    private CustomerOrder  corder_id;

    @JoinColumn(name = "cuspaymethod_id", referencedColumnName = "id")
    @ManyToOne(fetch = FetchType.EAGER)
    private CusPayMethod cuspaymethod_id ;

    @OneToMany( cascade = CascadeType.ALL, fetch = FetchType.LAZY , mappedBy = "invoice_id", orphanRemoval = true)
    private List<InvoiceItem> invoiceItemList;

    public Invoice(Integer id , String invoiceno){
        this.id = id;
        this.invoiceno = invoiceno;
    }


}
