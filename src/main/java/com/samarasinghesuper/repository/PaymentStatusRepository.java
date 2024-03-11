package com.samarasinghesuper.repository;


import com.samarasinghesuper.model.ItemStatus;
import com.samarasinghesuper.model.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;


public interface PaymentStatusRepository extends JpaRepository<PaymentStatus, Integer>
{

}