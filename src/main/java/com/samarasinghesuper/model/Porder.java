package com.samarasinghesuper.model;

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
@Table(name = "porder")

public class Porder {

    @Id
    @Column(name = "id")
    @Basic(optional = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "pordercode")
    @Basic(optional = false)
    private String pordercode;

    @Column(name = "addeddate")
    @Basic(optional = false)
    private LocalDate addeddate;

    @Column(name = "requireddate")
    @Basic(optional = false)
    private LocalDate requireddate;

    @Column(name = "totalamount")
    @Basic(optional = false)
    private BigDecimal  totalamount;

    @Column(name = "description")
    private String description;

    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private Employee employee_id;

    @JoinColumn(name = "quotation_id", referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private Quotation quotation_id;

    @JoinColumn(name = "porderstatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private PorderStatus  porderstatus_id;

    @OneToMany( cascade = CascadeType.ALL, fetch = FetchType.LAZY , mappedBy = "porder_id", orphanRemoval = true)
    private List<PorderItem> porderItemList;

    public Porder(Integer id , String pordercode){
        this.id = id;
        this.pordercode = pordercode;
    }

    public Porder(Integer id , String pordercode,BigDecimal totalamount){
        this.id = id;
        this.pordercode = pordercode;
        this.totalamount = totalamount;
    }

    public Porder(BigDecimal totalamount){
        this.totalamount = totalamount;
    }

}
