package com.samarasinghesuper.controller;


import com.samarasinghesuper.model.Item;
import com.samarasinghesuper.model.Quotation;
import com.samarasinghesuper.model.QuotationItem;
import com.samarasinghesuper.model.User;
import com.samarasinghesuper.repository.QuotationItemRepository;
import com.samarasinghesuper.repository.QuotationRepository;
import com.samarasinghesuper.repository.QuotationStatusRepository;
import com.samarasinghesuper.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.util.HashMap;
import java.util.List;

@EnableAsync
@RequestMapping(value = "/quotationitem")
@RestController
public class QuotationItemController {


    @Autowired
    private QuotationItemRepository dao;


    //get mapping for quotationitem  by given quotationid and itemid[/quotationitem/listbyquotationitem?quotationid=1&itemid=1]
    @GetMapping(value = "/byquotationitem",params = {"quotationid","itemid"}, produces = "application/json")
    public QuotationItem byQuotationItem(@RequestParam("quotationid")int quotationid,@RequestParam("itemid")int itemid) {
        return dao.byQuotationItem(quotationid,itemid);
    }


}
