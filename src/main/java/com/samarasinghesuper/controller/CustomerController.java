package com.samarasinghesuper.controller;

import com.samarasinghesuper.model.*;
import com.samarasinghesuper.repository.CustomerRepository;
import com.samarasinghesuper.repository.CustomerstatusRepository;
import com.samarasinghesuper.repository.ItemRepository;
import com.samarasinghesuper.repository.ItemStatusRepository;
import com.samarasinghesuper.service.EmailService;
import com.samarasinghesuper.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping( value = "/customer")
public class CustomerController {

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private CustomerRepository dao;


    @Autowired
    private PrevilageController previlageController;


    @Autowired
    private CustomerstatusRepository daoStatus;

    //gET cUSTOMER list byn name
    @GetMapping(value = "/list", produces = "application/json")
    public List<Customer> list() {
        return dao.list();
    }

    @GetMapping(value = "/nextnumber", produces = "application/json")
    public Customer getNextCustomerNumber() {
        String nextnumber = dao.getNextCustomerNumber();
        Customer cus = new Customer();
        if (nextnumber != "") {
            cus.setRegno(nextnumber);
        } else {
            cus.setRegno("SSC00001");
        }

        return cus;

    }

    // Find aLL serverice for get All
    @GetMapping(value = "/findAll", params = {"page", "size"}, produces = "application/json")
    public Page<Customer> findAll(@RequestParam("page") int page, @RequestParam("size") int size) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());

        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"CUSTOMER");

        if(user!= null && priv.get("select"))
            return dao.findAll(PageRequest.of(page, size , Sort.Direction.DESC,"id"));
        else
            return null;
    }


  // Find aLL serverice for get All with serch value
    @GetMapping(value = "/findAll",params = {"page", "size","searchtext"}, produces = "application/json")
    public Page<Customer> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"CUSTOMER");
        if(user!= null && priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size,Sort.Direction.DESC,"id"));
        }
        return null;
    }


    // Delete Mapping for Delete Customer object
    @DeleteMapping()
    public String delete(@RequestBody Customer customer ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"CUSTOMER");
        if(user!= null && priv.get("delete")){
            try {
                //   dao.delete(dao.getOne(item.getId()));
                customer.setCustomerstatus_id(daoStatus.getById(3));
                dao.save(customer);
                emailService.sendMail(customer.getEmail(),"Registered Customer ",
                        "Hi " + customer.getContactname() + "Welcome to Samarasinghe Super..!\n\n Your Account Has been suspended \n\n from : Samarasinghe Supermarket");
                              return "0";
            }
            catch(Exception c) {
                return "Error-Deleting : "+c.getMessage();
            }
        }
        return "Error-Deleting : You have no Permission";

    }

    @PostMapping
    public String insert(@RequestBody Customer customer){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"CUSTOMER");
        if(user!= null && priv.get("add")){
            try {
                Customer exregnumber = dao.getByRegno(customer.getRegno());
                if(exregnumber != null)
                    return "Error-Saving : Customer Code alReady Exist...!";

                Customer exnic = dao.getByNic(customer.getNic());
                if(exnic != null)
                    return "Error-Saving : NIC Already Exist...!";

                dao.save(customer);
                emailService.sendMail(customer.getEmail(),"Registered Customer ",
                        "Hi " + customer.getContactname() + "Welcome to Samarasinghe Super..!\n\n Thank You for join with us.. \n\n from : Samarasinghe Supermarket");

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
    public String update(@RequestBody Customer customer){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"CUSTOMER");
        if(user!= null && priv.get("update")){
            try {
                Customer extcustomer = dao.getById(customer.getId());
                if(extcustomer == null)
                    return "Error-Updating : Customer Not Exists...!";


                dao.save(customer);

                return "0";
            }
            catch(Exception e) {
                return "Error-Updating : "+e.getMessage();
            }
        }
        return "Error-Updating : You have no Permission";
    }



}
