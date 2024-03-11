package com.samarasinghesuper.controller;


import com.samarasinghesuper.model.GRNType;
import com.samarasinghesuper.model.UnitType;
import com.samarasinghesuper.repository.GrntypeRepository;
import com.samarasinghesuper.repository.UnittypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping(value = "/grntype")
@RestController()
public class GrntypeController {

    @Autowired
    private GrntypeRepository dao;

    @RequestMapping(value = "/list", method = RequestMethod.GET, produces = "application/json")
    public List<GRNType> grntypes() {
        return dao.findAll();
    }


}
