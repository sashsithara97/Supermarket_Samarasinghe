package com.samarasinghesuper.repository;


import com.samarasinghesuper.model.ItemStatus;
import com.samarasinghesuper.model.Qrstatus;
import org.springframework.data.jpa.repository.JpaRepository;


public interface QrStatusRepository extends JpaRepository<Qrstatus, Integer>
{

}