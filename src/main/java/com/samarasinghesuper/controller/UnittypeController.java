package com.samarasinghesuper.controller;


import com.samarasinghesuper.model.Brand;
import com.samarasinghesuper.model.UnitType;
import com.samarasinghesuper.repository.BrandRepository;
import com.samarasinghesuper.repository.UnittypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping(value = "/unittype")
@RestController()
public class UnittypeController {

    @Autowired
    private UnittypeRepository dao;

    @RequestMapping(value = "/list", method = RequestMethod.GET, produces = "application/json")
    public List<UnitType> unittypes() {
        return dao.findAll();
    }


}
