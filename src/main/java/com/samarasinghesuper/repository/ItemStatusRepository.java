package com.samarasinghesuper.repository;


import com.samarasinghesuper.model.Employeestatus;
import com.samarasinghesuper.model.ItemStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface ItemStatusRepository extends JpaRepository<ItemStatus, Integer>
{

}