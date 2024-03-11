package com.samarasinghesuper.repository;

import com.samarasinghesuper.model.Item;
import com.samarasinghesuper.model.Quotation;
import com.samarasinghesuper.model.QuotationItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuotationItemRepository extends JpaRepository<QuotationItem, Integer> {

    //
    @Query(value="SELECT qi FROM QuotationItem qi where qi.quotation_id.id=:quotationid and qi.item_id.id=:itemid")
    QuotationItem byQuotationItem(@Param("quotationid") Integer quotationid,@Param("itemid") Integer itemid);
}
