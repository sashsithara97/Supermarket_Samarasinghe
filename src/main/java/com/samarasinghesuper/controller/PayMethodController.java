package com.samarasinghesuper.controller;


import com.samarasinghesuper.model.BatchStatus;
import com.samarasinghesuper.model.InvoicePayMethod;
import com.samarasinghesuper.repository.BatchStatusRepository;
import com.samarasinghesuper.repository.InvoicePayMehthodRepository;
import com.samarasinghesuper.repository.PaymentMethodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping(value = "/paymethod")
@RestController()
public class PayMethodController {

    @Autowired
    private InvoicePayMehthodRepository dao;

    @RequestMapping(value = "/list", method = RequestMethod.GET, produces = "application/json")
    public List<InvoicePayMethod> invoicePayMethods() {
        return dao.findAll();
    }

}
