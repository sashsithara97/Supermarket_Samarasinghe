package com.samarasinghesuper.controller;


import com.samarasinghesuper.model.ItemStatus;
import com.samarasinghesuper.model.PaymentMethod;
import com.samarasinghesuper.repository.ItemStatusRepository;
import com.samarasinghesuper.repository.PaymentMethodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping(value = "/paymentmethod")
@RestController()
public class PaymentMethodController {

    @Autowired
    private PaymentMethodRepository dao;

    @RequestMapping(value = "/list", method = RequestMethod.GET, produces = "application/json")
    public List<PaymentMethod> paymentmethods() {
        return dao.findAll();
    }

}
