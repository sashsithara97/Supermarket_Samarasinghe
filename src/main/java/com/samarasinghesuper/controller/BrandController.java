package com.samarasinghesuper.controller;


import com.samarasinghesuper.model.Brand;
import com.samarasinghesuper.model.Category;
import com.samarasinghesuper.model.CategoryBrand;
import com.samarasinghesuper.model.Quotation;
import com.samarasinghesuper.repository.BrandRepository;
import com.samarasinghesuper.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping(value = "/brand")
@RestController()
public class BrandController {

    @Autowired
    private BrandRepository dao;

    @RequestMapping(value = "/list", method = RequestMethod.GET, produces = "application/json")
    public List<Brand> brands() {
        return dao.findAll();
    }

    /*brand/listbycategory?categoryid=1*/
    @GetMapping(value = "/listbycategory",params = {"categoryid"}, produces = "application/json")
    public List<Brand> listByCategory(@RequestParam("categoryid") int categoryid) {
        return dao.listByCategory(categoryid);
    }

}
