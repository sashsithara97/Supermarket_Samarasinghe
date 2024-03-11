package com.samarasinghesuper.repository;

import com.samarasinghesuper.model.Customer;
import com.samarasinghesuper.model.Employee;
import com.samarasinghesuper.model.Item;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {


   @Query("SELECT c FROM Customer c where (c.regno like concat('%',:searchtext,'%') or " +
           "c.contactname like concat('%',:searchtext,'%') or c.mobile like concat('%',:searchtext,'%') or " +
           "c.customerstatus_id.name like concat('%',:searchtext,'%') or " +
           "c.addeddate  like concat('%',:searchtext,'%'))")
   Page<Customer> findAll(@Param("searchtext") String searchtext , Pageable of);


    @Query("SELECT c FROM Customer c WHERE c.regno= :regno")
    Customer getByRegno(@Param("regno")String regno);

    @Query("SELECT c FROM Customer c WHERE c.nic= :nic")
    Customer getByNic(@Param("nic")String nic);

    @Query(value="SELECT new Customer (c.id,c.contactname,c.mobile,c.point) FROM Customer c where c.customerstatus_id.id = 1")
    List<Customer> list();

    //Get the next Customer Code
    @Query(value = "SELECT concat('SSC', lpad(substring(max(c.regno),4)+1,5,'0')) FROM samarasinghesuper.customer as c;",nativeQuery = true)
    String getNextCustomerNumber();


}
