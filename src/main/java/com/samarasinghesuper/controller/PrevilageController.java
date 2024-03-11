package com.samarasinghesuper.controller;


import com.samarasinghesuper.model.Privilage;
import com.samarasinghesuper.model.User;
import com.samarasinghesuper.repository.ModuleRepository;
import com.samarasinghesuper.repository.PrivilageRepository;
import com.samarasinghesuper.repository.RoleRepository;
import com.samarasinghesuper.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.sql.ResultSet;
import java.util.HashMap;

@RequestMapping(value = "/privilage")
@RestController
public class PrevilageController {

    @Autowired
    private PrivilageRepository dao;

    @Autowired
    private PrivilageRepository daoprivilage;

    @Autowired
    private UserService userService;

    @Autowired
    private RoleRepository daoRole;

    @Autowired
    private ModuleRepository daoModule;


    @GetMapping(value = "/findAll", params = {"page", "size"}, produces = "application/json")
    public Page<Privilage> findAll(@RequestParam("page") int page, @RequestParam("size") int size) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = getPrivilages(user,"PRIVILAGE");
        if(user!= null && priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC,"id"));
        }else return null;
    }


    @GetMapping(value = "/findAll",params = {"page", "size","searchtext"}, produces = "application/json")
    public Page<Privilage> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = getPrivilages(user,"PRIVILAGE");
        if(user!= null && priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC,"id"));
        }
        return null;
    }





    @PostMapping
    public String add(@Validated @RequestBody Privilage privilage) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = getPrivilages(user,"PRIVILAGE");
        if(user!= null && priv.get("add")) {
            Privilage prirolemodule = dao.findByRoleModule(privilage.getRoleId(), privilage.getModuleId());
            if (prirolemodule != null)
                return "Error-Validation : Privilage Exists";
            else {
                try {
                    dao.save(privilage);
                    return "0";
                } catch (Exception e) {
                    return "Error-Saving : " + e.getMessage();
                }
            }
        }
        else
            return "Error-Saving : You have no Permission";


    }



    @PutMapping
    public String update(@Validated @RequestBody Privilage privilage) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = getPrivilages(user,"PRIVILAGE");
        if(user!= null && priv.get("update")) {
        Privilage prirolemodule = dao.findByRoleModule(privilage.getRoleId(),privilage.getModuleId());
        if(prirolemodule==null)
            return "Error-Validation : Privilage Does Not Exists";
        else {
            try {
                dao.save(privilage);
                return "0";
            } catch (Exception e) {
                return "Error-Updating : " + e.getMessage();
            }
        }
        }
        else
            return "Error-Updating : You have no Permission";


        }



    @DeleteMapping
    public String delete(@RequestBody Privilage privilage ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = getPrivilages(user,"PRIVILAGE");
        if(user!= null && priv.get("delete")) {
            try {
               // dao.delete(dao.getOne(privilage.getId()));
                privilage.setSel(0);
                privilage.setIns(0);
                privilage.setUpd(0);
                privilage.setDel(0);
                dao.save(privilage);
                return "0";
            } catch (Exception e) {
                return "Error-Deleting : " + e.getMessage();
            }

        } else
            return "Error-Deleting : You have no Permission";

    }



    @GetMapping(params = {"module"}, produces = "application/json")
    public HashMap<String,Boolean> getModulePrivilage(@RequestParam("module") String module) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            return getPrivilages(user,module);
        }
        else {
            return  null;
        }
    }

    public HashMap<String,Boolean> getPrivilages(User user, String module) {
        if (user.getUserName().equals("Admin")) {
            HashMap<String, Boolean> adminprivilages = new HashMap();
            adminprivilages.put("add", true);
            adminprivilages.put("update", true);
            adminprivilages.put("delete", true);
            adminprivilages.put("select", true);
            return adminprivilages;
        } else {

            try {
                String rs2 = daoprivilage.findByUserModle(user.getUserName() , module);
                String[] priv = rs2.split(",");

                HashMap<String, Boolean> privilages = new HashMap();
                privilages.put("select", priv[0].equals("1"));
                privilages.put("add", priv[1].equals("1"));
                privilages.put("update", priv[2].equals("1"));
                privilages.put("delete", priv[3].equals("1"));

                return privilages;
            } catch (Exception ex) {
                System.out.println(ex.getMessage());
                return null;
            }
        }
    }


}
