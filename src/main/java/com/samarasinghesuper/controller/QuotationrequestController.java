package com.samarasinghesuper.controller;

import com.samarasinghesuper.model.*;
import com.samarasinghesuper.repository.ItemRepository;
import com.samarasinghesuper.repository.ItemStatusRepository;
import com.samarasinghesuper.repository.QrStatusRepository;
import com.samarasinghesuper.repository.QuotationrequestRepository;
import com.samarasinghesuper.service.EmailService;
import com.samarasinghesuper.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping( value = "/quotationrequest")
public class QuotationrequestController {

    @Autowired
    private UserService userService;

    @Autowired
    private QuotationrequestRepository dao;

    @Autowired
    private EmailService emailService;

    @Autowired
    private QrStatusRepository daoQrStatus;

    @Autowired
    private PrevilageController previlageController;


    @GetMapping(value = "/list", produces = "application/json")
    public List<Quotationrequest> list() {
        return dao.list();
    }


    //get mapping services for get active quotation request code  list by given supplier [/listbysupplier?supplierid=1]
    @GetMapping(value = "/listbysupplier",params = {"supplierid"}, produces = "application/json")
    public List<Quotationrequest> QRlistBySupplier(@RequestParam("supplierid") int supplierid) {
        return dao.QRlistBySupplier(supplierid);
    }

    // Find aLL serverice for get All
    @GetMapping(value = "/findAll", params = {"page", "size"}, produces = "application/json")
    public Page<Quotationrequest> findAll(@RequestParam("page") int page, @RequestParam("size") int size) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());

        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"QUOTATIONREQUEST");

        if(user!= null && priv.get("select"))
            return dao.findAll(PageRequest.of(page, size , Sort.Direction.DESC,"id"));
        else
            return null;
    }

   // Find aLL serverice for get All with serch value
    @GetMapping(value = "/findAll",params = {"page", "size","searchtext"}, produces = "application/json")
    public Page<Quotationrequest> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"QUOTATIONREQUEST");
        if(user!= null && priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size,Sort.Direction.DESC,"id"));
        }
        return null;
    }


    @GetMapping(value = "/nextnumber", produces = "application/json")
    public Quotationrequest nextNumber() {
        String nextnumber = dao.getNextRegNumber();
        Quotationrequest qr = new Quotationrequest();
        if(nextnumber != ""){
            qr.setQrcode(nextnumber);
        }else {
            qr.setQrcode("SQR0001");
        }

        return qr;

    }

    //Post mapping for Inser data into database
    @PostMapping
    public String insert(@RequestBody Quotationrequest quotationrequest){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"QUOTATIONREQUEST");
        if(user!= null && priv.get("add")){
            try {


                Quotationrequest extqrcode = dao.getByQRCode(quotationrequest.getQrcode());
                if(extqrcode != null)
                    return "Error-Saving : QR Code all Ready Exists...!";

                StringBuffer message = new StringBuffer("No \t\t\t" + "Item Name \t\t\t\t");
                int i = 1;

                for (QuotationRequestItem qri : quotationrequest.getQuotationrequestItemList()){
                    qri.setQuotationrequest_id(quotationrequest);

                    message.append(i).append("\t\t")
                            .append(qri.getItem_id().getItemname()).append("\t\t\t")
                            .append("\n");

                    i++;

                }
                System.out.println(message);

                dao.save(quotationrequest);
                emailService.sendMail(quotationrequest.getSupplier_id().getEmail(),"Quotation Request ",
                        "Hi " + quotationrequest.getSupplier_id().getContactname() + "Hello, my name is Mr/Mrs."+ quotationrequest.getEmployee_id().getCallingname() +" " +
                                "and I'm the Procurement Manager of Samarasinghe Supermarket and I'm writing this email to request a price quote for the following items:\n\n " + message);

                return "0";
            }
            catch(Exception e) {
                return "Error-Insert : "+e.getMessage();
            }
        }
        return "Error-Insert : You have no Permission";
    }

    //Put mapping for Update data into database
    @PutMapping
    public String update(@RequestBody Quotationrequest quotationrequest){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"QUOTATIONREQUEST");
        if(user!= null && priv.get("update")){
            try {
                Quotationrequest extquotationrequest = dao.getById(quotationrequest.getId());
                if(extquotationrequest == null)
                    return "Error-Updating : Item Not Exsites...!";

                for (QuotationRequestItem qri : quotationrequest.getQuotationrequestItemList())
                    qri.setQuotationrequest_id(quotationrequest);

                dao.save(quotationrequest);

                return "0";
            }
            catch(Exception e) {
                return "Error-Updating : "+e.getMessage();
            }
        }
        return "Error-Updating : You have no Permission";
    }



    // Delete Mapping for Delete Item object
    @DeleteMapping()
    public String delete(@RequestBody Quotationrequest quotationrequest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"QUOTATIONREQUEST");
        if(user!= null && priv.get("delete")){
            try {
                //   dao.delete(dao.getOne(item.getId()));
                quotationrequest.setQrstatus_id(daoQrStatus.getById(4));

                for (QuotationRequestItem qri : quotationrequest.getQuotationrequestItemList())
                    qri.setQuotationrequest_id(quotationrequest);

                dao.save(quotationrequest);

                return "0";
            }
            catch(Exception e) {
                return "Error-Deleting : "+e.getMessage();
            }
        }
        return "Error-Deleting : You have no Permission";

    }

}
