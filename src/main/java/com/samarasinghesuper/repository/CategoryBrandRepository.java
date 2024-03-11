package com.samarasinghesuper.repository;

import com.samarasinghesuper.model.CategoryBrand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface CategoryBrandRepository extends JpaRepository<CategoryBrand, Integer>
{
    //get active quotation list by given category
    @Query("select new CategoryBrand (cb.id,cb.brand_id) from CategoryBrand cb where " +
            "cb.category_id.id=:categoryid")
    List<CategoryBrand> listByCategory(@Param("categoryid") Integer categoryid);

}