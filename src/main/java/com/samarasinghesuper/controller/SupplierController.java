package com.samarasinghesuper.controller;


import com.samarasinghesuper.model.Porder;
import com.samarasinghesuper.model.Supplier;
import com.samarasinghesuper.model.SupplierItem;
import com.samarasinghesuper.model.User;
import com.samarasinghesuper.repository.SupplierRepository;
import com.samarasinghesuper.repository.SupplierStatusRepository;
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
@RequestMapping(value = "/supplier")
@RestController
public class SupplierController {


    @Autowired
    private SupplierRepository dao;

    @Autowired
    private UserService userService;

    @Autowired
    private PrevilageController previlageController;


    @Autowired
    private SupplierStatusRepository daoSupplierStatus;

/*
    */
/*  /supplier/ariaseamountListbsupplier?supplierid=1*//*

    @GetMapping(value = "/ariaseamountListbsupplier",params = {"supplierid"}, produces = "application/json")
    public Supplier ariaseamountListBySupplier(@RequestParam("supplierid") int supplierid) {
        return dao.ariaseamountListBySupplier(supplierid);

    }
*/

       @GetMapping(value = "/nextnumber", produces = "application/json")
    public Supplier nextNumber() {
        String nextnumber = dao.getNextRegNumber();
        Supplier sup = new Supplier();
        if(nextnumber != ""){
            sup.setRegnumber(nextnumber);
        }else {
            sup.setRegnumber("SSS0001");
        }

        return sup;

    }

//All Supplier list
    @GetMapping(value = "/list", produces = "application/json")
    public List<Supplier> list() {
        return dao.list();
    }

    //Supplier list by status
    @GetMapping(value = "/listbysupplierstatus", produces = "application/json")
    public List<Supplier> listbysupplierstatus() {
        return dao.listbysupplierstatus();
    }

    // Find aLL serverice for get All
    @GetMapping(value = "/findAll", params = {"page", "size"}, produces = "application/json")
    public Page<Supplier> findAll(@RequestParam("page") int page, @RequestParam("size") int size) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"SUPPLIER");
        if(user!= null && priv.get("select"))
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC,"id"));
        else
            return null;
    }

    // Find aLL serverice for get All with serch value
    @GetMapping(value = "/findAll",params = {"page", "size","searchtext"}, produces = "application/json")
    public Page<Supplier> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"SUPPLIER");
        if(user!= null && priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC,"id"));
        }
        return null;
    }


    @PostMapping()
    public String add(@Validated @RequestBody Supplier supplier) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"SUPPLIER");
        if(user!= null && priv.get("add")) {
            Supplier supreg = dao.getByRegNumber(supplier.getRegnumber());
            Supplier supland = dao.getByCompanyLand(supplier.getCompanyland());
            if (supreg != null)
                return "Error-Validation : Reg Number Exists";
            else if (supland != null)
                return "Error-Validation : Land Number Exists";
            else
                try {
                    for (SupplierItem sb : supplier.getSupplierItemList())
                        sb.setSupplier_id(supplier);

                    dao.save(supplier);
                 //  emailService.sendMail("harithapramodha@gmail.com","Registor Supplier","Supplier Registration Success Fully...!\n\n Thank You to join with us.. \n\n from : Sudu buthaya");
                    return "0";
                } catch (Exception e) {
                    return "Error-Saving : " + e.getMessage();
                }
       }
        return "Error-Saving : You have no Permission";

    }

    @PutMapping()
    public String update(@Validated @RequestBody Supplier supplier) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"SUPPLIER");
        if(user!= null && priv.get("update")){
            Supplier sup = dao.getByRegNumber(supplier.getRegnumber());
        if(sup==null || sup.getId()==supplier.getId()) {
            try {

                for (SupplierItem sb : supplier.getSupplierItemList())
                    sb.setSupplier_id(supplier);

                dao.save(supplier);
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
    public String delete(@RequestBody Supplier supplier ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"SUPPLIER");
        if(user!= null && priv.get("delete")){
            try {
             //   dao.delete(dao.getOne(supplier.getId()));
                supplier.setSupplierstatus_id(daoSupplierStatus.getById(4));

                for (SupplierItem sb : supplier.getSupplierItemList())
                    sb.setSupplier_id(supplier);

                dao.save(supplier);
            return "0";
        }
        catch(Exception e) {
            return "Error-Deleting : "+e.getMessage();
        }
    }
        return "Error-Deleting : You have no Permission";

    }



}
