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
@Table(name = "grn_has_batch")
public class GrnBatch {

    @Id
    @Column(name = "id")
    @Basic(optional = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JoinColumn(name = "grn_id", referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    @JsonIgnore
    private GRN grn_id;

    @JoinColumn(name = "batch_id", referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private Batch batch_id;

    @Column(name = "purchaseprice")
    @Basic(optional = false)
    private BigDecimal purchaseprice;

    @Column(name = "receivedqty")
    @Basic(optional = false)
    private BigDecimal receivedqty ;

    @Column(name = "linetotal")
    @Basic(optional = false)
    private BigDecimal linetotal;

    @Column(name = "freeqty")
    @Basic(optional = false)
    private BigDecimal freeqty;

    @Column(name = "returnqty")
    @Basic(optional = false)
    private BigDecimal returnqty;

    @Column(name = "totalrqty")
    @Basic(optional = false)
    private BigDecimal totalrqty ;



}
