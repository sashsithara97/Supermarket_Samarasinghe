package com.samarasinghesuper.controller;


import com.fasterxml.jackson.annotation.JsonInclude;
import com.samarasinghesuper.model.Item;
import com.samarasinghesuper.model.Subcategory;
import com.samarasinghesuper.model.Supplier;
import com.samarasinghesuper.model.User;
import com.samarasinghesuper.repository.ReportRepository;
import com.samarasinghesuper.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/report")

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReportController {

    @Autowired
    private UserService userService;

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private ReportRepository dao;

    //Supplier Arriease
    @RequestMapping(value = "/supplierariease", method = RequestMethod.GET, produces = "application/json")
    public List<Supplier> supplierArieaseList() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "REPORT");
        if (user != null && priv.get("select"))
            return dao.supplierArrieaseList();
        else
            return null;

    }

    //Expencses Report by given startdate and end date with type [/expencesreport?sdate=2022-05-01&edate=2022-06-20&type=Monthly]
    @GetMapping(value = "/expencesreport", params = {"sdate", "edate", "type"}, produces = "application/json")
    public List expencesReport(@RequestParam("sdate") String sdate, @RequestParam("edate") String edate, @RequestParam("type") String type) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "REPORT");
        if (user != null && priv.get("select")) {

            if (type.equals("Weekly")) {
                return dao.weeklyExpences(sdate, edate);
            } else if (type.equals("Monthly")) {
                return dao.monthlyExpences(sdate, edate);
            } else if (type.equals("Daily")) {
                return dao.DailyExpences(sdate, edate);

            }

        }
        return null;

    }

    //Expencses Report by given startdate and end date with type [/expencesreport?sdate=2022-05-01&edate=2022-06-20&type=Monthly]
    @GetMapping(value = "/incomereport", params = {"sdate", "edate", "type"}, produces = "application/json")
    public List incomeReport(@RequestParam("sdate") String sdate, @RequestParam("edate") String edate, @RequestParam("type") String type) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "REPORT");
        if (user != null && priv.get("select")) {

            if (type.equals("Weekly")) {

                    return dao.WeeklyIncome(sdate, edate);
                } else if (type.equals("Monthly")) {
                    return dao.MonthlyIncome(sdate, edate);
                } else if (type.equals("Daily")) {
                    return dao.DailyIncome(sdate, edate);

                }
            }
        return null;
        }





    @RequestMapping(value = "/nearexpireitem", method = RequestMethod.GET, produces = "application/json")
    public List getNearExpireItem() {
        return dao.getNearExpireItem();

    }

}
