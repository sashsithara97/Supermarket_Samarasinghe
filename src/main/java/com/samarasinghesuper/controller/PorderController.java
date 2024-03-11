package com.samarasinghesuper.controller;


import com.samarasinghesuper.model.*;
import com.samarasinghesuper.repository.GRNRepository;
import com.samarasinghesuper.repository.PorderRepository;
import com.samarasinghesuper.repository.PorderStatusRepository;
import com.samarasinghesuper.repository.SupplierRepository;
import com.samarasinghesuper.service.EmailService;
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
@RequestMapping(value = "/porder")
@RestController
public class PorderController {


    @Autowired
    private PorderRepository dao;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private PorderStatusRepository daoPorderStatus;

    @Autowired
    private SupplierRepository daoSupplier;

    @GetMapping(value = "/nextnumber", produces = "application/json")
    public Porder getNextPorderNumber() {
        String nextnumber = dao.getNextPorderNumber();
        Porder po = new Porder();
        if(nextnumber != ""){
            po.setPordercode(nextnumber);
        }else {
            po.setPordercode("SSPO00001");
        }

        return po;

    }

//get All porder codes
    @GetMapping(value = "/list", produces = "application/json")
    public List<Porder> list() {
        return dao.list();
    }


    /*  /porder/porderlistbysupplier?supplierid=1*/
    @GetMapping(value = "/porderlistbysupplier",params = {"supplierid"}, produces = "application/json")
    public List<Porder> porderListBySupplier(@RequestParam("supplierid") int supplierid) {
        return dao.porderListBySupplier(supplierid);

    }
    //Get Total amount of porders of a given suppliers
    ///porder/pordertotal?supplierid=1
    @GetMapping(value = "/pordertotal",params = {"supplierid"}, produces = "application/json")
    public Porder porderTotalAmountBySupplier(@RequestParam("supplierid") int supplierid) {
        return dao.porderTotalAmountBySupplier(supplierid);
    }


    // Find aLL serverice for get All
    @GetMapping(value = "/findAll", params = {"page", "size"}, produces = "application/json")
    public Page<Porder> findAll(@RequestParam("page") int page, @RequestParam("size") int size) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"PORDER");
        if(user!= null && priv.get("select"))
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC,"id"));
        else
            return null;
    }

    // Find aLL serverice for get All with serch value
    @GetMapping(value = "/findAll",params = {"page", "size","searchtext"}, produces = "application/json")
    public Page<Porder> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"PORDER");
        if(user!= null && priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC,"id"));
        }
        return null;
    }


    @PostMapping()
    public String add(@Validated @RequestBody Porder porder) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"PORDER");
        if(user!= null && priv.get("add")) {
            Porder pocode = dao.getByPONumber(porder.getPordercode());
            if (pocode != null)
                return "Error-Validation : PO Code Exists";
            else
                try {

                    StringBuffer message = new StringBuffer("No \t\t\t" + "Item Name \t\t\t\t" + "Quantity \n");
                    int i = 1;
                    for (PorderItem pi : porder.getPorderItemList()){
                        pi.setPorder_id(porder);

                            message.append(i).append("\t\t")
                                    .append(pi.getItem_id().getItemname()).append("\t\t\t")
                                    .append(pi.getQty()).append("\t\t\t")
                                    .append("\n");

                            i++;

                    }
                    System.out.println(message);
                    dao.save(porder);

                    Supplier sup = daoSupplier.getById(porder.getQuotation_id().getQuotationrequest_id().getSupplier_id().getId());

                 emailService.sendMail(sup.getEmail(),"Please Send Following Items","Porder Code : "+ porder.getPordercode()+"\n Item details \n\n" + message +
                        "Thank you \n\n\n Samarasinghe Super" );
                    return "0";

                } catch (Exception e) {
                    return "Error-Saving : " + e.getMessage();
                }
       }
        return "Error-Saving : You have no Permission";

    }



    @PutMapping()
    public String update(@Validated @RequestBody Porder porder) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"PORDER");
        if(user!= null && priv.get("update")){
            Porder po = dao.getByPONumber(porder.getPordercode());
        if(po==null || po.getId()==porder.getId()) {
            try {
                for (PorderItem pi : porder.getPorderItemList())
                    pi.setPorder_id(porder);

                dao.save(porder);
                return "0";
            }
            catch(Exception e) {
                return "Error-Updating : "+e.getMessage();
            }
        }
        else {  return "Error-Updating :Po Code Exists"; }
        }
        return "Error-Updating : You have no Permission";
    }

    @Transactional
    @DeleteMapping()
    public String delete(@RequestBody Porder porder ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"PORDER");
        if(user!= null && priv.get("delete")){
            try {
             //   dao.delete(dao.getOne(supplier.getId()));
                porder.setPorderstatus_id(daoPorderStatus.getById(6));

                for (PorderItem pi : porder.getPorderItemList())
                    pi.setPorder_id(porder);

                dao.save(porder);
            return "0";
        }
        catch(Exception e) {
            return "Error-Deleting : "+e.getMessage();
        }
    }
        return "Error-Deleting : You have no Permission";

    }



}
