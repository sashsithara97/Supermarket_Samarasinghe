

 

        window.addEventListener("load", initialize);

        //Initializing Functions

        function initialize() {

            $('[data-toggle="tooltip"]').tooltip();

            btnAdd.addEventListener("click",btnAddMC);
            btnClear.addEventListener("click",btnClearMC);
            btnUpdate.addEventListener("click",btnUpdateMC);

            txtSearchName.addEventListener("keyup",btnSearchMC);
            cmbSupplier.addEventListener("change",cmbSupplierCH);
            cmbQRCode.addEventListener("change",cmbQRCodeCH);

            privilages = httpRequest("../privilage?module=QUOTATION","GET");
            // data list for inner form combo box
            items = httpRequest("../item/list","GET");
            // data list for All Suppliers
            allsuppliers = httpRequest("../supplier/list","GET");

            // data list for Selected Suppliers
            suppliers = httpRequest("../supplier/listbysupplierstatus","GET");

            // data list for main form combo box
            quotationstatuses = httpRequest("../quotationstatus/list","GET");

            qrequests = httpRequest("../quotationrequest/list","GET");
            employees = httpRequest("../employee/list","GET");

            valid = "2px solid green";
            invalid = "2px solid red";
            initial = "2px solid #d6d6c2";
            updated = "2px solid #ff9900";
            active = "#ff9900";

            loadView();
            loadForm();


            changeTab('form');
        }

        function loadView() {

            //Search Area
            txtSearchName.value="";
            txtSearchName.style.background = "";

            //Table Area
            activerowno = "";
            activepage = 1;
            var query = "&searchtext=";
            loadTable(1,cmbPageSize.value,query);
        }

        function loadTable(page,size,query) {
            page = page - 1;
            quotations = new Array();
          var data = httpRequest("/quotation/findAll?page="+page+"&size="+size+query,"GET");
            if(data.content!= undefined) quotations = data.content;
            createPagination('pagination',data.totalPages, data.number+1,paginate);
            fillTable('tblQuotation',quotations,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblQuotation);

            if(activerowno!="")selectRow(tblQuotation,activerowno,active);

        }

        function paginate(page) {
            var paginate;
            if(oldquotation==null){
                paginate=true;
            }else{
                if(getErrors()==''&&getUpdates()==''){
                    paginate=true;
                }else{
                    paginate = window.confirm("Form has Some Errors or Update Values. " +
                        "Are you sure to discard that changes ?");
                }
            }
            if(paginate) {
                activepage=page;
                activerowno=""
                loadForm();
                loadSearchedTable();
            }

        }

        function viewitem(quota,rowno) {

            printquotation = JSON.parse(JSON.stringify(quota));
            
            tdqnum.setAttribute('value',printquotation.quotationnumber);
            tdvalidto.innerHTML = printquotation.validto;
            tdvalidfrom.innerHTML = printquotation.validfrom;
            tdreceived.innerHTML = printquotation.receiveddate;
            tdadded.innerHTML = printquotation.addeddate;
            tddescription.innerHTML = printquotation.description;
            tdqstatus.innerHTML = printquotation.quotationstatus_id.name;
            tdqrequest.innerHTML = printquotation.quotationrequest_id.qrcode;

            var format = printformtable.outerHTML;

            var newwindow=window.open();
            newwindow.document.write("<html>" +
                "<head><link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
                "<body><div style='margin-top: 50px'><h1>Quotation Details :</h1></div>" +
                "<div>"+format+"</div>" +
                "<script>printformtable.removeAttribute('style')</script>" +
                "</body></html>");
            setTimeout(function () {newwindow.print(); newwindow.close();},100);
         }

        function loadForm() {

            quotation = new Object();
            oldquotation = null;

            // Get Next Number Form Data Base
            var nextNumber = httpRequest("/quotation/nextnumber", "GET");
            txtQNumber.value = nextNumber.quotationnumber;
            quotation.quotationnumber = txtQNumber.value;
            txtQNumber.disabled="disabled";

            dteAddedDate.value = getCurrentDateTime('date');
            quotation.addeddate = dteAddedDate.value;
            dteAddedDate.disabled="disabled";

            quotation.quotationItemList = new Array();
         fillCombo(cmbQStatus,"Select Quotation Status",quotationstatuses,"name","Valid");
         cmbQStatus.disabled = true;
         quotation.quotationstatus_id = JSON.parse(cmbQStatus.value);

         fillCombo(cmbQRCode,"Select Quotation Request Code",qrequests,"qrcode","");
         fillCombo(cmbSupplier,"Select Supplier",suppliers,"companyname","");

            //Auto fill combo box and auto bind data into object
            fillCombo(cmbAddedEmployee,"",employees,"callingname",session.getObject('activeuser').employeeId.callingname);
            quotation.employee_id = JSON.parse(cmbAddedEmployee.value);
            cmbAddedEmployee.disabled = true;

            //Received date eka ada sita dawas 3k pitipassata thiyanna ethakota tikak
            // pahu wena dawasak unath danna pluwan
            dteReceived.min  = getCurrentDateTime("date");

            let mindate = new Date();
            mindate.setDate(mindate.getDate() -3 );
            dteReceived.min = mindate.getFullYear()+"-"+ getmonthdate(mindate);
            quotation.receiveddate = dteReceived.value;

            dteReceived.max = getCurrentDateTime('date');
            quotation.receiveddate = dteAddedDate.value;

            /*  Valid From  - Ada sita idiriyata
                  min  - ada
                  max - sathiyak dakwa
              Valid to -
                  min - sathiyakata passe
                  max - 1 year
              received  -
              min - adata dawas 3k pitipasse
              max - ada
              */

            //Ada thama danne min ekata
            dteValidfrom.min = getCurrentDateTime('date');
            quotation.validfrom = dteValidfrom.value;

            //Valid from date eka ada sita dawas 7k issarahata min valid kala
            dteValidfrom.max  = getCurrentDateTime("date");
            let valifrommax = new Date();
            valifrommax.setDate(valifrommax.getDate() + 7 );
            dteValidfrom.max = valifrommax.getFullYear()+"-"+ getmonthdate(valifrommax);
            quotation.validfrom = dteValidfrom.value;

            //Valid To date eka ada sita dawas 7k issarahata min valid kala
            dteValidto.min  = getCurrentDateTime("date");
            let validtomindate = new Date();
            validtomindate.setDate(validtomindate.getDate() + 7 );
            dteValidto.min = validtomindate.getFullYear()+"-"+ getmonthdate(validtomindate);
            quotation.validto = dteValidto.value;

            //Valid To date eka ada sita dawas 62k issarahata max valid kala
            dteValidto.max  = getCurrentDateTime("date");
            let maxdate = new Date();
            maxdate.setDate(maxdate.getDate() + 62 );
            dteValidto.max = maxdate.getFullYear()+"-"+ getmonthdate(maxdate);
            quotation.validto = dteValidto.value;

            dteReceived.value="";
            txtDescription.value="";

             setStyle(initial);
            cmbAddedEmployee.style.border=valid;
            txtQNumber.style.border=valid;
            cmbQStatus.style.border=valid;
            dteAddedDate.style.border=valid;
            cmbQRCode.disabled = true;
             disableButtons(false, true, true);

            refrehInnerForm();
        }

        function cmbSupplierCH(){

            qrcodebysupplier = httpRequest("../quotationrequest/listbysupplier?supplierid="+JSON.parse(cmbSupplier.value).id,"GET");
            fillCombo(cmbQRCode,"Select Quotation Requset",qrcodebysupplier,"qrcode","");
            cmbQRCode.disabled = false;
            cmbSupplier.style.border = valid;

            itemsbysupplier = httpRequest("../item/itemlistbysupplier?supplierid="+JSON.parse(cmbSupplier.value).id,"GET");
            fillCombo(cmbItem,"Select Item",itemsbysupplier,"itemname","");
            cmbItem.disabled = false;

        }

        function cmbQRCodeCH(){

            itemsbyQuotationrequest = httpRequest("../item/listbyquotationrequest?quotationrequestid="+JSON.parse(cmbQRCode.value).id,"GET");
            fillCombo(cmbItem,"Select Item",itemsbyQuotationrequest,"itemname","");
            cmbItem.disabled = false;

        }

        function setStyle(style) {


            txtQNumber.style.border = style;
            cmbQRCode.style.border = style;
            dteValidfrom.style.border = style;
            dteValidto.style.border = style;
            dteAddedDate.style.border = style;
            dteReceived.style.border = style;
            cmbQStatus.style.border = style;
            txtDescription.style.border = style;
            cmbAddedEmployee.style.border = style;

            cmbItem.style.border = style;
            txtPurchaseprice.style.border = style;

        }

        function disableButtons(add, upd, del) {

            if (add || !privilages.add) {
                btnAdd.setAttribute("disabled", "disabled");
                $('#btnAdd').css('cursor','not-allowed');
            }
            else {
                btnAdd.removeAttribute("disabled");
                $('#btnAdd').css('cursor','pointer')
            }

            if (upd || !privilages.update) {
                btnUpdate.setAttribute("disabled", "disabled");
                $('#btnUpdate').css('cursor','not-allowed');
            }
            else {
                btnUpdate.removeAttribute("disabled");
                $('#btnUpdate').css('cursor','pointer');
             }

            if (!privilages.update) {
                $(".buttonup").prop('disabled', true);
                $(".buttonup").css('cursor','not-allowed');
            }
            else {
                $(".buttonup").removeAttr("disabled");
                $(".buttonup").css('cursor','pointer');
            }

            if (!privilages.delete){
                $(".buttondel").prop('disabled', true);
                $(".buttondel").css('cursor','not-allowed');
            }
            else {
                $(".buttondel").removeAttr("disabled");
                $(".buttondel").css('cursor','pointer');
            }

            // select deleted data row
            for(index in quotations){
                if(quotations[index].quotationstatus_id.name =="Deleted"){
                    tblQuotation.children[1].children[index].style.color = "#f00";
                    tblQuotation.children[1].children[index].style.border = "2px solid red";
                    tblQuotation.children[1].children[index].lastChild.children[1].disabled = true;
                    tblQuotation.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

                }
            }

        }

        function refrehInnerForm() {

            quotationItem = new Object();
            oldquotationItem = null;

                      // for refresh inner table
            fillInnerTable("tblQuotationItem",quotation.quotationItemList,innerModify,innerDelete,false);

            btnInnerUpdate.style.visibility = "hidden";
           // $('#btnInnerUpdate').css('visibility',"hidden");
            btnInnerAdd.style.visibility = "visible";

            // for refresh inner form
            fillCombo(cmbItem,"Select Item",[],"itemname","");
            cmbItem.disabled = true;

            cmbItem.style.border = initial;
            txtPurchaseprice.value  = "";
            txtPurchaseprice.style.border = initial;

        }

        function getDuplicate() {
            var extbc = false;
            for (var index in quotation.quotationItemList){
                if(quotation.quotationItemList[index].item_id.itemname == quotationItem.item_id.itemname){
                    extbc = true;
                    break;
                }
            }

            return extbc;
        }

        function btnInnerAddMC() {
            if(getDuplicate()){
                swal({
                    title: "All ready Ext....!",
                    text: "\n\n",
                    icon: "warning", button: false, timer: 1200,
                });
            }else {
                swal({
                    title: "Added Successfully....!",
                    text: "\n\n",
                    icon: "success", button: false, timer: 1200,
                });
                quotation.quotationItemList.push(quotationItem);
                refrehInnerForm();

            }

        }

        function innerModify(innerob , ind){
            innerrowobindex = ind;
            quotationItem = JSON.parse(JSON.stringify(innerob));
            oldquotationItem = JSON.parse(JSON.stringify(innerob));

            selectRow(tblQuotationItem , ind+1 ,active);
            fillCombo(cmbItem,"Select Item",items,"itemname",quotationItem.item_id.itemname);
            txtPurchaseprice.value  = toDecimal(quotationItem.purchaseprice,2);

            cmbItem.style.border = valid;
            txtPurchaseprice.style.border = valid;

            btnInnerUpdate.style.visibility = "visible";
            btnInnerAdd.style.visibility = "hidden";
        }

        function innerDelete(innerob,ind){
            quotationItem = innerob;
            swal({
                title: "Are you sure to delete following Quotation Item...?",
                text: "\n Item Name : " + quotationItem.item_id.itemname +
                    "\n Purchase Price : " + quotationItem.purchaseprice,
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete)=> {
                if (willDelete) {
                    supplier.supplyBrandList.splice(ind,1);
                        swal({
                            title: "Removed Successfully....!",
                            text: "\n\n",
                            icon: "success", button: false, timer: 1200,
                        });
                      refrehInnerForm();

                }
            });

        }

        function getInnerUpdate() {

            var updates = "";

            if(quotationItem != null && oldquotationItem !=null) {

                if (quotationItem.purchaseprice != oldquotationItem.purchaseprice)
                    updates = updates + "\nPurchaseprice is Changed";

                if (quotationItem.item_id.itemname != oldquotationItem.item_id.itemname)
                    updates = updates + "\nItem Name is Changed";

            }

            return updates;
        }

        function btnInnerUpdateMC(){
            var updates = getInnerUpdate();
            if (updates == "")
                swal({
                    title: 'Nothing Updated..!',icon: "warning",
                    text: '\n',
                    button: false,
                    timer: 1200});
            else {
                swal({
                    title: "Are you sure to update following Quotation Item details...?",
                    text: "\n"+ getInnerUpdate(),
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                        if (willDelete) {

                            if(getDuplicate()){
                                swal({
                                    title: "All ready Ext....!",
                                    text: "\n\n",
                                    icon: "warning", button: false, timer: 1200,
                                });
                            }else {
                                swal({
                                    title: "Update Successfully....!",
                                    text: "\n\n",
                                    icon: "success", button: false, timer: 1200,
                                });
                                quotation.quotationItemList[innerrowobindex]  = quotationItem;
                                refrehInnerForm();

                            }

                        }
                    });
            }

        }

        function getErrors() {

            var errors = "";
            addvalue = "";

            if (quotation.quotationnumber == null)
                errors = errors + "\n" + "Enter Quotation Number";
            else  addvalue = 1;

            if (quotation.validto == null)
                errors = errors + "\n" + "Invalid Valid To Date";
            else  addvalue = 1;

            if (quotation.validfrom == null)
                errors = errors + "\n" + "Invalid Valid From Date";
            else  addvalue = 1;

            if (quotation.addeddate == null)
                errors = errors + "\n" + "Invalid Added Date";
            else  addvalue = 1;

            if (quotation.receiveddate == null)
                errors = errors + "\n" + "Invalid Received Date";
            else  addvalue = 1;

            if (quotation.quotationstatus_id == null)
                errors = errors + "\n" + "Quotation Status Not Selected";
            else  addvalue = 1;

            if (quotation.quotationrequest_id == null)
                errors = errors + "\n" + "Quotation Request Code Not Selected";
            else  addvalue = 1;

            if (quotation.quotationrequest_id.supplier_id.companyname == null)
                errors = errors + "\n" + "Supplier Not Selected";
            else  addvalue = 1;
            
            return errors;

        }

        function btnAddMC(){
            if(getErrors()==""){
                if(txtDescription.value ==""){
                    swal({
                        title: "Are you sure to continue...?",
                        text: "Form has some empty fields.....",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    }).then((willDelete) => {
                        if (willDelete) {
                            savedata();
                        }
                    });

                }else{
                    savedata();
                }
            }else{
                swal({
                    title: "You have following errors",
                    text: "\n"+getErrors(),
                    icon: "error",
                    button: true,
                });

            }
        }
        
        function savedata() {

            swal({
                title: "Are you sure to add following Quotation...?" ,
                  text :  "\nQuotation Number : " + quotation.quotationnumber +
                    "\nSupplier : " + quotation.quotationrequest_id.supplier_id.companyname +
                    "\nValid From Date : " + quotation.validfrom +
                    "\nValid To : " + quotation.validto +
                    "\nAdded Date : " + quotation.addeddate +
                    "\nReceived Date : " + quotation.receiveddate +
                    "\nQuotation Request Code : " + quotation.quotationrequest_id.qrcode +
                    "\nQuotation Status : " + quotation.quotationstatus_id.name,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    var response = httpRequest("/quotation", "POST", quotation);
                    if (response == "0") {
                        swal({
                            position: 'center',
                            icon: 'success',
                            title: 'Your work has been Done \n Save SuccessFully..!',
                            text: '\n',
                            button: false,
                            timer: 1200
                        });
                        activepage = 1;
                        activerowno = 1;
                        loadSearchedTable();
                        loadForm();
                        changeTab('table');
                    }
                    else swal({
                        title: 'Save not Success... , You have following errors', icon: "error",
                        text: '\n ' + response,
                        button: true
                    });
                }
            });

        }

        function btnClearMC() {
            //Get Cofirmation from the User window.confirm();
            checkerr = getErrors();

            if(oldquotation == null && addvalue == ""){
                loadForm();
            }else{
                swal({
                    title: "Form has some values, updates values... Are you sure to discard the form ?",
                    text: "\n" ,
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        loadForm();
                    }

                });
            }

        }

        function fillForm(quota,rowno){
            activerowno = rowno;

            if (oldquotation==null) {
                filldata(quota);
            } else {
                swal({
                    title: "Form has some values, updates values... Are you sure to discard the form ?",
                    text: "\n" ,
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        filldata(emp);
                    }

                });
            }

        }

        function filldata(quota) {

            clearSelection(tblQuotation);
            selectRow(tblQuotation,activerowno,active);

            quotation = JSON.parse(JSON.stringify(quota));
            oldquotation = JSON.parse(JSON.stringify(quota));

            txtQNumber.value = quotation.quotationnumber;
            dteValidfrom.value = quotation.validfrom;
            dteValidto.value = quotation.validto;
            dteAddedDate.value = quotation.addeddate;
            dteReceived.value = quotation.receiveddate;
            txtDescription.value = quotation.description;


            fillCombo(cmbQStatus, "Select Quotation Status", quotationstatuses, "name", quotation.quotationstatus_id.name);
            fillCombo(cmbSupplier, "Select Supplier", allsuppliers, "companyname", quotation.quotationrequest_id.supplier_id.companyname);
            cmbSupplier.disabled = true;

            disableButtons(true, false, false);
            setStyle(valid);
            changeTab('form');
            refrehInnerForm();

            cmbSupplierCH();
//All Quotation requets

            fillCombo(cmbQRCode, "Select Quotation Request Code",qrequests, "qrcode", quotation.quotationrequest_id.qrcode);
            cmbQRCode.disabled = true;
        }

        function getUpdates() {

            var updates = "";

            if(quotation!=null && oldquotation!=null) {


                if (quotation.validto != oldquotation.validto)
                    updates = updates + "\nValid to Date is Changed";

                if (quotation.validfrom != oldquotation.validfrom)
                    updates = updates + "\nValid From Date is Changed";

                if (quotation.receiveddate != oldquotation.receiveddate)
                    updates = updates + "\nReceived Date is Changed";

                if (quotation.addeddate != oldquotation.addeddate)
                    updates = updates + "\nAdded Date is Changed";

                if (quotation.description != oldquotation.description)
                    updates = updates + "\nDescription is Changed";

                if (quotation.purchaseprice != oldquotation.purchaseprice)
                    updates = updates + "\nPurchase Price is Changed";

                if (quotation.quotationrequest_id.qrcode != oldquotation.quotationrequest_id.qrcode)
                    updates = updates + "\nQuotation Request Code is Changed";

                if (quotation.quotationrequest_id.supplier_id.companyname != oldquotation.quotationrequest_id.supplier_id.companyname)
                    updates = updates + "\nSupplier is Changed";

                if (quotation.quotationstatus_id.name != oldquotation.quotationstatus_id.name)
                    updates = updates + "\nQuotation Status is Changed";

            }

            return updates;

        }

        function btnUpdateMC() {
            var errors = getErrors();
            if (errors == "") {
                var updates = getUpdates();
                if (updates == "")
                    swal({
                    title: 'Nothing Updated..!',icon: "warning",
                    text: '\n',
                    button: false,
                    timer: 1200});
                else {
                    swal({
                        title: "Are you sure to update following Quotation details...?",
                        text: "\n"+ getUpdates(),
                        icon: "warning", buttons: true, dangerMode: true,
                    })
                        .then((willDelete) => {
                        if (willDelete) {
                            var response = httpRequest("/quotation", "PUT", quotation);
                            if (response == "0") {
                                swal({
                                    position: 'center',
                                    icon: 'success',
                                    title: 'Your work has been Done \n Update SuccessFully..!',
                                    text: '\n',
                                    button: false,
                                    timer: 1200
                                });
                                loadSearchedTable();
                                loadForm();
                                changeTab('table');

                            }
                            else window.alert("Failed to Update as \n\n" + response);
                        }
                        });
                }
            }
            else
                swal({
                    title: 'You have following errors in your form',icon: "error",
                    text: '\n '+getErrors(),
                    button: true});

        }

        function btnDeleteMC(quota) {
            quotation = JSON.parse(JSON.stringify(quota));

            swal({
                title: "Are you sure to delete following quotation...?",
                text: "\n Quotation Number : " + quotation.quotationnumber,
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete)=> {
                if (willDelete) {
                    var responce = httpRequest("/quotation","DELETE",quotation);
                    if (responce==0) {
                        swal({
                            title: "Deleted Successfully....!",
                            text: "\n\n  Status change to delete",
                            icon: "success", button: false, timer: 1200,
                        });
                        loadSearchedTable();
                        loadForm();
                    } else {
                        swal({
                            title: "You have following erros....!",
                            text: "\n\n" + responce,
                            icon: "error", button: true,
                        });
                    }
                }

                else {   loadForm();   }
            });

       }

        function loadSearchedTable() {

            var searchtext = txtSearchName.value;

            var query ="&searchtext=";

            if(searchtext!="")
                query = "&searchtext=" + searchtext;
            //window.alert(query);
            loadTable(activepage, cmbPageSize.value, query);
            disableButtons(false, true, true);


        }

        function btnSearchMC(){
            activepage=1;
            loadSearchedTable();
        }

        function btnSearchClearMC(){
               loadView();
        }

        function btnPrintTableMC(quotation) {
            //
            var newwindow = window.open();
            formattab = tblQuotation.outerHTML;

            newwindow.document.write("" +
                "<html>" +
                "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
                "<link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
                "<body><div style='margin-top: 50px; '> <h1>Quotation  Details : </h1></div>" +
                "<div>"+ formattab+"</div>"+
                "</body>" +
                "</html>");
            setTimeout(function () {newwindow.print(); newwindow.close();},100) ;
        }

        function sortTable(cind) {
            cindex = cind;

         var cprop = tblQuotation.firstChild.firstChild.children[cindex].getAttribute('property');

           if(cprop.indexOf('.') == -1) {
               employees.sort(
                   function (a, b) {
                       if (a[cprop] < b[cprop]) {
                           return -1;
                       } else if (a[cprop] > b[cprop]) {
                           return 1;
                       } else {
                           return 0;
                       }
                   }
               );
           }else {
               quotations.sort(
                   function (a, b) {
                       if (a[cprop.substring(0,cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.')+1)] < b[cprop.substring(0,cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.')+1)]) {
                           return -1;
                       } else if (a[cprop.substring(0,cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.')+1)] > b[cprop.substring(0,cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.')+1)]) {
                           return 1;
                       } else {
                           return 0;
                       }
                   }
               );
           }
            fillTable('tblQuotation',quotations,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblQuotation);
            loadForm();

            if(activerowno!="")selectRow(tblQuotation,activerowno,active);



        }