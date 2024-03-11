package com.samarasinghesuper.repository;

import com.samarasinghesuper.model.Item;
import com.samarasinghesuper.model.Porder;
import com.samarasinghesuper.model.Supplier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PorderRepository extends JpaRepository<Porder, Integer> {

    @Query("SELECT p FROM Porder p where (p.pordercode like concat('%',:searchtext,'%') or " +
            "p.porderstatus_id.name like concat('%',:searchtext,'%') or " +
            " p.quotation_id.quotationnumber like concat('%',:searchtext,'%'))")
    Page<Porder> findAll(@Param("searchtext") String searchtext , Pageable of);


    //get Ordered porders list by given supplier
    @Query("select new Porder(p.id,p.pordercode,p.totalamount) from Porder p where " +
            "p.quotation_id.quotationrequest_id.supplier_id.id=:supplierid and p.porderstatus_id.id = 1")
    List<Porder> porderListBySupplier(@Param("supplierid") Integer supplierid);

    //get Ordered porders list by given supplier
    @Query("select new Porder(sum(p.totalamount)) from Porder p where " +
            "p.quotation_id.quotationrequest_id.supplier_id.id=:supplierid and p.porderstatus_id.id = 1 group by p.quotation_id.quotationrequest_id.supplier_id.id")
    Porder porderTotalAmountBySupplier(@Param("supplierid") Integer supplierid);


    //Query for get Porder by given Reg Number
    @Query("select p from Porder p where p.pordercode =:pordercode ")
    Porder getByPONumber(@Param("pordercode") String pordercode);

    //List all porder codes
    @Query(value="SELECT new Porder (p.id,p.pordercode) FROM Porder p")
    List<Porder> list();

    //Get the next Number
    @Query(value = "SELECT concat('SSPO', lpad(substring(max(p.pordercode),5)+1,5,'0')) FROM samarasinghesuper.porder as p;",nativeQuery = true)
    String getNextPorderNumber();

}
