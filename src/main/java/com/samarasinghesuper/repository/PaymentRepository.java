package com.samarasinghesuper.repository;

import com.samarasinghesuper.model.Payment;
import com.samarasinghesuper.model.Porder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    @Query("SELECT pay FROM Payment pay where (pay.billno like concat('%',:searchtext,'%') or " +
            "pay.supplier_id.companyname like concat('%',:searchtext,'%') or " +
            "concat(pay.grnamount,'') like concat('%',:searchtext,'%') or " +
            "pay.paymentmethod_id.name like concat('%',:searchtext,'%') or " +
            "pay.paymentstatus_id.name like concat('%',:searchtext,'%') )")
    Page<Payment> findAll(@Param("searchtext") String searchtext , Pageable of);


 /* //Query for get Porder by given Reg Number
    @Query("select pay from Payment where pay.billno =:billno ")
    Payment getByBillNo(@Param("billno") String billno);
*/
    //
    @Query(value="SELECT new Payment (pay.id,pay.billno) FROM Payment pay")
    List<Payment> list();

    //Get the next Number
    @Query(value = "SELECT concat('SSSP', lpad(substring(max(pay.billno),5)+1,5,'0')) FROM samarasinghesuper.payment as pay;",nativeQuery = true)
    String getNextBillNumber();

}
