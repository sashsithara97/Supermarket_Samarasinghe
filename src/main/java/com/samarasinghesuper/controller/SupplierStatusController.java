package com.samarasinghesuper.controller;


import com.samarasinghesuper.model.ItemStatus;
import com.samarasinghesuper.model.SupplierStatus;
import com.samarasinghesuper.repository.ItemStatusRepository;
import com.samarasinghesuper.repository.SupplierStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping(value = "/supplierstatus")
@RestController()
public class SupplierStatusController {

    @Autowired
    private SupplierStatusRepository dao;

    @RequestMapping(value = "/list", method = RequestMethod.GET, produces = "application/json")
    public List<SupplierStatus> supplierstatuses() {
        return dao.findAll();
    }


}
