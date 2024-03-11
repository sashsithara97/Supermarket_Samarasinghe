package com.samarasinghesuper.controller;

import com.samarasinghesuper.model.Customer;
import com.samarasinghesuper.model.Customerpoint;
import com.samarasinghesuper.model.User;
import com.samarasinghesuper.repository.CustomerPointRepository;
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
@RequestMapping( value = "/customerpoint")
public class CustomerPointController {

    @Autowired
    private UserService userService;

    @Autowired
    private PrevilageController previlageController;


    @Autowired
    private CustomerPointRepository dao;

    @Autowired
    private CustomerstatusRepository daoStatus;

    // Find aLL serverice for get All
    @GetMapping(value = "/findAll", params = {"page", "size"}, produces = "application/json")
    public Page<Customerpoint> findAll(@RequestParam("page") int page, @RequestParam("size") int size) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());

        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"CUSTOMERPOINT");

        if(user!= null && priv.get("select"))
            return dao.findAll(PageRequest.of(page, size , Sort.Direction.DESC,"id"));
        else
            return null;
    }


  // Find aLL serverice for get All with serch value
    @GetMapping(value = "/findAll",params = {"page", "size","searchtext"}, produces = "application/json")
    public Page<Customerpoint> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"CUSTOMERPOINT");
        if(user!= null && priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size));
        }
        return null;
    }


   /* // Delete Mapping for Delete Customer object
    @DeleteMapping()
    public String delete(@RequestBody Customer customer ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"CUSTOMER");
        if(user!= null && priv.get("delete")){
            try {
                //   dao.delete(dao.getOne(item.getId()));
                customer.setCustomerstatus_id(daoStatus.getById(2));
                dao.save(customer);

                return "0";
            }
            catch(Exception c) {
                return "Error-Deleting : "+c.getMessage();
            }
        }
        return "Error-Deleting : You have no Permission";

    }*/

    @PostMapping
    public String insert(@RequestBody Customerpoint customerpoint){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"CUSTOMERPOINT");
        if(user!= null && priv.get("add")){
            try {
                Customerpoint extloyaltype = dao.getByLoyaltyType(customerpoint.getLoyaltytype());
                if(extloyaltype != null)
                    return "Error-Saving : Customer Loyal Type already Exist...!";

                dao.save(customerpoint);

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
    public String update(@RequestBody Customerpoint customerpoint){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"CUSTOMERPOINT");
        if(user!= null && priv.get("update")){
            try {
                Customerpoint extcustomerpoint = dao.getById(customerpoint.getId());
                if(extcustomerpoint == null)
                    return "Error-Updating : Customer Point Not Exist...!";

                dao.save(customerpoint);

                return "0";
            }
            catch(Exception e) {
                return "Error-Updating : "+e.getMessage();
            }
        }
        return "Error-Updating : You have no Permission";
    }



}
