package com.samarasinghesuper.repository;

import com.samarasinghesuper.model.Batch;
import com.samarasinghesuper.model.Item;
import com.samarasinghesuper.model.Porder;
import com.samarasinghesuper.model.Quotation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

public interface BatchRepository extends JpaRepository<Batch, Integer> {


  /*  @Query(value="SELECT new Item (i.id,i.itemname) FROM Item i")
    List<Item> list();*/

    @Query("SELECT b FROM Batch b where (b.batchcode like concat('%',:searchtext,'%') or " +
            "b.avaqty like concat('%',:searchtext,'%') or " +
            "b.batchstatus_id.name like concat('%',:searchtext,'%') or " +
            "b.item_id.itemname like concat('%',:searchtext,'%') or " +
            "b.mfgdate like concat('%',:searchtext,'%') or " +
            "b.purchaseprice like concat('%',:searchtext,'%') or " +
            "b.expdate like concat('%',:searchtext,'%') or " +
            " b.salesprice like concat('%',:searchtext,'%'))")
    Page<Batch> findAll(@Param("searchtext") String searchtext, Pageable of);

    //list Batch codes
    @Query(value="SELECT new Batch (b.id,b.batchcode) FROM Batch b")
    List<Batch> list();

    //get batch by given item
    @Query("select new Batch(b.id,b.item_id,b.salesprice) from Batch b where b.item_id.id=:itemid and b.avaqty > 0 order by b.id desc")
    List<Batch> listByItem(@Param("itemid") Integer itemid );

    //get Batch by given Item -> required for invoice
    @Query("select new Batch(b.id,b.batchcode,b.item_id,b.salesprice,b.discount) from Batch b where b.item_id.id=:itemid and b.avaqty > 0")
    List<Batch> InvoiceBatchlistByItem(@Param("itemid") Integer itemid );

        //get active quotation list by given supplier
    @Query("select b from Batch b where b.item_id.id=:itemid and b.batchcode =:batchcode")
    Batch getBatchByItemidAndBatchcode(@Param("itemid")int itemid,@Param("batchcode")String batchcode);

    //Query for get Batch belong to give item and supplier
      //SELECT b.batchcode FROM samarasinghesuper.batch as b where b.item_id = 2 && b.supplier_id=1;

    @Query("select new Batch(b.id,b.batchcode,b.avaqty,b.purchaseprice) from Batch b where b.item_id.id =:itemid and (b.supplier_id.id =:supplierid and b.avaqty > 0)")
  List<Batch> listBySupplierAndItem(@Param("itemid")Integer itemid,@Param("supplierid") Integer supplierid);

    //SELECT b.item_id,sum(b.avaqty),sum(b.totalqty),b.batchstatus_id FROM samarasinghesuper.batch b group by b.item_id ;


    @Query("select new Batch(b.item_id,sum(b.avaqty),sum(b.totalqty),sum(b.returnqty)) from Batch b where " +
            "b.item_id.itemname like concat('%',:searchtext,'%') " +
            "group by b.item_id")
    Page<Batch> itemInventoryList (@Param("searchtext") String searchtext, Pageable of);


}