package com.samarasinghesuper.repository;

import com.samarasinghesuper.model.Customer;
import com.samarasinghesuper.model.Customerpoint;
import com.samarasinghesuper.model.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CustomerPointRepository extends JpaRepository<Customerpoint, Integer> {

    @Query("SELECT cp FROM Customerpoint cp where (cp.discount like concat('%',:searchtext,'%') or " +
            "cp.addpoint like concat('%',:searchtext,'%') or " +
            "cp.loyaltytype like concat('%',:searchtext,'%') or " +
            "cp.startrate like concat('%',:searchtext,'%') or " +
            "cp.endrate like concat('%',:searchtext,'%') )")
    Page<Customerpoint> findAll(@Param("searchtext") String searchtext , Pageable of);

    @Query("SELECT cp FROM Customerpoint cp WHERE cp.loyaltytype =:loyaltytype")
    Customerpoint getByLoyaltyType(@Param("loyaltytype")String loyaltytype);


}
