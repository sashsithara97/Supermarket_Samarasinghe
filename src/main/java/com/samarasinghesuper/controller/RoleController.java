package com.samarasinghesuper.controller;


import com.samarasinghesuper.model.Role;
import com.samarasinghesuper.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping(value = "/role")
@RestController
public class RoleController {

    @Autowired
    private RoleRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Role> gender() {
        return dao.list();
    }


}
