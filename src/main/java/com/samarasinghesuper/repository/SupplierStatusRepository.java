package com.samarasinghesuper.repository;


import com.samarasinghesuper.model.ItemStatus;
import com.samarasinghesuper.model.SupplierStatus;
import org.springframework.data.jpa.repository.JpaRepository;


public interface SupplierStatusRepository extends JpaRepository<SupplierStatus, Integer>
{

}