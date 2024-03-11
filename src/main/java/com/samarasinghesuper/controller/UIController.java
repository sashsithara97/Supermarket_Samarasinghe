package com.samarasinghesuper.controller;

import com.samarasinghesuper.model.User;
import com.samarasinghesuper.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class UIController {

    @Autowired
    private UserService userService;

    @RequestMapping(value = "/access-denied", method = RequestMethod.GET)
    public ModelAndView error(){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("error.html");
        return modelAndView;
    }

    @RequestMapping(value = "/config", method = RequestMethod.GET)
    public ModelAndView config(){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("config.html");
        return modelAndView;
    }

    @GetMapping(value = {"/employee" })
    public ModelAndView employeeui() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            modelAndView.setViewName("employee.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @GetMapping(path = "/employee/{id}")
    public ModelAndView employeessui() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            modelAndView.setViewName("employee.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @GetMapping(value = "/privilage")
    public ModelAndView privilageui() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            modelAndView.setViewName("privilage.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }


    @RequestMapping(value = "/user", method = RequestMethod.GET)
    public ModelAndView user() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            modelAndView.setViewName("user.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @GetMapping(value = "/item")
    public ModelAndView itemUI() {
        ModelAndView modelAndView = new ModelAndView();

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());

        if(user!= null){
            modelAndView.setViewName("item.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }


    @GetMapping(value = "/customer")
    public ModelAndView customerUI() {
        ModelAndView modelAndView = new ModelAndView();

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());

        if(user!= null){
            modelAndView.setViewName("customer.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }


    @GetMapping(value = "/supplier")
    public ModelAndView supplierUI() {
        ModelAndView modelAndView = new ModelAndView();

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());

        if(user!= null){
            modelAndView.setViewName("supplier.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }


    @GetMapping(value = "/quotationrequest")
    public ModelAndView QRequestUI() {
        ModelAndView modelAndView = new ModelAndView();

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());

        if(user!= null){
            modelAndView.setViewName("quotationrequest.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }


    @GetMapping(value = "/quotation")
    public ModelAndView QuotationUI() {
        ModelAndView modelAndView = new ModelAndView();

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());

        if(user!= null){
            modelAndView.setViewName("quotation.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }


    @GetMapping(value = "/porder")
    public ModelAndView PorderUI() {
        ModelAndView modelAndView = new ModelAndView();

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());

        if(user!= null){
            modelAndView.setViewName("porder.html");
        }
        else
            modelAndView.setViewName("error.html");
        return modelAndView;

    }


    @GetMapping(value = "/corder")
    public ModelAndView CorderUI() {
        ModelAndView modelAndView = new ModelAndView();

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());

        if(user!= null){
            modelAndView.setViewName("corder.html");
        }
        else
            modelAndView.setViewName("error.html");
            return modelAndView;
    }

    @GetMapping(value = "/dashboard")
    public ModelAndView dashboardUI() {
        ModelAndView modelAndView = new ModelAndView();

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());

        if(user!= null){
            modelAndView.setViewName("mainwindowtest.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @GetMapping(value = {"/batch" })
    public ModelAndView batchUI() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            modelAndView.setViewName("batch.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @GetMapping(value = "/supplierreturn")
    public ModelAndView SupplierReturnUI() {
        ModelAndView modelAndView = new ModelAndView();

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());

        if(user!= null){
            modelAndView.setViewName("supplierreturn.html");
        }
        else
            modelAndView.setViewName("supplierreturn.html");
        return modelAndView;
    }

    @GetMapping(value = "/grn")
    public ModelAndView GRNUI() {
        ModelAndView modelAndView = new ModelAndView();

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());

        if(user!= null){
            modelAndView.setViewName("grn.html");
        }
        else
            modelAndView.setViewName("grn.html");
        return modelAndView;
    }

    @GetMapping(value = "/payment")
    public ModelAndView PaymentUI() {
        ModelAndView modelAndView = new ModelAndView();

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());

        if(user!= null){
            modelAndView.setViewName("payment.html");
        }
        else
            modelAndView.setViewName("payment.html");
        return modelAndView;
    }

    @GetMapping(value = "/invoice")
    public ModelAndView InvoicetUI() {
        ModelAndView modelAndView = new ModelAndView();

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());

        if(user!= null){
            modelAndView.setViewName("invoice.html");
        }
        else
            modelAndView.setViewName("invoice.html");
        return modelAndView;
    }

    @GetMapping(value = "/inventory")
    public ModelAndView InventorytUI() {
        ModelAndView modelAndView = new ModelAndView();

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());

        if(user!= null){
            modelAndView.setViewName("inventory.html");
        }
        else
            modelAndView.setViewName("inventory.html");
        return modelAndView;
    }

    @GetMapping(value = "/customerpoint")
    public ModelAndView CustomerPointUI() {
        ModelAndView modelAndView = new ModelAndView();

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());

        if(user!= null){
            modelAndView.setViewName("customerpoint.html");
        }
        else
            modelAndView.setViewName("customerpoint.html");
        return modelAndView;
    }




}





