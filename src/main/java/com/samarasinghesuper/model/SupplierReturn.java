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
@Table(name = "supplierreturn")

public class SupplierReturn {

    @Id
    @Column(name = "id")
    @Basic(optional = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "supplierreturnno")
    @Basic(optional = false)
    private String supplierreturnno;

    @Column(name = "addeddate")
    @Basic(optional = false)
    private LocalDate addeddate;

    @Column(name = "returntotalamount")
    @Basic(optional = false)
    private BigDecimal  returntotalamount;

    @Column(name = "description")
    private String description;

    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private Supplier supplier_id;

    @JoinColumn(name = "srstatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private SupplierReturnStatus srstatus_id;

    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private Employee  employee_id;


    @OneToMany( cascade = CascadeType.ALL, fetch = FetchType.LAZY , mappedBy = "supplierreturn_id", orphanRemoval = true)
    private List<SupplierReturnBatch> supplierReturnBatchList;

    public SupplierReturn(Integer id, String supplierreturnno){
        this.id = id;
        this.supplierreturnno = supplierreturnno;
    }

    public SupplierReturn(Integer id, String supplierreturnno,BigDecimal returntotalamount){
        this.id = id;
        this.supplierreturnno = supplierreturnno;
        this.returntotalamount = returntotalamount;
    }

    public SupplierReturn(Integer id ,String supplierreturnno,SupplierReturnStatus srstatus_id,BigDecimal returntotalamount){
        this.id = id;
        this.supplierreturnno = supplierreturnno;
        this.srstatus_id = srstatus_id;
        this.returntotalamount = returntotalamount;
    }


}
