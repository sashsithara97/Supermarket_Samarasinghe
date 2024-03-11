package com.samarasinghesuper.controller;


import com.samarasinghesuper.model.ItemStatus;
import com.samarasinghesuper.model.PorderStatus;
import com.samarasinghesuper.repository.ItemStatusRepository;
import com.samarasinghesuper.repository.PorderStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping(value = "/porderstatus")
@RestController()
public class PorderStatusController {

    @Autowired
    private PorderStatusRepository dao;

    @RequestMapping(value = "/list", method = RequestMethod.GET, produces = "application/json")
    public List<PorderStatus> porderStatuses() {
        return dao.findAll();
    }


}
