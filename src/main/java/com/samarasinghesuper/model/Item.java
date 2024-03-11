
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
@Table(name = "item")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Item {
    @Id
    @Column(name = "id")
    @Basic(optional = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "itemcode")
    @Pattern(regexp = "^[0-9]{13}$" ,message = "Invalid Item Code")
    @Basic(optional = false)
    private String itemcode;

    @Column(name = "itemname")
    @Basic(optional = false)
    private String  itemname;

    @Column(name = "photo")
    private byte[] photo;

    @Column(name = "rop")
    @Basic(optional = false)
    private Integer rop;

    @Column(name = "roq")
    @Basic(optional = false)
    private Integer roq;

    @Column(name = "addeddate")
    @Basic(optional = false)
    private LocalDate addeddate;

    @Column(name = "description")
    private String description;

    @JoinColumn(name = "itemstatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private ItemStatus itemstatus_id;

    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private Employee employee_id;

    @JoinColumn(name = "brand_id", referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private Brand brand_id;

    @JoinColumn(name = "subcategory_id", referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private Subcategory subcategory_id;

    @JoinColumn(name = "unity_id", referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private Unit unity_id;

    public Item(Integer id , String itemcode, String itemname){
        this.id = id;
        this.itemcode = itemcode;
        this.itemname = itemname;
    }

    public Item(Integer id ,String itemname){
        this.id = id;
        this.itemname = itemname;
    }


    public Item(Integer id , String itemcode, String itemname,ItemStatus itemstatus_id){
        this.id = id;
        this.itemcode = itemcode;
        this.itemname = itemname;
        this.itemstatus_id = itemstatus_id;
    }


}
