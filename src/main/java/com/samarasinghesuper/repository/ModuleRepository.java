package com.samarasinghesuper.repository;

import com.samarasinghesuper.model.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ModuleRepository extends JpaRepository<Module, Integer> {

    @Query(value="SELECT new Module(m.id,m.name) FROM Module m WHERE m NOT IN (SELECT p.moduleId FROM Privilage p WHERE p.roleId.id= :roleid)")
    List<Module> listUnassignedToThisRole(@Param("roleid") Integer roleid);

    @Query(value="SELECT new Module(m.id,m.name) FROM Module m")
    List<Module> list();
    @Query(value="SELECT new Module(m.id,m.name) FROM Module m where m in(select p.moduleId from Privilage p where p.sel=1 and p.roleId in(SELECT ur.roleId FROM UserRole ur where ur.userId.id=:userid))")
    List<Module> listbyuser(@Param("userid") Integer userid);

}
