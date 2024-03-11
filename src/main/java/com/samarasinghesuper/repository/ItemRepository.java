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

public interface ItemRepository extends JpaRepository<Item, Integer> {

  /*  @Query(value="SELECT new Item (i.id,i.itemname) FROM Item i")
    List<Item> list();*/

    @Query("SELECT i FROM Item i where (i.itemname like concat('%',:searchtext,'%') or " +
            "i.itemcode like concat('%',:searchtext,'%') or i.subcategory_id.name like concat('%',:searchtext,'%') or " +
            "i.subcategory_id.category_id.name like concat('%',:searchtext,'%') or " +
            "i.itemstatus_id.name like concat('%',:searchtext,'%') or " +
            "i.brand_id.name like concat('%',:searchtext,'%'))")
    Page<Item> findAll(@Param("searchtext") String searchtext , Pageable of);

    //Query for get item by given item code
    @Query("select i from Item i where i.itemcode =:itemcode ")
    Item getByItemCode(@Param("itemcode") String itemcode);

    //Query for get item by given item name
    @Query("select i from Item i where i.itemname =:itemname ")
    Item getByItemName(@Param("itemname") String itemname);

//list item names
    @Query(value="SELECT new Item(i.id,i.itemcode, i.itemname) FROM Item i")
    List<Item> list();

    //list item names
    @Query(value="SELECT new Item(i.id,i.itemcode, i.itemname) FROM Item i where i.itemstatus_id.id = 1")
    List<Item> listbystatus();

    //get active Item list by given brand
    @Query("select new Item(i.id,i.itemcode,i.itemname) from Item i where " +
            "i.brand_id.id=:brandid")
    List<Item> listByBrand(@Param("brandid") Integer brandid);


    //SELECT i.itemname FROM samarasinghesuper.item i where i.id in(select ci.item_id from samarasinghesuper.corder_has_item ci where ci.corder_id = 8);
    //get active Item list by given corder
    @Query("select new Item(i.id,i.itemname) from Item i where i.id in (select co.item_id.id from CorderItem co where co.corder_id.id =:corderid) ")
    List<Item> ItemlistByCorder(@Param("corderid") Integer corderid);

    //SELECT i.itemcode,i.itemname,i.itemstatus_id FROM samarasinghesuper.item as i where i.id in(select pi.item_id from samarasinghesuper.porder_has_item as pi where pi.porder_id = 2) ;
    //get active Item list by given Porder
    @Query("select new Item(i.id,i.itemcode,i.itemname,i.itemstatus_id) from Item i where i.id in (select pi.item_id from PorderItem pi where pi.porder_id.id =:porderid)")
    List<Item> listByPorder(@Param("porderid") Integer porderid);

    //query for get item list by quotation
    @Query("select new Item(i.id,i.itemcode, i.itemname) from Item i where i in(" +
            "select qi.item_id from QuotationItem qi where qi.quotation_id.id=:quotationid) and i.itemstatus_id.id=1")
    List<Item> listByQuotation(@Param("quotationid")Integer quotationid);

    //query for get item list by quotationrequest
    @Query("select new Item(i.id,i.itemname) from Item i where i in(" +
            "select qr.item_id from QuotationRequestItem qr where qr.quotationrequest_id.id=:quotationrequestid) and i.itemstatus_id.id=1")
    List<Item> listByQuotationRequest(@Param("quotationrequestid")Integer quotationrequestid);

    //query for get item list by Supplier
    @Query("select new Item(i.id,i.itemcode,i.itemname) from Item i where i in(" +
            "select qi.item_id from QuotationItem qi where qi.quotation_id.id=:supplierid) and i.itemstatus_id.id=1")
    List<Item> listBySupplier(@Param("supplierid")Integer supplierid);

    //SELECT * FROM samarasinghesuper.item as i where i.id in
    // (select si.item_id from samarasinghesuper.supplieritem si where si.item_id=1);
     //get active Item list by given Supplier
    @Query("select new Item(i.id,i.itemcode,i.itemname) from Item i where i.id in (select si.item_id.id from SupplierItem si where si.supplier_id.id=:supplierid)")
    List<Item> ItemlistBySupplier(@Param("supplierid") Integer supplierid);

    //SELECT i.itemname,i.itemcode FROM samarasinghesuper.item as i where i.id in(select pi.item_id from samarasinghesuper.porder_has_item pi where pi.porder_id = 1) or i.id in (select sb.item_id from samarasinghesuper.supplierreturn_has_batch as sb where sb.supplierreturn_id = 1);
    //listByPorderandSupplierReturn
    @Query("select new Item(i.id,i.itemcode,i.itemname) from Item i where i.id in(" +
            "select pi.item_id.id from PorderItem pi where pi.porder_id.id =:porderid) or i.id in (select sb.item_id.id from SupplierReturnBatch sb where sb.supplierreturn_id.id =:supplierreturnid)")
    List<Item> listByPorderandSupplierReturn(@Param("porderid")Integer porderid,@Param("supplierreturnid")Integer supplierreturnid);


}
