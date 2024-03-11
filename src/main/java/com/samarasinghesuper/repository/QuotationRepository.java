package com.samarasinghesuper.repository;

import com.samarasinghesuper.model.Quotation;
import com.samarasinghesuper.model.Supplier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface QuotationRepository extends JpaRepository<Quotation, Integer> {

    @Query("SELECT q FROM Quotation q where (q.quotationnumber like concat('%',:searchtext,'%') or " +
            "q.addeddate like concat('%',:searchtext,'%') or q.receiveddate like concat('%',:searchtext,'%') or " +
            "q.validfrom like concat('%',:searchtext,'%') or " +
            "q.validto like concat('%',:searchtext,'%') or q.quotationstatus_id.name like concat('%',:searchtext,'%') or " +
            "q.quotationrequest_id.qrcode like concat('%',:searchtext,'%')" +
            ")")
    Page<Quotation> findAll(@Param("searchtext") String searchtext , Pageable of);


    //Next number generation
    @Query(value = "SELECT concat('SSQ', lpad(substring(max(q.quotationnumber),4)+1,4,'0')) FROM samarasinghesuper.quotation as q;",nativeQuery = true)
    String getNextRegNumber();

    //Quotation code list ekan
    @Query(value="SELECT new Quotation (q.id,q.quotationnumber) FROM Quotation q")
    List<Quotation> list();

    //get active quotation list by given supplier
    //between valid from date and valid to date (:currentdate (dena lada parameter eka )between balanawa ara date deka athara)
    @Query("select new Quotation(q.id,q.quotationnumber,q.quotationrequest_id) from Quotation q where " +
            "q.quotationrequest_id.supplier_id.id=:supllierid and (:currentdate between q.validfrom and q.validto) and q.quotationrequest_id.qrstatus_id.id= 2")
    List<Quotation> listBySupplier(@Param("supllierid") Integer supllierid,@Param("currentdate") LocalDate currentdate);

    //
    @Query(value="SELECT new Quotation (q.id,q.quotationnumber) FROM Quotation q where q.quotationnumber=:quotationnumber")
    Quotation getByQuotationNumber(@Param("quotationnumber") String quotationnumber);

}
