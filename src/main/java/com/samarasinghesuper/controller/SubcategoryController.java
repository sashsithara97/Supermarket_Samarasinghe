package com.samarasinghesuper.controller;


import com.samarasinghesuper.model.Brand;
import com.samarasinghesuper.model.Quotation;
import com.samarasinghesuper.model.Subcategory;
import com.samarasinghesuper.repository.BrandRepository;
import com.samarasinghesuper.repository.SubcategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping(value = "/subcategory")
@RestController()
public class SubcategoryController {

    @Autowired
    private SubcategoryRepository dao;

    @RequestMapping(value = "/list", method = RequestMethod.GET, produces = "application/json")
    public List<Subcategory> subcategories() {
        return dao.findAll();
    }

    //get mapping services for get Subcategories list by given supplier [/subcategory/listbysubcategory?categoryid=1]
    @GetMapping(value = "/listbysubcategory",params = {"categoryid"}, produces = "application/json")
    public List<Subcategory> SubcategorylistByCategory(@RequestParam("categoryid") int categoryid) {
        return dao.SubcategorylistByCategory(categoryid);
    }

}
