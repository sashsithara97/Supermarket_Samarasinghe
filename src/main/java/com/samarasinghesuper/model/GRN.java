package com.samarasinghesuper.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "grn")

public class GRN {

    @Id
    @Column(name = "id")
    @Basic(optional = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "grncode")
    @Basic(optional = false)
    private String grncode;

    @Column(name = "supplierbillno")
    @Basic(optional = false)
    private String supplierbillno;

    @Column(name = "addeddate")
    @Basic(optional = false)
    private LocalDate addeddate;

    @Column(name = "receiveddate")
    @Basic(optional = false)
    private LocalDate receiveddate;

    @Column(name = "totalamount")
    @Basic(optional = false)
    private BigDecimal  totalamount;

    @Column(name = "discountratio")
    @Basic(optional = false)
    private BigDecimal  discountratio;

    @Column(name = "nettotal")
    @Basic(optional = false)
    private BigDecimal  nettotal;

    @Column(name = "grossamount")
    @Basic(optional = false)
    private BigDecimal  grossamount;

    @Column(name = "returnamount")
    @Basic(optional = false)
    private BigDecimal returnamount;

    @Column(name = "description")
    private String description;

    //meka ui ekata demme ne mama
    @Column(name = "paidamount")
    @Basic(optional = true)
    private BigDecimal paidamount;

    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private Employee employee_id;

    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private Supplier supplier_id;

    @JoinColumn(name = "grntype_id", referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private GRNType grntype_id;

    @JoinColumn(name = "supplierreturn_id", referencedColumnName = "id")
    @ManyToOne(optional = true,fetch = FetchType.EAGER)
    private SupplierReturn supplierreturn_id;

    @JoinColumn(name = "grnstatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private GRNStatus  grnstatus_id;

    @JoinColumn(name = "porder_id", referencedColumnName = "id")
    @ManyToOne(optional = true,fetch = FetchType.EAGER)
    private Porder  porder_id;

    @OneToMany( cascade = CascadeType.ALL, fetch = FetchType.LAZY , mappedBy = "grn_id", orphanRemoval = true)
    private List<GrnBatch> grnBatchList;

    public GRN(Integer id , String grncode){
        this.id = id;
        this.grncode = grncode;
            }

    public GRN(Integer id,String grncode,BigDecimal nettotal){
        this.id = id;
        this.grncode = grncode;
        this.nettotal = nettotal;
    }

}
