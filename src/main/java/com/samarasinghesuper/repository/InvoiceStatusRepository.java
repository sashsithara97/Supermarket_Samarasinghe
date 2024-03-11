package com.samarasinghesuper.repository;


import com.samarasinghesuper.model.BatchStatus;
import com.samarasinghesuper.model.InvoiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;


public interface InvoiceStatusRepository extends JpaRepository<InvoiceStatus, Integer>
{


}