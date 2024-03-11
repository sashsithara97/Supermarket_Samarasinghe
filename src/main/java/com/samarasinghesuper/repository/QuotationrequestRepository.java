package com.samarasinghesuper.repository;

import com.samarasinghesuper.model.Employee;
import com.samarasinghesuper.model.Item;
import com.samarasinghesuper.model.Quotation;
import com.samarasinghesuper.model.Quotationrequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuotationrequestRepository extends JpaRepository<Quotationrequest, Integer> {

    @Query("SELECT qr FROM Quotationrequest qr where (qr.qrcode like concat('%',:searchtext,'%') " +
            " or qr.qrstatus_id.name like concat('%',:searchtext,'%') or qr.supplier_id.contactname like concat('%',:searchtext,'%'))")
    Page<Quotationrequest> findAll(@Param("searchtext") String searchtext , Pageable of);

    //Query for get QR by given  code
    @Query("select qr from Quotationrequest qr where qr.qrcode =:qrcode")
    Quotationrequest getByQRCode(@Param("qrcode") String qrcode);

    @Query(value = "SELECT concat('SQR', lpad(substring(max(qr.qrcode),4)+1,4,'0')) FROM samarasinghesuper.quotationrequest as qr;",nativeQuery = true)
    String getNextRegNumber();

    @Query(value="SELECT new Quotationrequest(qr.id,qr.qrcode) FROM Quotationrequest qr")
    List<Quotationrequest> list();

 //get active quotation list by given supplier
    @Query("select new Quotationrequest(qr.id,qr.qrcode,qr.supplier_id) from Quotationrequest qr where " +
            "qr.supplier_id.id=:supllierid and qr.qrstatus_id.id=1")
    List<Quotationrequest> QRlistBySupplier(@Param("supllierid") Integer supllierid);

}
