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
@Table(name = "quotationrequest")
public class Quotationrequest {


    @Id
    @Column(name = "id")
    @Basic(optional = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "qrcode")
    @Basic(optional = false)
    private String qrcode;

    @Column(name = "requireddate")
    @Basic(optional = false)
    private LocalDate requireddate;

    @Column(name = "addeddate")
    @Basic(optional = false)
    private LocalDate addeddate;

    @Column(name = "description")
    private String description;

    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private Supplier supplier_id;

    @JoinColumn(name = "qrstatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private Qrstatus qrstatus_id;

    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private Employee employee_id;

    public Quotationrequest(Integer id,String qrcode){
        this.id = id;
        this.qrcode = qrcode;

    }


    public Quotationrequest(Integer id,String qrcode,Supplier supplier_id){
        this.id = id;
        this.qrcode = qrcode;
        this.supplier_id = supplier_id;
    }

    @OneToMany( cascade = CascadeType.ALL, fetch = FetchType.LAZY , mappedBy = "quotationrequest_id", orphanRemoval = true)
    private List<QuotationRequestItem> quotationrequestItemList;

}
