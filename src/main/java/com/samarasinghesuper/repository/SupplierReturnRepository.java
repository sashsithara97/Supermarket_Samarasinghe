package com.samarasinghesuper.repository;

import com.samarasinghesuper.model.Item;
import com.samarasinghesuper.model.Porder;
import com.samarasinghesuper.model.SupplierReturn;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SupplierReturnRepository extends JpaRepository<SupplierReturn, Integer> {

    @Query("SELECT sr FROM SupplierReturn sr where (sr.supplierreturnno like concat('%',:searchtext,'%') or " +
            "sr.srstatus_id.name like concat('%',:searchtext,'%') or " +
            " sr.supplier_id.companyname like concat('%',:searchtext,'%'))")
    Page<SupplierReturn> findAll(@Param("searchtext") String searchtext , Pageable of);

    //*/
    @Query(value="SELECT new SupplierReturn (sr.id,sr.supplierreturnno) FROM SupplierReturn sr")
    List<SupplierReturn> list();


    //Query for get Supplier return by given supplier return number
    @Query("select sr from SupplierReturn sr where sr.supplierreturnno =:supplierreturnno ")
    SupplierReturn getBySupplierreturnno(@Param("supplierreturnno") String supplierreturnno);


    //get Ordered porders list by given supplier
    @Query("select new SupplierReturn (sr.id,sr.supplierreturnno,sr.srstatus_id,sr.returntotalamount) from SupplierReturn sr where " +
            "sr.supplier_id.id=:supplierid and sr.srstatus_id.id= 1")
    List<SupplierReturn> supplierreturnListBySupplier(@Param("supplierid") Integer supplierid);

    //Get the next Number
    @Query(value = "SELECT concat('SSRN', lpad(substring(max(sr.supplierreturnno),5)+1,5,'0')) FROM samarasinghesuper.supplierreturn as sr;",nativeQuery = true)
    String getNextSupplierReturnNumber();

}
