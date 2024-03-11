package com.samarasinghesuper.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChangePassword {
    private String currentPassword;
    private String newPassword;
    private String username;
    private String email;
    private String hint;
    private Boolean timeout;

}
