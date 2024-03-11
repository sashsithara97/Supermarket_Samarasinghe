package com.samarasinghesuper.model;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.Pattern;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "batch")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Batch {

    @Id
    @Column(name = "id")
    @Basic(optional = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "batchcode")
    @Basic(optional = false)
    private String batchcode;

    @Column(name = "salesprice")
    @Basic(optional = false)
    private BigDecimal salesprice;

    @Column(name = "purchaseprice")
    @Basic(optional = false)
    private BigDecimal purchaseprice;

    @Column(name = "avaqty")
    @Basic(optional = false)
    private BigDecimal avaqty;

    @Column(name = "totalqty")
    @Basic(optional = false)
    private BigDecimal totalqty;

    @Column(name = "returnqty")
    @Basic(optional = false)
    private BigDecimal returnqty;

    @Column(name = "expdate")
    @Basic(optional = false)
    private LocalDate expdate;

    @Column(name = "mfgdate")
    @Basic(optional = false)
    private LocalDate mfgdate;

    @Column(name = "discount")
    @Basic(optional = true)
    private BigDecimal discount ;


    @JoinColumn(name = "item_id", referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private Item item_id;

    @JoinColumn(name = "batchstatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private BatchStatus batchstatus_id;

    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private Supplier supplier_id;

    public Batch(Integer id , String batchcode){
        this.id = id;
        this.batchcode = batchcode;
    }


    public Batch(Integer id , String batchcode,BigDecimal avaqty,BigDecimal purchaseprice){
        this.id = id;
        this.batchcode = batchcode;
        this.avaqty = avaqty;
        this.purchaseprice = purchaseprice;
    }

    public Batch(Integer id,BigDecimal salesprice,BigDecimal purchaseprice,LocalDate expdate,LocalDate mfgdate){
        this.id = id;
        this.salesprice = salesprice;
        this.purchaseprice = purchaseprice;
        this.expdate = expdate;
        this.mfgdate = mfgdate;
    }
    public Batch(Integer id ,Item item_id,BigDecimal salesprice){
        this.id = id;
        this.item_id = item_id;
        this.batchcode = batchcode;
        this.salesprice = salesprice;
    }

    public Batch(Integer id ,String batchcode,Item item_id,BigDecimal salesprice,BigDecimal discount){
        this.id = id;
        this.batchcode = batchcode;
        this.item_id = item_id;
        this.salesprice = salesprice;
        this.discount = discount;
    }

    public Batch(Item item_id,BigDecimal avaqty,BigDecimal totalqty,BigDecimal returnqty){
        this.item_id = item_id;
        this.avaqty = avaqty;
        this.totalqty = totalqty;
        this.returnqty = returnqty;

    }

}
