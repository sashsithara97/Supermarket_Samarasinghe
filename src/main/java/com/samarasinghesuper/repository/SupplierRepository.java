package com.samarasinghesuper.repository;

import com.samarasinghesuper.model.Employee;
import com.samarasinghesuper.model.Item;
import com.samarasinghesuper.model.Porder;
import com.samarasinghesuper.model.Supplier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SupplierRepository extends JpaRepository<Supplier, Integer> {

    @Query("SELECT s FROM Supplier s where (s.regnumber like concat('%',:searchtext,'%') or " +
            "s.companyname like concat('%',:searchtext,'%') or s.companyland like concat('%',:searchtext,'%') or " +
            "s.contactname like concat('%',:searchtext,'%') or " +
            "s.brn like concat('%',:searchtext,'%') or s.email like concat('%',:searchtext,'%') or " +
            "s.supplierstatus_id.name like concat('%',:searchtext,'%')" +
            ")")
    Page<Supplier> findAll(@Param("searchtext") String searchtext , Pageable of);


    //Query for get Supplier by given Reg Number
    @Query("select s from Supplier s where s.regnumber =:regnumber ")
    Supplier getByRegNumber(@Param("regnumber") String regnumber);

    //Query for get Supplier by given company Land
    @Query("select s from Supplier s where s.companyland =:companyland ")
    Supplier getByCompanyLand(@Param("companyland") String companyland);

    //
    @Query(value="SELECT new Supplier(s.id,s.companyname) FROM Supplier s")
    List<Supplier> list();

    @Query(value="SELECT new Supplier(s.id,s.companyname,s.creditlimit,s.ariasamount,s.email,s.contactname) FROM Supplier s where s.supplierstatus_id.id = 1 or s.supplierstatus_id.id = 2")
    List<Supplier> listbysupplierstatus();

    //Get the next Number
    @Query(value = "SELECT concat('SSS', lpad(substring(max(s.regnumber),4)+1,4,'0')) FROM samarasinghesuper.supplier as s;",nativeQuery = true)
    String getNextRegNumber();

}
