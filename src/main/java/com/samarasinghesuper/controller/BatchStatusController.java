package com.samarasinghesuper.controller;


import com.samarasinghesuper.model.BatchStatus;
import com.samarasinghesuper.model.Brand;
import com.samarasinghesuper.model.Category;
import com.samarasinghesuper.repository.BatchStatusRepository;
import com.samarasinghesuper.repository.BrandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping(value = "/batchstatus")
@RestController()
public class BatchStatusController {

    @Autowired
    private BatchStatusRepository dao;

    @RequestMapping(value = "/list", method = RequestMethod.GET, produces = "application/json")
    public List<BatchStatus> batchstatuses() {
        return dao.findAll();
    }

}
