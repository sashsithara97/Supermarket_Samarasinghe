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
@Table(name = "corder")

public class CustomerOrder {

    @Id
    @Column(name = "id")
    @Basic(optional = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "cordercode")
    @Basic(optional = false)
    private String cordercode;

    @Column(name = "addeddate")
    @Basic(optional = false)
    private LocalDate addeddate;

    @Column(name = "requireddate")
    @Basic(optional = false)
    private LocalDate requireddate;

    @Column(name = "totalamount")
    @Basic(optional = false)
    private BigDecimal  totalamount;

    @Column(name = "discountratio")
    @Basic(optional = false)
    private BigDecimal  discountratio;

    @Column(name = "netamount")
    @Basic(optional = false)
    private BigDecimal  netamount;

    @Column(name = "description")
    private String description;

    @Column(name = "address")
    private String address;

    @Column(name = "cp_name")
    private String cp_name;

    @Column(name = "cp_mobile")
    private String cp_mobile;

    @Column(name = "delireq")
    @Basic(optional = false)
    private Boolean delireq;


    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private Employee employee_id;

    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private Customer customer_id;

    @JoinColumn(name = "corderstatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private CustomerOrderStatus  corderstatus_id;


   @OneToMany( cascade = CascadeType.ALL, fetch = FetchType.LAZY , mappedBy = "corder_id", orphanRemoval = true)
    private List<CorderItem> corderItemList;

    public CustomerOrder(Integer id , String cordercode){
        this.id = id;
        this.cordercode = cordercode;
    }

    public CustomerOrder(Integer id , String cordercode,BigDecimal totalamount){
        this.id = id;
        this.cordercode = cordercode;
        this.totalamount = totalamount;
    }


}
