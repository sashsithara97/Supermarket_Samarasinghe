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
@RequestMapping(value = "/payment")
@RestController
public class PaymentController {


    @Autowired
    private PaymentRepository dao;

    @Autowired
    private UserService userService;


    @Autowired
    private PrevilageController previlageController;


    @Autowired
    private SupplierRepository daoSupplier;

    @Autowired
    private GRNRepository daoGRN;

    @Autowired
    private GRNStatusRepository daoGRNStatus;

    @Autowired
    private PorderRepository daoPorder;

    @Autowired
    private PorderStatusRepository daoPorderStatus;

    @GetMapping(value = "/nextnumber", produces = "application/json")
    public Payment getNextBillNumber() {
        String nextnumber = dao.getNextBillNumber();
        Payment pay = new Payment();
        if(nextnumber != ""){
            pay.setBillno(nextnumber);
        }else {
            pay.setBillno("SSSP0001");
        }

        return pay;

    }

    @GetMapping(value = "/list", produces = "application/json")
    public List<Payment> list() {
        return dao.list();
    }

    // Find aLL serverice for get All
    @GetMapping(value = "/findAll", params = {"page", "size"}, produces = "application/json")
    public Page<Payment> findAll(@RequestParam("page") int page, @RequestParam("size") int size) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"PAYMENT");
        if(user!= null && priv.get("select"))
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC,"id"));
        else
            return null;
    }

 // Find aLL serverice for get All with serch value
    @GetMapping(value = "/findAll",params = {"page", "size","searchtext"}, produces = "application/json")
    public Page<Payment> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"PAYMENT");
        if(user!= null && priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC,"id"));
        }
        return null;
    }


    @PostMapping
    public String add(@RequestBody Payment payment){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"PAYMENT");
        if(user!= null && priv.get("add")){
            try {

               dao.save(payment);

                //Completed the Porder
                if (payment.getGrn_id() != null) {

                    //GRn ekata save karanawa e adala grn ekata paid amount eka
                    GRN updatedgrn = daoGRN.getById(payment.getGrn_id().getId());
                    updatedgrn.setGrnstatus_id(daoGRNStatus.getById(2));
                    updatedgrn.setPaidamount(payment.getPaidamount());

                    for (GrnBatch gb : updatedgrn.getGrnBatchList())
                        gb.setGrn_id(updatedgrn);

                    daoGRN.save(updatedgrn);

                    //Poreder eke Status hadanawa
                Porder receivedporder = daoPorder.getById(updatedgrn.getPorder_id().getId());
                    receivedporder.setPorderstatus_id(daoPorderStatus.getById(2));

                    for (PorderItem pi : receivedporder.getPorderItemList())
                        pi.setPorder_id(receivedporder);

                    daoPorder.save(receivedporder);

                }

                //payment eke dan aluth wena ariase eka e adala supplierta ariase ekata save karanawa
            Supplier newsupplierariase = daoSupplier.getById(payment.getSupplier_id().getId());
            newsupplierariase.setAriasamount(payment.getAriaseamount());

            //innerform thiyenawanm aniwa loop eka danna
            for (SupplierItem sb : newsupplierariase.getSupplierItemList())
                    sb.setSupplier_id(newsupplierariase);

            daoSupplier.save(newsupplierariase);

                          return "0";

            }
            catch(Exception e) {
                return "Error-Insert : "+e.getMessage();
            }
        }
        return "Error-Insert : You have no Permission";
    }

}
