package com.samarasinghesuper.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.Pattern;
import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "quotation")
public class Quotation {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Basic(optional = false)
    private Integer id;

    @Column(name = "quotationnumber")
    @Basic(optional = false)
    private String quotationnumber;

    @Column(name = "validfrom")
    @Basic(optional = false)
    private LocalDate validfrom;

    @Column(name = "validto")
    @Basic(optional = false)
    private LocalDate validto;

    @Column(name = "addeddate")
    @Basic(optional = false)
    private LocalDate addeddate;

    @Column(name = "receiveddate")
    @Basic(optional = false)
    private LocalDate receiveddate;

    @Column(name = "description")
    private String description;

    @JoinColumn(name = "quotationstatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private QuotationStatus quotationstatus_id;

    @JoinColumn(name = "quotationrequest_id", referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private Quotationrequest quotationrequest_id;

    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private Employee employee_id;

    @OneToMany( cascade = CascadeType.ALL, fetch = FetchType.LAZY , mappedBy = "quotation_id", orphanRemoval = true)
    private List<QuotationItem> quotationItemList;

    public Quotation(Integer id , String quotationnumber){
        this.id = id;
        this.quotationnumber = quotationnumber;
    }

    public Quotation(Integer id , String quotationnumber, Quotationrequest quotationrequest_id){
        this.id = id;
        this.quotationnumber = quotationnumber;
        this.quotationrequest_id = quotationrequest_id;
    }

}
