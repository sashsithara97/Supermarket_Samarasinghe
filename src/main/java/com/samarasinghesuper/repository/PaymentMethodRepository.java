package com.samarasinghesuper.repository;


import com.samarasinghesuper.model.BatchStatus;
import com.samarasinghesuper.model.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;


public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Integer>
{


}