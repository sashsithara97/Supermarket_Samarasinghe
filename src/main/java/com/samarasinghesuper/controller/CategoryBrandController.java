package com.samarasinghesuper.controller;


import com.samarasinghesuper.model.Category;
import com.samarasinghesuper.model.CategoryBrand;
import com.samarasinghesuper.model.Quotation;
import com.samarasinghesuper.repository.CategoryBrandRepository;
import com.samarasinghesuper.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping(value = "/categorybrand")
@RestController()
public class CategoryBrandController {

    @Autowired
    private CategoryBrandRepository dao;

    //get mapping services for get active quotation list by given supplier [categorybrand/listbycategory?categoryid=1]
    @GetMapping(value = "/brandlistbycategory",params = {"categoryid"}, produces = "application/json")
    public List<CategoryBrand> listByCategory(@RequestParam("categoryid") int categoryid) {
        return dao.listByCategory(categoryid);
    }
}
