package com.samarasinghesuper.repository;


import com.samarasinghesuper.model.Category;
import com.samarasinghesuper.model.CustomerStatus;
import com.samarasinghesuper.model.Employee;
import com.samarasinghesuper.model.Quotation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface CategoryRepository extends JpaRepository<Category, Integer>
{

    @Query("SELECT c FROM Category c WHERE c.name= :name")
    Category findByCategoryName(@Param("name") String name);
}