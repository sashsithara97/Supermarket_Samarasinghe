package com.samarasinghesuper.model;

import lombok.Data;

import java.time.LocalDate;

@Data
public class Config {

   private String number;
   private String fullname;
   private String address;
   private String mobile;
   private String username;
   private String password;
   private String email;
   private LocalDate regdate;


}
