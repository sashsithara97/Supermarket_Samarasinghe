package com.samarasinghesuper.controller;


import com.samarasinghesuper.model.*;
import com.samarasinghesuper.repository.*;
import com.samarasinghesuper.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.util.HashMap;
import java.util.List;

@EnableAsync
@RequestMapping(value = "/supplierreturn")
@RestController
public class SupplierReturnController {


    @Autowired
    private SupplierReturnRepository dao;

    @Autowired
    private BatchRepository daoBatch;

    @Autowired
    private PrevilageController previlageController;


    @Autowired
    private UserService userService;
    
    @Autowired
    private SupplierReturnStatusRepository daoSupplierReturnstatus;

   
    @GetMapping(value = "/nextnumber", produces = "application/json")
    public SupplierReturn nextNumber() {
        String nextnumber = dao.getNextSupplierReturnNumber();
        SupplierReturn sr = new SupplierReturn();
        if(nextnumber != ""){
            sr.setSupplierreturnno(nextnumber);
        }else {
            sr.setSupplierreturnno("SSRN00001");
        }

        return sr;

    }
    @GetMapping(value = "/list", produces = "application/json")
    public List<SupplierReturn> list() {
        return dao.list();
    }


      //supplierreturn/supplierreturnlistbysupplier?supplierid=1
    @GetMapping(value = "/supplierreturnlistbysupplier",params = {"supplierid"}, produces = "application/json")
    public List<SupplierReturn> supplierreturnListBySupplier(@RequestParam("supplierid") int supplierid) {
        return dao.supplierreturnListBySupplier(supplierid);}

    // Find aLL serverice for get All
    @GetMapping(value = "/findAll", params = {"page", "size"}, produces = "application/json")
    public Page<SupplierReturn> findAll(@RequestParam("page") int page, @RequestParam("size") int size) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"SUPPLIERRETURN");
        if(user!= null && priv.get("select"))
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC,"id"));
        else
            return null;
    }

    // Find aLL serverice for get All with serch value
    @GetMapping(value = "/findAll",params = {"page", "size","searchtext"}, produces = "application/json")
    public Page<SupplierReturn> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"SUPPLIERRETURN");
        if(user!= null && priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size,Sort.Direction.DESC,"id"));
        }
        return null;
    }

    //Post mapping for Inser data into database
    @PostMapping
    public String insert(@RequestBody SupplierReturn supplierReturn){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());

        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"SUPPLIERRETURN");
        if(user!= null && priv.get("add")){

            try {
                SupplierReturn existreturncode = dao.getBySupplierreturnno(supplierReturn.getSupplierreturnno());
                if(existreturncode != null)
                    return "Error-Saving :Return Allready Exsites...!";

                //list eke eka object ekak aran thiyenne srb walata eta passe srb eke supplierreturn id eka set karanawa
                for (SupplierReturnBatch srb : supplierReturn.getSupplierReturnBatchList())
                    srb.setSupplierreturn_id(supplierReturn);

                dao.save(supplierReturn);
                for (SupplierReturnBatch srb : supplierReturn.getSupplierReturnBatchList()){
                    //return karapu batch object eka genna ganna variable ekak hadanawa
                    Batch receivedbatch = daoBatch.getById(srb.getBatch_id().getId());

                    //e object eke thiyenne available qty eken api return karapu gana adu karanna
                    receivedbatch.setAvaqty(receivedbatch.getAvaqty().add(srb.getQty()));

                    //e object ekema return quantity thiyenwane ekata ara return una quantity eka ekathu karanna
                    receivedbatch.setReturnqty(receivedbatch.getReturnqty().add(srb.getQty()));

                    daoBatch.save(receivedbatch);
                }

                return "0";
            }
            catch(Exception e) {
                return "Error-Insert : "+e.getMessage();
            }
        }
        return "Error-Insert : You have no Permission";
    }


   /* @PutMapping()
    public String update(@Validated @RequestBody SupplierReturn supplierReturn) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"SUPPLIERRETURN");
        if(user!= null && priv.get("update")){

            SupplierReturn sreturn = dao.getBySupplierreturnno(supplierReturn.getSupplierreturnno());
        if(sreturn==null || sreturn.getId()==supplierReturn.getId()) {
            try {

                dao.save(supplierReturn);
                return "0";
            }
            catch(Exception e) {
                return "Error-Updating : "+e.getMessage();
            }
        }
        else {  return "Error-Updating :Po Code Exists"; }
        }
        return "Error-Updating : You have no Permission";
    }*/

    @Transactional
    @DeleteMapping()
    public String delete(@RequestBody SupplierReturn supplierReturn ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"SUPPLIERRETURN");
        if(user!= null && priv.get("delete")){
            try {

               for (SupplierReturnBatch srb : supplierReturn.getSupplierReturnBatchList())
                    srb.setSupplierreturn_id(supplierReturn);
             //   dao.delete(dao.getOne(supplier.getId()));
                supplierReturn.setSrstatus_id(daoSupplierReturnstatus.getById(4));
                dao.save(supplierReturn);

                for (SupplierReturnBatch srb : supplierReturn.getSupplierReturnBatchList()){

                    //return karapu batch object eka genna ganna variable ekak hadanawa
                    Batch receivedbatch = daoBatch.getById(srb.getBatch_id().getId());

                    //e object eke thiyenne available qty eken api return karapu gana adu karanna
                    receivedbatch.setAvaqty(receivedbatch.getAvaqty().add(srb.getQty()));

                    //e object ekema return quantity thiyenwane ekata ara return una quantity eka ekathu karanna
                    receivedbatch.setReturnqty(receivedbatch.getReturnqty().subtract(srb.getQty()));

                    daoBatch.save(receivedbatch);

                }


            return "0";
        }
        catch(Exception e) {
            return "Error-Deleting : "+e.getMessage();
        }
    }
        return "Error-Deleting : You have no Permission";

    }



}
