package com.samarasinghesuper.controller;

import com.samarasinghesuper.model.*;
import com.samarasinghesuper.repository.CategoryRepository;
import com.samarasinghesuper.repository.CustomerstatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RequestMapping(value = "/category")
@RestController()
public class CategoryController {

    @Autowired
    private CategoryRepository dao;

    @RequestMapping(value = "/list", method = RequestMethod.GET, produces = "application/json")
    public List<Category> categories() {

        return dao.findAll();
    }


    @PostMapping
    public String add(@RequestBody Category category){
        Category extcategory = dao.findByCategoryName(category.getName());

        if (extcategory != null)
        { return "Error-Validation : Category Name Exists";
        }else{
            try {

                dao.save(category);
                return "0";
            }catch (Exception ex){
                return "Insert Not Completed : " + ex.getMessage();
            }
        }

    }


}
