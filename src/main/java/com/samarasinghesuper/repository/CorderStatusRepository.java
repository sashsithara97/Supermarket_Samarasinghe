package com.samarasinghesuper.repository;


import com.samarasinghesuper.model.CustomerOrderStatus;
import com.samarasinghesuper.model.ItemStatus;
import org.springframework.data.jpa.repository.JpaRepository;


public interface CorderStatusRepository extends JpaRepository<CustomerOrderStatus, Integer>
{

}