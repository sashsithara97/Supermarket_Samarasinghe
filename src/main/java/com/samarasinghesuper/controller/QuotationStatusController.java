package com.samarasinghesuper.controller;


import com.samarasinghesuper.model.ItemStatus;
import com.samarasinghesuper.model.QuotationStatus;
import com.samarasinghesuper.repository.ItemStatusRepository;
import com.samarasinghesuper.repository.QuotationStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping(value = "/quotationstatus")
@RestController()
public class QuotationStatusController {

    @Autowired
    private QuotationStatusRepository dao;

    @RequestMapping(value = "/list", method = RequestMethod.GET, produces = "application/json")
    public List<QuotationStatus> quotationstatuses() {
        return dao.findAll();
    }


}
