package com.samarasinghesuper.repository;


import com.samarasinghesuper.model.Gender;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface GenderRepository extends JpaRepository<Gender, Integer>
{

    @Query(value="SELECT new Gender(g.id,g.name) FROM Gender g")
    List<Gender> list();



}