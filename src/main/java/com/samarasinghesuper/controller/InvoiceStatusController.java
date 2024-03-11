package com.samarasinghesuper.controller;


import com.samarasinghesuper.model.BatchStatus;
import com.samarasinghesuper.model.InvoiceStatus;
import com.samarasinghesuper.repository.BatchStatusRepository;
import com.samarasinghesuper.repository.InvoiceStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping(value = "/invoicestatus")
@RestController()
public class InvoiceStatusController {

    @Autowired
    private InvoiceStatusRepository dao;

    @RequestMapping(value = "/list", method = RequestMethod.GET, produces = "application/json")
    public List<InvoiceStatus> invoicestatuses() {
        return dao.findAll();
    }

}
