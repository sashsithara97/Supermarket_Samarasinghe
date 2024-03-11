package com.samarasinghesuper.controller;

import com.samarasinghesuper.model.*;
import com.samarasinghesuper.repository.*;
import com.samarasinghesuper.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping( value = "/item")
public class ItemController {

    @Autowired
    private UserService userService;

    @Autowired
    private ItemRepository dao;

    @Autowired
    private ItemStatusRepository daoStatus;

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private CategoryRepository daoCategory;

    @Autowired
    private BrandRepository daoBrand;

    @Autowired
    private UnitRepository daoUnit;

    //get mapping for get available item list by quotation [/item/listbyporderandsupplierreturn?porderid=1&supplierreturnid=1]
    @GetMapping(value = "/listbyporderandsupplierreturn",params = {"porderid","supplierreturnid"}, produces = "application/json")
    public List<Item> listByPorderandSupplierReturn(@RequestParam("porderid")int porderid,@RequestParam("supplierreturnid")int supplierreturnid) {
        return dao.listByPorderandSupplierReturn(porderid,supplierreturnid);
    }

    //get mapping for get available item list by quotation [/item/listbyquotation?quotationid=1]
    @GetMapping(value = "/listbyquotation",params = {"quotationid"}, produces = "application/json")
    public List<Item> listByQuotation(@RequestParam("quotationid")int quotationid) {
        return dao.listByQuotation(quotationid);
    }

    //get mapping for get available item list by quotation [/item/listbyquotationrequest?quotationrequestid=1]
    @GetMapping(value = "/listbyquotationrequest",params = {"quotationrequestid"}, produces = "application/json")
    public List<Item> listByQuotationRequest(@RequestParam("quotationrequestid")int quotationrequestid) {
        return dao.listByQuotationRequest(quotationrequestid);
    }

    //get mapping for get available item list by Porder [/item/listbyporder?porderid=1]
    @GetMapping(value = "/listbyporder",params = {"porderid"}, produces = "application/json")
    public List<Item> listByPorder(@RequestParam("porderid")int porderid) {
        return dao.listByPorder(porderid);
    }

    //get mapping for get available item list by Supplier [/item/listbysupplier?supplierid=1]
    @GetMapping(value = "/listbysupplier",params = {"supplierid"}, produces = "application/json")
    public List<Item> listBySupplier(@RequestParam("supplierid")int supplierid) {
        return dao.listBySupplier(supplierid);
    }

  /*  /item/listbybrand?brandid=1*/
    @GetMapping(value = "/listbybrand",params = {"brandid"}, produces = "application/json")
    public List<Item> listByBrand(@RequestParam("brandid") int brandid) {
        return dao.listByBrand(brandid);
    }

    /*  /item/itemlistbysupplier?supplierid=1*/
    @GetMapping(value = "/itemlistbysupplier",params = {"supplierid"}, produces = "application/json")
    public List<Item> itemlistbysupplier(@RequestParam("supplierid") int supplierid) {
        return dao.ItemlistBySupplier(supplierid);
    }

    /*  /item/itemlistbycorder?corderid=1*/
    @GetMapping(value = "/itemlistbycorder",params = {"corderid"}, produces = "application/json")
    public List<Item> itemlistbycorder(@RequestParam("corderid") int corderid) {
        return dao.ItemlistByCorder(corderid);
    }

    //All Items
   @GetMapping(value = "/list", produces = "application/json")
    public List<Item> list() {
        return dao.list();
    }

    //List All Available items
    @GetMapping(value = "/listbystatus", produces = "application/json")
    public List<Item> listbystatus() {
        return dao.list();
    }

    // Find aLL serverice for get All
    @GetMapping(value = "/findAll", params = {"page", "size"}, produces = "application/json")
    public Page<Item> findAll(@RequestParam("page") int page, @RequestParam("size") int size) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());

        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"ITEM");

        if(user!= null && priv.get("select"))
            return dao.findAll(PageRequest.of(page, size , Sort.Direction.DESC,"id"));
        else
            return null;
    }

    // Find aLL serverice for get All with serch value = Table eka load karanawa
    @GetMapping(value = "/findAll",params = {"page", "size","searchtext"}, produces = "application/json")
    public Page<Item> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"ITEM");
        if(user!= null && priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size,Sort.Direction.DESC,"id"));
        }
        return null;
    }

    //Post mapping for Inser data into database
    @PostMapping
    public String insert(@RequestBody Item item){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"ITEM");
        if(user!= null && priv.get("add")){
            try {
                Item extitemcode = dao.getByItemCode(item.getItemcode());
                if(extitemcode != null)
                    return "Error-Saving : Item Code Already Exists...!";

                Item extitemname = dao.getByItemName(item.getItemname());
                if(extitemname != null)
                    return "Error-Saving : Item Name Already Exists...!";

                dao.save(item);
                return "0";
            }
            catch(Exception e) {
                return "Error-Insert : "+e.getMessage();
            }
        }
        return "Error-Insert : You have no Permission";
    }

    //Put mapping for Update data into database
    @PutMapping
    public String update(@RequestBody Item item){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"ITEM");
        if(user!= null && priv.get("update")){
            try {
                Item extitem = dao.getById(item.getId());
                if(extitem == null)
                    return "Error-Updating : Item Not Exsites...!";


                dao.save(item);

                return "0";
            }
            catch(Exception e) {
                return "Error-Updating : "+e.getMessage();
            }
        }
        return "Error-Updating : You have no Permission";
    }



    // Delete Mapping for Delete Item object
    @DeleteMapping()
    public String delete(@RequestBody Item item ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"ITEM");
        if(user!= null && priv.get("delete")){
            try {
                //   dao.delete(dao.getOne(item.getId()));
                item.setItemstatus_id(daoStatus.getById(3));
                dao.save(item);

                return "0";
            }
            catch(Exception e) {
                return "Error-Deleting : "+e.getMessage();
            }
        }
        return "Error-Deleting : You have no Permission";

    }

}
