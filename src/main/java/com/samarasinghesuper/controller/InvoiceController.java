package com.samarasinghesuper.controller;


import com.samarasinghesuper.model.*;
import com.samarasinghesuper.repository.*;
import com.samarasinghesuper.service.SMSService;
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
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;

@EnableAsync
@RequestMapping(value = "/invoice")
@RestController
public class InvoiceController {


    @Autowired
    private InvoiceRepository dao;

    @Autowired
    private SMSService smsService;

    @Autowired
    private UserService userService;

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private CorderRepository daoCorder;

    @Autowired
    private BatchRepository daoBatch;

    @Autowired
    private CorderStatusRepository daoCorderStatus;

    @Autowired
    private CustomerRepository daoCustomer;

    @Autowired
    private CorderRepository daoCustomerOrder;

    @GetMapping(value = "/nextnumber", produces = "application/json")
    public Invoice getNextInvoiceNumber() {
        String nextnumber = dao.getNextInvoiceNumber();
        Invoice inv = new Invoice();
        if (nextnumber != "") {
            inv.setInvoiceno(nextnumber);
        } else {
            inv.setInvoiceno("SSIN0001");
        }

        return inv;

    }


    @GetMapping(value = "/list", produces = "application/json")
    public List<Invoice> list() {
        return dao.list();
    }

    // Find aLL serverice for get All
    @GetMapping(value = "/findAll", params = {"page", "size"}, produces = "application/json")
    public Page<Invoice> findAll(@RequestParam("page") int page, @RequestParam("size") int size) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "INVOICE");
        if (user != null && priv.get("select"))
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        else
            return null;
    }

    // Find aLL serverice for get All with serch value
    @GetMapping(value = "/findAll", params = {"page", "size", "searchtext"}, produces = "application/json")
    public Page<Invoice> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "INVOICE");
        if (user != null && priv.get("select")) {
            return dao.findAll(searchtext, PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }
        return null;
    }


    @PostMapping()
    public String add(@Validated @RequestBody Invoice invoice) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "INVOICE");
        if (user != null && priv.get("add")) {

            Invoice invoicenumber = dao.getByInvoiceNumber(invoice.getInvoiceno());
            if (invoicenumber != null)
                return "Error-Validation : Invoice Number Exists";
            else
                try {
                    for (InvoiceItem invi : invoice.getInvoiceItemList())
                        invi.setInvoice_id(invoice);

                    dao.save(invoice);



                    if(invoice.getCorder_id() != null){
                        CustomerOrder extcorder = daoCorder.getById(invoice.getCorder_id().getId());
                    }


//Customer order ekakata invoice ekak damma nm e order eka iwarai..eke status maru karanna oni
                    float total = (invoice.getTotalamount().floatValue());

               /*     if (extcorder != null) {
                        extcorder.setCorderstatus_id(daoCorderStatus.getById(4));

//discount eka set kala adala registered customerta

                        if (total <= 1000.00) {
                            extcorder.setDiscountratio(BigDecimal.valueOf(2.00));
                        } else if (total <= 5000.00) {

                            extcorder.setDiscountratio(BigDecimal.valueOf(5.00));

                        } else if (total <= 100000.00) {
                            extcorder.setDiscountratio(BigDecimal.valueOf(10.00));

                        }
                        for (CorderItem ci : extcorder.getCorderItemList())
                            ci.setCorder_id(extcorder);
                        daoCorder.save(extcorder);

                    }*/

                    // Set Customer ponts to registered customer
                    if(invoice.getCustomer_id() != null){

                        Customer extcustomer = daoCustomer.getById(invoice.getCustomer_id().getId());

                        String message = "Your Invoice Amount is : "+ invoice.getNetamount()+ ". Your New Point Value is : "
                                + extcustomer.getPoint() + "\nThank you\n Samarasinghe Super";
                        String tonumber = "+94" + extcustomer.getMobile().substring(1);
                        System.out.println(tonumber + " ---- " + message);
                        SMS sms = new SMS("+94703307951",message);
                        smsService.send(sms);




                        if (extcustomer != null) {

                            System.out.println(total);

                            if(total <= 1000.00){
                                BigDecimal point = BigDecimal.valueOf(total * 0.001);
                                extcustomer.setPoint(extcustomer.getPoint().add(point));

                            }else if(total <= 5000.00){
                                BigDecimal point =BigDecimal.valueOf (total * 0.005);
                                extcustomer.setPoint(extcustomer.getPoint().add(point));

                            }else if(total <= 10000.00){
                                BigDecimal point = BigDecimal.valueOf(total * 0.01);
                                extcustomer.setPoint(extcustomer.getPoint().add(point));

                            }

                            daoCustomer.save(extcustomer);



                        }
                    }



//Batch eka save kala api sales kloth e batch eke available qty eken api sale karapu gana adu wenna oni
                    for (InvoiceItem extbatch : invoice.getInvoiceItemList()) {

                        Batch inviocebatch = daoBatch.getById(extbatch.getBatch_id().getId());
                        inviocebatch.setAvaqty(inviocebatch.getAvaqty().subtract(extbatch.getQty()));
                        daoBatch.save(inviocebatch);

                    }


                    //  emailService.sendMail("harithapramodha@gmail.com","Registor Supplier","Supplier Registration Success Fully...!\n\n Thank You to join with us.. \n\n from : Sudu buthaya");
                    return "0";
                } catch (Exception e) {
                    return "Error-Saving : " + e.getMessage();
                }
        }
        return "Error-Saving : You have no Permission";

    }

}
