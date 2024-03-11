package com.samarasinghesuper.repository;

import com.samarasinghesuper.model.Invoice;
import com.samarasinghesuper.model.Porder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {

    @Query("SELECT inv FROM Invoice inv where (inv.invoiceno like concat('%',:searchtext,'%') or " +
            "inv.invoicestatus_id.name like concat('%',:searchtext,'%') or " +
            "inv.discountratio like concat('%',:searchtext,'%') or " +
            "inv.totalamount like concat('%',:searchtext,'%') or " +
            "inv.paidamount like concat('%',:searchtext,'%') or " +
            "inv.netamount like concat('%',:searchtext,'%')  or " +
            "inv.id = any(select nhi.invoice_id.id from InvoiceItem nhi where nhi.item_id.itemname like concat('%',:searchtext,'%'))  )  ")
    Page<Invoice> findAll(@Param("searchtext") String searchtext , Pageable of);


    //Query for get Porder by given Reg Number
    @Query("select inv from Invoice inv where inv.invoiceno =:invoiceno ")
    Invoice getByInvoiceNumber(@Param("invoiceno") String invoiceno);

    //
    @Query(value="SELECT new Invoice (inv.id,inv.invoiceno) FROM Invoice inv")
    List<Invoice> list();

    //Get the next Number
    @Query(value = "SELECT concat('SSIN', lpad(substring(max(inv.invoiceno),5)+1,5,'0')) FROM samarasinghesuper.invoice as inv;",nativeQuery = true)
    String getNextInvoiceNumber();

}
