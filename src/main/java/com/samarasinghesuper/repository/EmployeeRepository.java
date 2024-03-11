package com.samarasinghesuper.repository;

import com.samarasinghesuper.model.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

    @Query(value="SELECT * FROM Employee e where e.callingname = ?1", nativeQuery=true)
    List<Employee> lists(String caname);


  @Query(value="SELECT new Employee(e.id,e.callingname) FROM Employee e")
  List<Employee> list();

    @Query(value = "SELECT max(e.number) FROM Employee e")
    String getNextNumber();

    @Query(value="SELECT new Employee(e.id,e.callingname) FROM Employee e WHERE e not in (Select u.employeeId from User u)")
    List<Employee> listWithoutUsers();

    @Query(value="SELECT new Employee(e.id,e.callingname) FROM Employee e WHERE e in (Select u.employeeId from User u)")
    List<Employee> listWithUseraccount();

    @Query("SELECT e FROM Employee e where e.callingname <> 'Admin' ORDER BY e.id DESC")
    Page<Employee> findAll(Pageable of);

    @Query("SELECT e FROM Employee e where (e.callingname like concat('%',:searchtext,'%')) and e.callingname<>'Admin' ORDER BY e.id DESC")
    Page<Employee> findAll(@Param("searchtext") String searchtext , Pageable of);

   @Query("SELECT e FROM Employee e WHERE e.nic= :nic")
    Employee findByNIC(@Param("nic") String nic);

    @Query("SELECT e FROM Employee e WHERE e.number= :number")
    Employee findByNumber(@Param("number") String number);


}
