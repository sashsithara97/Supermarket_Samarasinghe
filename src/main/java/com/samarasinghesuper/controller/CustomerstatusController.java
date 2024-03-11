package com.samarasinghesuper.controller;


import com.samarasinghesuper.model.CustomerStatus;
import com.samarasinghesuper.model.Employeestatus;
import com.samarasinghesuper.repository.CustomerstatusRepository;
import com.samarasinghesuper.repository.EmployeestatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping(value = "/customerStatus")
@RestController()
public class CustomerstatusController {

    @Autowired
    private CustomerstatusRepository dao;

    @RequestMapping(value = "/list", method = RequestMethod.GET, produces = "application/json")
    public List<CustomerStatus> customerStatuses() {
        return dao.findAll();
    }


}
