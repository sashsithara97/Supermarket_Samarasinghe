package com.samarasinghesuper.repository;


import com.samarasinghesuper.model.Brand;
import com.samarasinghesuper.model.Quotation;
import com.samarasinghesuper.model.Subcategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface SubcategoryRepository extends JpaRepository<Subcategory, Integer>
{
    //get active quotation list by given supplier
    @Query("select sb from Subcategory sb where " +
            "sb.category_id.id=:categoryid")
    List<Subcategory> SubcategorylistByCategory(@Param("categoryid") Integer categoryid);

}