package com.samarasinghesuper.controller;


import com.samarasinghesuper.model.CustomerOrder;
import com.samarasinghesuper.model.CustomerOrderStatus;
import com.samarasinghesuper.model.ItemStatus;
import com.samarasinghesuper.repository.CorderStatusRepository;
import com.samarasinghesuper.repository.ItemStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping(value = "/corderstatus")
@RestController()

public class CorderStatusController {
    

    @Autowired
    private CorderStatusRepository dao;

    @RequestMapping(value = "/list", method = RequestMethod.GET, produces = "application/json")
    public List<CustomerOrderStatus> corderstatuses() {
        return dao.findAll();
    }


}
