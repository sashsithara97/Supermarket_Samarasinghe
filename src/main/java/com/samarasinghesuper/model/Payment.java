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
@Table(name = "payment")

public class Payment {

    @Id
    @Column(name = "id")
    @Basic(optional = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "billno")
    @Basic(optional = false)
    private String billno;

    @Column(name = "ariaseamount")
    @Basic(optional = false)
    private BigDecimal  ariaseamount ;

    @Column(name = "grnamount")
    @Basic(optional = false)
    private BigDecimal  grnamount ;

    @Column(name = "totalamount")
    @Basic(optional = false)
    private BigDecimal  totalamount ;

    @Column(name = "paidamount")
    @Basic(optional = false)
    private BigDecimal  paidamount;

    @Column(name = "balanceamount")
    @Basic(optional = false)
    private BigDecimal  balanceamount;

    @Column(name = "paiddatetime")
    @Basic(optional = false)
    private LocalDateTime paiddatetime;

    @Column(name = "description")
    private String description;

    @Column(name = "chequenumber")
    private String chequenumber;

    @Column(name = "chequedate")
    private LocalDate chequedate;

    @Column(name = "bankname")
    private String bankname;

    @Column(name = "accountname")
    private String accountname;

    @Column(name = "accountnumber")
    private String accountnumber;

    @Column(name = "depositedatetime")
    private LocalDateTime depositedatetime;

    @Column(name = "branchname")
    private String branchname;

    @Column(name = "transferid")
    private String transferid;

    @JoinColumn(name = "paymentstatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private PaymentStatus paymentstatus_id;

    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private Supplier supplier_id;

    @JoinColumn(name = "grn_id", referencedColumnName = "id")
    @ManyToOne(optional = true,fetch = FetchType.EAGER)
    private GRN grn_id;

    @JoinColumn(name = "paymentmethod_id", referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private PaymentMethod paymentmethod_id;

    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private Employee employee_id;

    public Payment(Integer id , String billno){
        this.id = id;
        this.billno = billno;
    }


}
