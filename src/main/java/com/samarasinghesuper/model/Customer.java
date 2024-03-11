package com.samarasinghesuper.model;


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
@Table(name = "customer")
public class Customer {

    @Id
    @Column(name = "id")
    @Basic(optional = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "regno")
    @Basic(optional = false)
    private String regno;

    @Column(name = "fullname")
    @Pattern(regexp = "^([A-Z][a-z]+[\\s]?)*([A-Z][a-z]*)$", message = "Invalid Fullname")
    @Basic(optional = false)
    private String  fullname;

    @Column(name = "contactname")
    @Pattern(regexp = "^([A-Z][a-z]+)$", message = "Invalid Calligname")
    @Basic(optional = false)
    private String  contactname;

    @Column(name = "address")
    //@Pattern(regexp = "^([\\w\\/\\-,\\s]{2,})$", message = "Invalid Address")
    @Basic(optional = false)
    private String  address;

    @Column(name = "mobile")
    @Pattern(regexp = "^0\\d{9}$", message = "Invalid Mobilephone Number")
    @Basic(optional = false)
    private String  mobile;

    @Column(name = "email")
    @Basic(optional = false)
    private String  email;

    @Column(name = "nic")
    @Pattern(regexp = "^(([\\d]{9}[vVxX])|([\\d]{12}))$", message = "Invalid NIC")
    @Basic(optional = false)
    private String  nic;

    @Column(name = "land")
    @Pattern(regexp = "^(((0\\d{9})){0,1})$", message = "Invalid Landphone Number")
    @Basic(optional = false)
    private String  land;

    @Column(name = "addeddate")
    @Basic(optional = false)
    private LocalDate addeddate;

    @Column(name = "description")
    private String  description;

    @Column(name = "point")
    private BigDecimal point;

    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private Employee employee_id;

    @JoinColumn(name = "customerstatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private CustomerStatus customerstatus_id;

    public Customer(Integer id , String contactname, String mobile,BigDecimal point){
        this.id = id;
        this.contactname = contactname;
        this.mobile = mobile;
        this.point = point;
    }


}
