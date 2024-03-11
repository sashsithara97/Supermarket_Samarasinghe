package com.samarasinghesuper.controller;


import com.samarasinghesuper.model.BatchStatus;
import com.samarasinghesuper.model.SupplierReturnStatus;
import com.samarasinghesuper.repository.BatchStatusRepository;
import com.samarasinghesuper.repository.SupplierReturnStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping(value = "/srstatus")
@RestController()
public class SupplierReturnStatusController {

    @Autowired
    private SupplierReturnStatusRepository dao;

    @RequestMapping(value = "/list", method = RequestMethod.GET, produces = "application/json")
    public List<SupplierReturnStatus> supplierreturnstatuses() {
        return dao.findAll();
    }

}
