package com.samarasinghesuper.repository;


import com.samarasinghesuper.model.InvoicePayMethod;
import com.samarasinghesuper.model.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;


public interface InvoicePayMehthodRepository extends JpaRepository<InvoicePayMethod, Integer>
{


}