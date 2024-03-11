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
public class ReportUIController {

    @Autowired
    private UserService userService;

/*    @RequestMapping(value = "/reportemployee", method = RequestMethod.GET)
    public ModelAndView reportemployee() {

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("ui/reportemployee.html");
        return modelAndView;
    }*/

    @RequestMapping(value = "/expences",method = RequestMethod.GET)
    public ModelAndView expencesUI() {
        ModelAndView modelAndView = new ModelAndView();

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());

        if(user!= null){
            modelAndView.setViewName("/report/expences.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @RequestMapping(value = "/income",method = RequestMethod.GET)
    public ModelAndView incomeUI() {
        ModelAndView modelAndView = new ModelAndView();

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());

        if(user!= null){
            modelAndView.setViewName("/report/income.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }


    @RequestMapping(value = "/uisupplierarrease",method = RequestMethod.GET)
    public ModelAndView supplierArrieaseUI() {
        ModelAndView modelAndView = new ModelAndView();

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());

        if(user!= null){
            modelAndView.setViewName("/report/supplierarriease.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

}
