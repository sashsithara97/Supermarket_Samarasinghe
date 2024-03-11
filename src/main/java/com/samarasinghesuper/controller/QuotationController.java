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
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;

@EnableAsync
@RequestMapping(value = "/quotation")
@RestController
public class QuotationController {



    @Autowired
    private QrStatusRepository daoQrStatus;


    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private QuotationRepository dao;

    @Autowired
    private QuotationrequestRepository daoQuotationrequest;

    @Autowired
    private UserService userService;
    
    @Autowired
    private QuotationStatusRepository daoQuotationStatus;

    //get mapping services for get active quotation list by given supplier [/quotation/listbysupplier?supplierid=1]
    @GetMapping(value = "/listbysupplier",params = {"supplierid"}, produces = "application/json")
    public List<Quotation> listBySupplier(@RequestParam("supplierid") int supplierid) {
        return dao.listBySupplier(supplierid, LocalDate.now());
    }

    //get mapping services for get quotation list
    @GetMapping(value = "/list", produces = "application/json")
    public List<Quotation> list() {
        return dao.list();
    }

//Get Next Number
    @GetMapping(value = "/nextnumber", produces = "application/json")
    public Quotation nextNumber() {
        String nextnumber = dao.getNextRegNumber();
        Quotation quo = new Quotation();
        if(nextnumber != ""){
            quo.setQuotationnumber(nextnumber);
        }else {
            quo.setQuotationnumber("SSQ0001");
        }

        return quo;

    }

    // Find aLL serverice for get All
    @GetMapping(value = "/findAll", params = {"page", "size"}, produces = "application/json")
    public Page<Quotation> findAll(@RequestParam("page") int page, @RequestParam("size") int size) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"QUOTATION");
        if(user!= null && priv.get("select"))
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC,"id"));
        else
            return null;
    }

    // Find aLL serverice for get All with serch value
    @GetMapping(value = "/findAll",params = {"page", "size","searchtext"}, produces = "application/json")
    public Page<Quotation> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"QUOTATION");
        if(user!= null && priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC,"id"));
        }
        return null;
    }


    @PostMapping()
    public String add(@Validated @RequestBody Quotation quotation) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"QUOTATION");
        if(user!= null && priv.get("add")) {
            Quotation qcode = dao.getByQuotationNumber(quotation.getQuotationnumber());
            if (qcode != null)
                return "Error-Validation : Quotation Code Exists";
            else
                try {
                    for (QuotationItem qi : quotation.getQuotationItemList())
                        qi.setQuotation_id(quotation);

                    dao.save(quotation);

                    Quotationrequest quotationreceived = daoQuotationrequest.getById(quotation.getQuotationrequest_id().getId());
                    quotationreceived.setQrstatus_id(daoQrStatus.getById(2));

                    for (QuotationRequestItem qri : quotationreceived.getQuotationrequestItemList())
                        qri.setQuotationrequest_id(quotationreceived);

                //Save karanne Quotation request object eak nisa eyage dao ekata thama save denna oni
                    daoQuotationrequest.save(quotationreceived);

                 //  emailService.sendMail("harithapramodha@gmail.com","Registor Supplier","Supplier Registration Success Fully...!\n\n Thank You to join with us.. \n\n from : Sudu buthaya");
                    return "0";
                } catch (Exception e) {
                    return "Error-Saving : " + e.getMessage();
                }
       }
        return "Error-Saving : You have no Permission";

    }

    @PutMapping()
    public String update(@Validated @RequestBody Quotation quotation) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"QUOTATION");
        if(user!= null && priv.get("update")){
            Quotation quota = dao.getByQuotationNumber(quotation.getQuotationnumber());
        if(quota==null || quota.getId()==quotation.getId()) {
            try {

                for (QuotationItem qi : quotation.getQuotationItemList())
                    qi.setQuotation_id(quotation);

                dao.save(quotation);
                return "0";
            }
            catch(Exception e) {
                return "Error-Updating : "+e.getMessage();
            }
        }
        else {  return "Error-Updating : NIC Exists"; }
        }
        return "Error-Updating : You have no Permission";
    }

    @Transactional
    @DeleteMapping()
    public String delete(@RequestBody Quotation quotation ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"QUOTATION");
        if(user!= null && priv.get("delete")){
            try {

                for (QuotationItem qi : quotation.getQuotationItemList())
                    qi.setQuotation_id(quotation);
             //   dao.delete(dao.getOne(supplier.getId()));
                quotation.setQuotationstatus_id(daoQuotationStatus.getById(3));

                dao.save(quotation);
            return "0";
        }
        catch(Exception e) {
            return "Error-Deleting : "+e.getMessage();
        }
    }
        return "Error-Deleting : You have no Permission";

    }



}
