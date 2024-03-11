package com.samarasinghesuper.controller;


import com.samarasinghesuper.model.ItemStatus;
import com.samarasinghesuper.model.Qrstatus;
import com.samarasinghesuper.repository.ItemStatusRepository;
import com.samarasinghesuper.repository.QrStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping(value = "/qrstatus")
@RestController()
public class QrStatusController {

    @Autowired
    private QrStatusRepository dao;

    @RequestMapping(value = "/list", method = RequestMethod.GET, produces = "application/json")
    public List<Qrstatus> qrstatuses() {
        return dao.findAll();
    }


}
