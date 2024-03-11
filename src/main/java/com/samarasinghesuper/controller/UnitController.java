package com.samarasinghesuper.controller;


import com.samarasinghesuper.model.Brand;
import com.samarasinghesuper.model.Unit;
import com.samarasinghesuper.repository.BrandRepository;
import com.samarasinghesuper.repository.UnitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;



@RequestMapping(value = "/unit") //
@RestController() //
public class UnitController {

    @Autowired //To create an instance using an interface
    private UnitRepository dao; //Create unit repository Instance

    @RequestMapping(value = "/list", method = RequestMethod.GET, produces = "application/json")
    public List<Unit> units() {
        return dao.findAll();
    }


}
