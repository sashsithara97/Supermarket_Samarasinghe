package com.samarasinghesuper.model;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.Pattern;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "supplier")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Supplier {


    @Id
    @Column(name = "id")
    @Basic(optional = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "regnumber")
    @Basic(optional = false)
    private String regnumber;

    @Column(name = "companyname")
    @Pattern(regexp = "^([A-Z][a-z]+[\\s]?)*([A-Z][a-z]*)$", message = "Invalid Company Name")
    @Basic(optional = false)
    private String  companyname;

    @Column(name = "companyland")
    @Pattern(regexp = "^(((0\\d{9})){0,1})$", message = "Invalid Landphone Number")
    @Basic(optional = false)
    private String  companyland;

    @Column(name = "contactname")
    @Pattern(regexp = "^([A-Z][a-z]+[\\s]?)*([A-Z][a-z]*)$", message = "Invalid Contact Name")
    @Basic(optional = false)
    private String  contactname;

    @Column(name = "mobile")
    @Pattern(regexp = "^0\\d{9}$", message = "Invalid Mobilephone Number")
    @Basic(optional = false)
    private String  mobile;


    @Column(name = "email")
    @Basic(optional = false)
    private String  email;

    @Column(name = "address")
    //@Pattern(regexp = "^([\\w\\/\\-,\\s]{2,})$", message = "Invalid Address")
    @Basic(optional = false)
    private String  address;


    @Column(name = "brn")
    //@Pattern(regexp = "^([\\w\\/\\-,\\s]{2,})$", message = "Invalid Address")
    private String  brn;


    @Column(name = "bankname")
    //@Pattern(regexp = "^([\\w\\/\\-,\\s]{2,})$", message = "Invalid Address")
    private String  bankname;

    @Column(name = "bankbranch")
    //@Pattern(regexp = "^([\\w\\/\\-,\\s]{2,})$", message = "Invalid Address")
    private String  bankbranch;

    @Column(name = "accountname")
    //@Pattern(regexp = "^([\\w\\/\\-,\\s]{2,})$", message = "Invalid Address")
    private String  accountname;

    @Column(name = "accountnumber")
    //@Pattern(regexp = "^([\\w\\/\\-,\\s]{2,})$", message = "Invalid Address")
    private String  accountnumber;


    @Column(name = "addeddate")
    @Basic(optional = false)
    private LocalDate addeddate;

    @Column(name = "description")
    private String  description;

    @Column(name = "creditlimit")
    private BigDecimal creditlimit;

    @Column(name = "ariasamount")
    private BigDecimal ariasamount;

    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private Employee employee_id;

    @JoinColumn(name = "supplierstatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private SupplierStatus supplierstatus_id;


    @OneToMany( cascade = CascadeType.ALL, fetch = FetchType.LAZY , mappedBy = "supplier_id", orphanRemoval = true)
    private List<SupplierItem> supplierItemList;

    public Supplier(Integer id , String companyname,BigDecimal creditlimit,BigDecimal ariasamount,String email,String contactname){
        this.id = id;
        this.companyname = companyname;
        this.creditlimit = creditlimit;
        this.ariasamount = ariasamount;
        this.email = email;
        this.contactname = contactname;
    }

    public Supplier(Integer id , String companyname){
        this.id = id;
        this.companyname = companyname;

    }

    public Supplier(String companyname , BigDecimal ariasamount){
        this.companyname = companyname;
        this.ariasamount = ariasamount;

    }

}
