package com.samarasinghesuper.repository;


import com.samarasinghesuper.model.Brand;
import com.samarasinghesuper.model.Category;
import com.samarasinghesuper.model.CategoryBrand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface BrandRepository extends JpaRepository<Brand, Integer>
{


    //get brand list by given category
    @Query("select b from Brand b where b in (select bhc.brand_id from CategoryBrand bhc where bhc.category_id.id=:categoryid)")
    List<Brand> listByCategory(@Param("categoryid")Integer categoryid);

}