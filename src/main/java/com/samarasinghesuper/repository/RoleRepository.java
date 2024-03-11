package com.samarasinghesuper.repository;


import com.samarasinghesuper.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    Role findByRole(String role);

    @Query(value="SELECT new Role(r.id,r.role) FROM Role r where r.role<> 'ADMIN'")
    List<Role> list();
}