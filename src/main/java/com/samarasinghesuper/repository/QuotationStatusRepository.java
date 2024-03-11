package com.samarasinghesuper.repository;


import com.samarasinghesuper.model.ItemStatus;
import com.samarasinghesuper.model.QuotationStatus;
import org.springframework.data.jpa.repository.JpaRepository;


public interface QuotationStatusRepository extends JpaRepository<QuotationStatus, Integer>
{

}