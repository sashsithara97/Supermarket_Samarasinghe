package com.samarasinghesuper.controller;


import com.samarasinghesuper.model.*;
import com.samarasinghesuper.repository.CorderRepository;
import com.samarasinghesuper.repository.CorderStatusRepository;
import com.samarasinghesuper.repository.PorderRepository;
import com.samarasinghesuper.repository.PorderStatusRepository;
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
@RequestMapping(value = "/corder")
@RestController
public class CorderController {

    @Autowired
    private CorderRepository dao;

    @Autowired
    private UserService userService;

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private CorderStatusRepository daoCorderStatus;

    //get mapping for get available corders list by customer [/corder/listbycustomer?customerid=1]
    @GetMapping(value = "/listbycustomer",params = {"customerid"}, produces = "application/json")
    public List<CustomerOrder> listByCustomer(@RequestParam("customerid")int customerid) {
        return dao.listByCustomer(customerid);
    }


    @GetMapping(value = "/nextnumber", produces = "application/json")
    public CustomerOrder nextNumber() {
        String nextnumber = dao.getNextCorderNumber();
        CustomerOrder co = new CustomerOrder();
        if(nextnumber != ""){
            co.setCordercode(nextnumber);
        }else {
            co.setCordercode("SSCO0001");
        }

        return co;

    }

    @GetMapping(value = "/list", produces = "application/json")
    public List<CustomerOrder> list() {
        return dao.list();
    }

    @GetMapping(value = "/listbycorderstatus", produces = "application/json")
    public List<CustomerOrder> listByCorderStatus() {
        return dao.list();
    }

    // Find aLL serverice for get All
    @GetMapping(value = "/findAll", params = {"page", "size"}, produces = "application/json")
    public Page<CustomerOrder> findAll(@RequestParam("page") int page, @RequestParam("size") int size) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"CORDER");
        if(user!= null && priv.get("select"))
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC,"id"));
        else
            return null;
    }

    // Find aLL serverice for get All with serch value
    @GetMapping(value = "/findAll",params = {"page", "size","searchtext"}, produces = "application/json")
    public Page<CustomerOrder> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"CORDER");
        if(user!= null && priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC,"id"));
        }
        return null;
    }


    @PostMapping()
    public String add(@Validated @RequestBody CustomerOrder customerOrder) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"CORDER");
        if(user!= null && priv.get("add")) {
            CustomerOrder cocode = dao.getByCONumber(customerOrder.getCordercode());
            if (cocode != null)
                return "Error-Validation : Customer Order Code Exists";
            else
                try {
                    for (CorderItem ci : customerOrder.getCorderItemList())
                        ci.setCorder_id(customerOrder);

                    dao.save(customerOrder);
                 //  emailService.sendMail("harithapramodha@gmail.com","Registor Supplier","Supplier Registration Success Fully...!\n\n Thank You to join with us.. \n\n from : Sudu buthaya");
                    return "0";
                } catch (Exception e) {
                    return "Error-Saving : " + e.getMessage();
                }
       }
        return "Error-Saving : You have no Permission";

    }



    @PutMapping()
    public String update(@Validated @RequestBody CustomerOrder customerOrder) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"CORDER");
        if(user!= null && priv.get("update")){
            CustomerOrder co = dao.getByCONumber(customerOrder.getCordercode());
        if(co==null || co.getId()==customerOrder.getId()) {
            try {

                dao.save(customerOrder);
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
    public String delete(@RequestBody CustomerOrder customerOrder ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"CORDER");
        if(user!= null && priv.get("delete")){
            try {
             //   dao.delete(dao.getOne(supplier.getId()));
                customerOrder.setCorderstatus_id(daoCorderStatus.getById(6));

                dao.save(customerOrder);
            return "0";
        }
        catch(Exception e) {
            return "Error-Deleting : "+e.getMessage();
        }
    }
        return "Error-Deleting : You have no Permission";

    }



}
