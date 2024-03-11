package com.samarasinghesuper.controller;


import com.samarasinghesuper.model.CustomerStatus;
import com.samarasinghesuper.model.ItemStatus;
import com.samarasinghesuper.repository.CustomerstatusRepository;
import com.samarasinghesuper.repository.ItemStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping(value = "/itemstatus")
@RestController()
public class ItemStatusController {

    @Autowired
    private ItemStatusRepository dao;

    @RequestMapping(value = "/list", method = RequestMethod.GET, produces = "application/json")
    public List<ItemStatus> itemstatuses() {
        return dao.findAll();
    }


}
