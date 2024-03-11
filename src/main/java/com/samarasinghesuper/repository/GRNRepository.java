package com.samarasinghesuper.repository;

import com.samarasinghesuper.model.GRN;
import com.samarasinghesuper.model.Porder;
import com.samarasinghesuper.model.Quotation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface GRNRepository extends JpaRepository<GRN, Integer> {

    @Query("SELECT g FROM GRN g where (g.grncode like concat('%',:searchtext,'%') or " +
            "g.discountratio like concat('%',:searchtext,'%') or " +
            " g.totalamount like concat('%',:searchtext,'%')or "+
            " g.nettotal like concat('%',:searchtext,'%') )")
    Page<GRN> findAll(@Param("searchtext") String searchtext , Pageable of);

    //Query for get Porder by given Reg Number
    @Query("select g from GRN g where g.grncode =:grncode")
    GRN getByGrncode(@Param("grncode") String grncode);

    //Get the next Number
    @Query(value = "SELECT concat('SSGR', lpad(substring(max(g.grncode),5)+1,5,'0')) FROM samarasinghesuper.grn as g;",nativeQuery = true)
    String getNextGRNNumber();

    //get Pending grn list by given supplier
      @Query("select new GRN(g.id,g.grncode,g.nettotal) from GRN g where g.supplier_id.id=:supllierid and g.grnstatus_id.id=1")
  List<GRN> grnListBySupplier(@Param("supllierid") Integer supllierid);


    @Query(value="SELECT new GRN (g.id,g.grncode) FROM GRN g")
    List<GRN> list();

}
