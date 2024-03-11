package com.samarasinghesuper.repository;

import com.samarasinghesuper.model.CustomerOrder;
import com.samarasinghesuper.model.Item;
import com.samarasinghesuper.model.Porder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CorderRepository extends JpaRepository<CustomerOrder, Integer> {

    @Query("SELECT c FROM CustomerOrder c where (c.cordercode like concat('%',:searchtext,'%') or " +
            "c.corderstatus_id.name like concat('%',:searchtext,'%') or " +
            " c.customer_id.contactname like concat('%',:searchtext,'%') or "+
            " c.addeddate like concat('%',:searchtext,'%') or "+
            " c.requireddate like concat('%',:searchtext,'%') or " +
            " c.address like concat('%',:searchtext,'%')  )")
    Page<CustomerOrder> findAll(@Param("searchtext") String searchtext , Pageable of);


    //Query for get Porder by given Reg Number
    @Query("select c from CustomerOrder c where c.cordercode =:cordercode ")
    CustomerOrder getByCONumber(@Param("cordercode") String cordercode);

    //list all Coreders
    @Query(value="SELECT new CustomerOrder(c.id,c.cordercode) FROM CustomerOrder c")
    List<CustomerOrder> list();

    //get active Item list by given brand
    @Query("select new CustomerOrder (co.id,co.cordercode,co.totalamount) from CustomerOrder co where " +
            "co.customer_id.id=:customerid and co.corderstatus_id.id = 1")
    List<CustomerOrder> listByCustomer(@Param("customerid") Integer customerid);

//corders pending list
    @Query(value="SELECT new CustomerOrder(c.id,c.cordercode) FROM CustomerOrder c" +
            " where c.corderstatus_id.id =1 or c.corderstatus_id.id =2")
    List<CustomerOrder> listByCorderStatus();

    //Get the next Number
    @Query(value = "SELECT concat('SSCO', lpad(substring(max(c.cordercode),5)+1,5,'0')) " +
            "FROM samarasinghesuper.corder as c;",nativeQuery = true)
    String getNextCorderNumber();

}
