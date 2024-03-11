package com.samarasinghesuper.repository;


import com.samarasinghesuper.model.ItemStatus;
import com.samarasinghesuper.model.PorderStatus;
import org.springframework.data.jpa.repository.JpaRepository;


public interface PorderStatusRepository extends JpaRepository<PorderStatus, Integer>
{

}