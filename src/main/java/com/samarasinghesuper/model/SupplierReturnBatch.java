package com.samarasinghesuper.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "supplierreturn_has_batch")
public class SupplierReturnBatch {

    @Id
    @Column(name = "id")
    @Basic(optional = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JoinColumn(name = "supplierreturn_id", referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    @JsonIgnore
    private SupplierReturn supplierreturn_id;

    @JoinColumn(name = "batch_id", referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private Batch batch_id;

    @JoinColumn(name = "item_id", referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private Item item_id;

    @JoinColumn(name = "returnreasion_id", referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private ReturnReason returnreasion_id;

    @Column(name = "purchaseprice")
    @Basic(optional = false)
    private BigDecimal purchaseprice;

    @Column(name = "qty")
    @Basic(optional = false)
    private BigDecimal qty;

    @Column(name = "linetotal")
    @Basic(optional = false)
    private BigDecimal linetotal;

}
