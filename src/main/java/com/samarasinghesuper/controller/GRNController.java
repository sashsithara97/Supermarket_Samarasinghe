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
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;

import static org.aspectj.runtime.internal.Conversions.intValue;

@EnableAsync
@RequestMapping(value = "/grn")
@RestController
public class GRNController {


    @Autowired
    private GRNRepository dao;

    @Autowired
    private UserService userService;

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private GRNStatusRepository daoGrnStatus;

    @Autowired
    private BatchRepository daoBatch;

    @Autowired
    private BatchStatusRepository daoBatchStatus;

    @Autowired
    private PorderRepository daoPorder;

    @Autowired
    private PorderStatusRepository daoPorderStatus;

    @Autowired
    private SupplierReturnRepository daoSupplierReturn;

    @Autowired
    private SupplierReturnStatusRepository daoSupplierReturnStatus;

    //get mapping services for get pENDING grn by given supplier [/grn/grnbysupplier?supplierid=1]
    @GetMapping(value = "/grnlistbysupplier",params = {"supplierid"}, produces = "application/json")
    public List<GRN> grnListBySupplier(@RequestParam("supplierid") int supplierid) {
        return dao.grnListBySupplier(supplierid);
    }

    @GetMapping(value = "/nextnumber", produces = "application/json")
    public GRN getNextGRNNumber() {
        String nextnumber = dao.getNextGRNNumber();
        GRN gr = new GRN();
        if (nextnumber != "") {
            gr.setGrncode(nextnumber);
        } else {
            gr.setGrncode("SSGR00001");
        }

        return gr;

    }

    // Find aLL serverice for get All
    @GetMapping(value = "/findAll", params = {"page", "size"}, produces = "application/json")
    public Page<GRN> findAll(@RequestParam("page") int page, @RequestParam("size") int size) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "GRN");
        if (user != null && priv.get("select"))
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC,"id"));
        else
            return null;
    }

    // Find aLL serverice for get All with serch value
    @GetMapping(value = "/findAll", params = {"page", "size", "searchtext"}, produces = "application/json")
    public Page<GRN> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "GRN");
        if (user != null && priv.get("select")) {
            return dao.findAll(searchtext, PageRequest.of(page, size, Sort.Direction.DESC,"id"));
        }
        return null;
    }

    @Transactional
    @PostMapping()
    public String add(@Validated @RequestBody GRN grn) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "GRN");
        if (user != null && priv.get("add")) {
            GRN gcode = dao.getByGrncode(grn.getGrncode());
            if (gcode != null)
                return "Error-Validation : GRN Code Exists";
            else
                try {
                    //api grnBatch wala grnid eka json ignore danawane ekata id eka set karanawa
                    for (GrnBatch gb : grn.getGrnBatchList()) {
                        gb.setGrn_id(grn);

                        Batch receivedbatch = gb.getBatch_id();

                       /* System.out.println(gb);
                        System.out.println(receivedbatch);*/

                        //dena lada itemcode and batch ekata adala batch ekak denawada balanawa eka dao eke thiye nm eka ewanawa

                        Batch testbatch = daoBatch.getBatchByItemidAndBatchcode(receivedbatch.getItem_id().getId(), receivedbatch.getBatchcode());

                        //test batch not equal null kiyanne dena lada parameteres walata galapena batch ekak thiyenawa kiyana eka
                        //ethkota api e batch eka update karanawa nathi unoth aluth ekak hadala sav karaawa
                        if (testbatch != null) {

                            testbatch.setAvaqty(gb.getTotalrqty().add(testbatch.getAvaqty()));
                            testbatch.setTotalqty(gb.getTotalrqty().add(testbatch.getTotalqty()));

                            daoBatch.save(testbatch);
                            gb.setBatch_id(testbatch);

                        } else {

                            Batch newbatch = new Batch();
                            newbatch.setBatchcode(receivedbatch.getBatchcode());
                            newbatch.setItem_id(receivedbatch.getItem_id());
                            newbatch.setSalesprice(receivedbatch.getSalesprice());
                            newbatch.setPurchaseprice(receivedbatch.getPurchaseprice());


                            //Totalrqty kiyanne total received quantity ekata
                            newbatch.setAvaqty(gb.getTotalrqty());
                            newbatch.setTotalqty(gb.getTotalrqty());
                            newbatch.setReturnqty(BigDecimal.valueOf(0.00));

                            newbatch.setDiscount(receivedbatch.getDiscount());

                            newbatch.setExpdate(receivedbatch.getExpdate());
                            newbatch.setMfgdate(receivedbatch.getMfgdate());
                            newbatch.setBatchstatus_id(daoBatchStatus.getById(1));
                            newbatch.setSupplier_id(grn.getSupplier_id());
                            //id set karanna oni ne primary key auto icrement nisa
                            //save eken batch object ekak return wenaw
                            Batch savednewbatch = daoBatch.save(newbatch);
                            //hadapu batch eka save karanawa
                            gb.setBatch_id(savednewbatch);
                        }

                    }
                    dao.save(grn);
                    //emailService.sendMail("harithapramodha@gmail.com","Registor Supplier","Supplier Registration Success Fully...!\n\n Thank You to join with us.. \n\n from : Sudu buthaya");

                    if (grn.getPorder_id() != null) {

                        Porder receivedporder = daoPorder.getById(grn.getPorder_id().getId());
                        receivedporder.setPorderstatus_id(daoPorderStatus.getById(3));

                        for (PorderItem pi : receivedporder.getPorderItemList())
                            pi.setPorder_id(receivedporder);

                        daoPorder.save(receivedporder);

                    }

                    if (grn.getSupplierreturn_id() != null) {

                        SupplierReturn receivedsupplierreturn = daoSupplierReturn.getById(grn.getSupplierreturn_id().getId());
                        receivedsupplierreturn.setSrstatus_id(daoSupplierReturnStatus.getById(2));

                        for (SupplierReturnBatch sb : receivedsupplierreturn.getSupplierReturnBatchList())
                            sb.setSupplierreturn_id(receivedsupplierreturn);

                        daoSupplierReturn.save(receivedsupplierreturn);

                    }

                    return "0";
                } catch (Exception e) {
                    return "Error-Saving : " + e.getMessage();
                }
        }
        return "Error-Saving : You have no Permission";

    }


    @Transactional
    @DeleteMapping()
    public String delete(@RequestBody GRN grn) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "GRN");
        if (user != null && priv.get("delete")) {
            try {

                //   dao.delete(dao.getOne(supplier.getId()));
                grn.setGrnstatus_id(daoGrnStatus.getById(4));

                for (GrnBatch gb : grn.getGrnBatchList())
                    gb.setGrn_id(grn);

                dao.save(grn);
                return "0";
            } catch (Exception e) {
                return "Error-Deleting : " + e.getMessage();
            }
        }
        return "Error-Deleting : You have no Permission";

    }


}
