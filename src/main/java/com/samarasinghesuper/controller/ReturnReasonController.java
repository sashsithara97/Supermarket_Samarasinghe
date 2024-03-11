package com.samarasinghesuper.controller;


import com.samarasinghesuper.model.BatchStatus;
import com.samarasinghesuper.model.ReturnReason;
import com.samarasinghesuper.repository.BatchStatusRepository;
import com.samarasinghesuper.repository.ReturnReasonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping(value = "/returnreasion")
@RestController()
public class ReturnReasonController {

    @Autowired
    private ReturnReasonRepository dao;

    @RequestMapping(value = "/list", method = RequestMethod.GET, produces = "application/json")
    public List<ReturnReason> returnreasons() {
        return dao.findAll();
    }

}
