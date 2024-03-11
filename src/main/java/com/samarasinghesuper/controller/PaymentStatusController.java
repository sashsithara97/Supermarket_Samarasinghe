package com.samarasinghesuper.controller;


import com.samarasinghesuper.model.ItemStatus;
import com.samarasinghesuper.model.PaymentStatus;
import com.samarasinghesuper.repository.ItemStatusRepository;
import com.samarasinghesuper.repository.PaymentStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping(value = "/paymentstatus")
@RestController()
public class PaymentStatusController {

    @Autowired
    private PaymentStatusRepository dao;

    @RequestMapping(value = "/list", method = RequestMethod.GET, produces = "application/json")
    public List<PaymentStatus> paymentStatuses() {
        return dao.findAll();
    }


}
