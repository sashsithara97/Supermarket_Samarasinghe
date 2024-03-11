package com.samarasinghesuper.controller;

import com.samarasinghesuper.model.User;
import com.samarasinghesuper.repository.PrivilageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.HashMap;

@Controller
public class AuthController {

    static Connection connection;
    @Autowired
    private PrivilageRepository daoprivlage;

/*
    public HashMap<String,Boolean> getPrivilages(User user, String module) {
        System.out.println("11111111111111111111");
        if (user.getUserName().equals("Admin")) {
            HashMap<String, Boolean> adminprivilages = new HashMap();
            adminprivilages.put("add", true);
            adminprivilages.put("update", true);
            adminprivilages.put("delete", true);
            adminprivilages.put("select", true);
            System.out.println(adminprivilages);
            System.out.println("789456");
            return adminprivilages;
        } else {

           try {
              //   setConnection();
                Statement st = connection.createStatement();
              //  String query2 = "select  bit_or(sel) sel, bit_or(ins) ins, bit_or(upd) upd, bit_or(del) del from privilage where roles_role_id in (select role_id from user_role where user_id=(select user_id from users where user_name='" + user.getUserName() + "')) and module_id=(select id from module where name='" + module + "')";
                ResultSet rs2 = daoprivlage.findByUserModle(user.getUserName() , module);
                rs2.next();
                HashMap<String, Boolean> privilages = new HashMap();
                System.out.println(rs2.getBoolean("ins"));
                privilages.put("add", rs2.getBoolean("ins"));
                privilages.put("update", rs2.getBoolean("upd"));
                privilages.put("delete", rs2.getBoolean("del"));
                privilages.put("select", rs2.getBoolean("sel"));
                System.out.println(privilages);
                System.out.println("1564561");
                return null;
            } catch (Exception ex) {
                System.out.println(ex.getMessage());
                return null;
            }

        }

    }*/

   /* public static void setConnection() throws Exception{
        if (connection == null) {
            Class.forName("com.mysql.jdbc.Driver").newInstance();
            connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/bit", "root", "1234");
        }

    }*/


}
