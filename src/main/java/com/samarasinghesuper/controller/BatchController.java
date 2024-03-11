package com.samarasinghesuper.controller;

import com.samarasinghesuper.model.*;
import com.samarasinghesuper.repository.BatchRepository;
import com.samarasinghesuper.repository.BatchStatusRepository;
import com.samarasinghesuper.repository.CustomerRepository;
import com.samarasinghesuper.repository.CustomerstatusRepository;
import com.samarasinghesuper.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping( value = "/batch")
public class BatchController {

    @Autowired
    private UserService userService;

    @Autowired
    private BatchRepository dao;

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private BatchStatusRepository daoStatus;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Batch> list() {
        return dao.list();
    }

    //get mapping services for get active batch list by given item [/batch/listbyitem?itemid=1]
    @GetMapping(value = "/listbyitem",params = {"itemid"}, produces = "application/json")
    public Batch listByItem(@RequestParam("itemid")int itemid) {
        List<Batch> listbyitem =  dao.listByItem(itemid);
        if(listbyitem.size() > 0){
            return  listbyitem.get(0);
        }else {
            return null;
        }
    }

    //get mapping for get available item list by Porder [/item/listbyporder?porderid=1]
    @GetMapping(value = "/invoicebatchlistbyitem",params = {"itemid"}, produces = "application/json")
    public List<Batch> InvoiceBatchlistByItem(@RequestParam("itemid")int itemid) {
        return dao.InvoiceBatchlistByItem(itemid);
    }


    @GetMapping(value = "/iteminventorylist",params = {"page", "size","searchtext"}, produces = "application/json")
    public Page<Batch> itemInventoryList(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        return dao.itemInventoryList(searchtext,PageRequest.of(page, size));
    }

    // Find aLL serverice for get All
    @GetMapping(value = "/findAll", params = {"page", "size"}, produces = "application/json")
    public Page<Batch> findAll(@RequestParam("page") int page, @RequestParam("size") int size) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());

        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"BATCH");

        if(user!= null && priv.get("select"))
            return dao.findAll(PageRequest.of(page, size , Sort.Direction.DESC,"id"));
        else
            return null;
    }

  // Find aLL serverice for get All with serch value
    @GetMapping(value = "/findAll",params = {"page", "size","searchtext"}, produces = "application/json")
    public Page<Batch> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"BATCH");
        if(user!= null && priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size));
        }
        return null;
    }

  // Delete Mapping for Delete Batch object
    @DeleteMapping()
    public String delete(@RequestBody Batch batch ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"BATCH");
        if(user!= null && priv.get("delete")){
            try {
                //   dao.delete(dao.getOne(item.getId()));
                batch.setBatchstatus_id(daoStatus.getById(2));
                dao.save(batch);

                return "0";
            }
            catch(Exception e) {
                return "Error-Deleting : "+e.getMessage();
            }
        }
        return "Error-Deleting : You have no Permission";

    }

    //get mapping services for get batches list by item and supplier [/batch/listbysupplieranditem?supplierid=1&itemid=2]
    @GetMapping(value = "/listbysupplieranditem",params = {"itemid","supplierid"}, produces = "application/json")
    public List<Batch> listBySupplierAndItem(@RequestParam("itemid")int itemid,@RequestParam("supplierid")int supplierid) {
        return dao.listBySupplierAndItem(itemid,supplierid);
    }

    //get mapping services for get batches list by item and batch [/batch/batchlistbybatch?itemid=1&batchcode=B001]
    @GetMapping(value = "/batchlistbybatch",params = {"itemid","batchcode"}, produces = "application/json")
    public Batch batchlistByBatch(@RequestParam("itemid")int itemid,@RequestParam("batchcode")String batchcode) {
        return dao.getBatchByItemidAndBatchcode(itemid,batchcode);
    }


    //Put mapping for Update data into database
    @PutMapping
    public String update(@RequestBody Batch batch){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"BATCH");
        if(user!= null && priv.get("update")){
            try {
                Batch extbatch = dao.getById(batch.getId());
                if(extbatch == null)
                    return "Error-Updating : Batch Not Exists...!";


                dao.save(batch);

                return "0";
            }
            catch(Exception e) {
                return "Error-Updating : "+e.getMessage();
            }
        }
        return "Error-Updating : You have no Permission";
    }




}
