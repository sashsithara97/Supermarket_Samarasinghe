package com.samarasinghesuper.repository;


import com.samarasinghesuper.model.Employee;
import com.samarasinghesuper.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    User findByEmail(String email);
    User findByUserName(String userName);

    @Query("SELECT u FROM User u WHERE u.email= :email and u.hint=:hint")
    User findUserByEmailandcode(@Param("email") String email, @Param("hint") String hint);

    @Query("SELECT u FROM User u where (u.userName like concat('%',:searchtext,'%') or trim(u.active)= :searchtext ) and u.userName<>'Admin'")
    Page<User> findAll(@Param("searchtext") String searchtext , Pageable of);

    @Query("SELECT u FROM User u where u.userName<>'Admin'")
    Page<User> findAll(Pageable of);

    @Query("SELECT new User(u.id, u.userName, u.employeeId) FROM User u WHERE u.userName= :username")
    User findByLoggedName(@Param("username") String username);

    @Query("SELECT u FROM User u WHERE u.employeeId= :employee")
    User findByEmployee(@Param("employee")Employee employee);


    @Query(value="SELECT new User(u.id,u.userName) FROM User u ")
    List<User> list();

    @Query(value="SELECT new User(u.id,u.userName) FROM User u where u.userName='admin'")
    User getAdmin();

    @Query(value="SELECT u FROM User u where u.employeeId.id=:empid")
    User getByEmploye(@Param("empid") Integer empid);
}
