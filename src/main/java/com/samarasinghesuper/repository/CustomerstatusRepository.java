package com.samarasinghesuper.repository;


import com.samarasinghesuper.model.CustomerStatus;
import com.samarasinghesuper.model.Employeestatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface CustomerstatusRepository extends JpaRepository<CustomerStatus, Integer>
{



}