package com.samarasinghesuper.controller;


import com.samarasinghesuper.model.GRNStatus;
import com.samarasinghesuper.model.UnitType;
import com.samarasinghesuper.repository.GRNStatusRepository;
import com.samarasinghesuper.repository.UnittypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping(value = "/grnstatus")
@RestController()
public class GRNStatusController {

    @Autowired
    private GRNStatusRepository dao;

    @RequestMapping(value = "/list", method = RequestMethod.GET, produces = "application/json")
    public List<GRNStatus> grnstatuses() {
        return dao.findAll();
    }


}
