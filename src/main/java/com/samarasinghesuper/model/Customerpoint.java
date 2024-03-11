package com.samarasinghesuper.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "customerpoint")
public class Customerpoint {

    @Id
    @Column(name = "id")
    @Basic(optional = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "loyaltytype")
    @Basic(optional = false)
    private String loyaltytype;

    @Column(name = "startrate")
    @Basic(optional = false)
    private BigDecimal startrate;

    @Column(name = "endrate")
    @Basic(optional = false)
    private BigDecimal endrate;

    @Column(name = "addpoint")
    private BigDecimal addpoint;

    @Column(name = "discount")
    @Basic(optional = false)
    private BigDecimal discount;



}
