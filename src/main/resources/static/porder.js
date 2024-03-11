

 

        window.addEventListener("load", initialize);

        //Initializing Functions

        function initialize() {

            $('[data-toggle="tooltip"]').tooltip();

            btnAdd.addEventListener("click",btnAddMC);
            btnClear.addEventListener("click",btnClearMC);
            btnUpdate.addEventListener("click",btnUpdateMC);

           // cmbSupplier.addEventListener("change",cmbSupplierCH);
            cmbQuotation.addEventListener("change",cmbQuotationCH);
            cmbItem.addEventListener("change",cmbItemCH);
            txtQuantity.addEventListener("keyup",txtQuantityKU);

            txtSearchName.addEventListener("keyup",btnSearchMC);

            privilages = httpRequest("../privilage?module=PORDER","GET");

            // data list for main form combo box
            porderstatuses = httpRequest("../porderstatus/list","GET");

            // data list for Avtive Suppliers list
            suppliers = httpRequest("../supplier/listbysupplierstatus","GET");

            allsuppliers = httpRequest("../supplier/list","GET");
            quotations = httpRequest("../quotation/list","GET");
            employees = httpRequest("../employee/list","GET");

            // data list for inner form combo box
            items = httpRequest("../item/list","GET");

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
            porders = new Array();
          var data = httpRequest("/porder/findAll?page="+page+"&size="+size+query,"GET");
            if(data.content!= undefined) porders = data.content;
            createPagination('pagination',data.totalPages, data.number+1,paginate);
            fillTable('tblPorder',porders,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblPorder);

            if(activerowno!="")selectRow(tblPorder,activerowno,active);

        }

        function paginate(page) {
            var paginate;
            if(oldemployee==null){
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

        function viewitem(po,rowno) {
           printporder = JSON.parse(JSON.stringify(po));
            
            tdponum.setAttribute('value',printporder.pordercode);
            tdpoaddeddate.innerHTML = printporder.addeddate;
            tdporequireddate.innerHTML = printporder.requireddate;
            tdpodescription.innerHTML = printporder.description;
            tdpototalamount.innerHTML = printporder.totalamount;
            tdporderstatus.innerHTML = printporder.porderstatus_id.name;
            tdpoquotation.innerHTML = printporder.quotation_id.quotationnumber;

            var format = printformtable.outerHTML;

            var newwindow=window.open();
            newwindow.document.write("<html>" +
                "<head><link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
                "<body><div style='margin-top: 50px'><h1>Purchase Order Details :</h1></div>" +
                "<div>"+format+"</div>" +
                "<script>printformtable.removeAttribute('style')</script>" +
                "</body></html>");
            setTimeout(function () {newwindow.print(); newwindow.close();},100);
         }

         function cmbSupplierCH() {
             quotationsbysupplier = httpRequest("../quotation/listbysupplier?supplierid="+JSON.parse(cmbSupplier.value).id,"GET");
             fillCombo(cmbQuotation,"Select Quotation",quotationsbysupplier,"quotationnumber","");
             cmbQuotation.disabled = false;
             cmbSupplier.style.border = valid;

         }

         function cmbQuotationCH() {
             itemsbyquotation = httpRequest("../item/listbyquotation?quotationid="+JSON.parse(cmbQuotation.value).id,"GET");
             fillCombo3(cmbItem,"Select Item",itemsbyquotation,"itemcode","itemname","");
             cmbItem.disabled = false;

         }

         function cmbItemCH() {
             quotationitem = httpRequest("../quotationitem/byquotationitem?quotationid="+JSON.parse(cmbQuotation.value).id+"&itemid="+JSON.parse(cmbItem.value).id,"GET");
             txtPurchasePrice.value = toDecimal(quotationitem.purchaseprice,2);
             porderItem.purchaseprice = txtPurchasePrice.value;
             txtPurchasePrice.style.border=valid;
             txtQuantity.disabled = false;
         }

         function txtQuantityKU() {

            if(txtQuantity.value != 0 ){
                txtLineTotal.value = (parseFloat(txtPurchasePrice.value) * parseFloat(txtQuantity.value)).toFixed(2);
                porderItem.linetotal = txtLineTotal.value;
                txtLineTotal.style.border=valid;
            }else {
                txtQuantity.style.border = invalid;
                txtLineTotal.value = "";
                porderItem.linetotal = null;
                txtLineTotal.style.border = initial;
                swal({
                    icon: "warning",
                    text: '\n Quantity Cann\'t Be 0   ',
                    button: false,
                    timer: 1500,});
            }

        }

        function loadForm() {
            porder = new Object();
            oldporder = null;

            porder.porderItemList = new Array();

            // Get Next Number Form Data Base
            var nextNumber = httpRequest("/porder/nextnumber", "GET");
            txtNumber.value = nextNumber.pordercode;
            porder.pordercode = txtNumber.value;
            txtNumber.disabled="disabled";

            fillCombo(cmbPoStatus,"Select Porder Status",porderstatuses,"name","Ordered");
            cmbPoStatus.disabled = true;
            porder.porderstatus_id = JSON.parse(cmbPoStatus.value);

            fillCombo(cmbSupplier,"Select Supplier",suppliers,"companyname","");

            fillCombo(cmbQuotation,"Select Quotation",quotations,"quotationnumber","");
            cmbQuotation.disabled = true;

            //Auto fill combo box and auto bind data into object
            fillCombo(cmbEmployee,"",employees,"callingname",session.getObject('activeuser').employeeId.callingname);
            cmbEmployee.disabled = true;
            porder.employee_id = JSON.parse(cmbEmployee.value);

            dteAddedDate.value  = getCurrentDateTime("date");
            porder.addeddate = dteAddedDate.value;
            dteAddedDate.disabled = true;

            dteRequiredDate.min = getCurrentDateTime("date");
            var today = new Date();
            var aftersevenday = new Date();
            aftersevenday.setDate(today.getDate() + 14);
            var month = aftersevenday.getMonth()+1; // array [0-11]
            if(month<10) month = "0"+month;
            var date = aftersevenday.getDate(); // range 1-31
            if(date<10) date = "0"+date;
            dteRequiredDate.max = aftersevenday.getFullYear()+"-"+month+"-"+date;

            txtTotalAmount.value = "0.00";
            txtTotalAmount.disabled = true;
            txtDescription.value = "";
            dteRequiredDate.value = "";

             setStyle(initial);
            cmbEmployee.style.border=valid;
            dteAddedDate.style.border=valid;
            txtNumber.style.border=valid;
            cmbPoStatus.style.border=valid;
            cmbSupplier.disabled = false;

             disableButtons(false, true, true);

            refrehInnerForm();
        }

        function setStyle(style) {

            txtNumber.style.border = style;
            cmbQuotation.style.border = style;
            dteAddedDate.style.border = style;
            dteRequiredDate.style.border = style;
            txtTotalAmount.style.border = style;
            txtDescription.style.border = style;
            cmbPoStatus.style.border = style;
            cmbEmployee.style.border = style;

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
            for(index in porders){
                if(porders[index].porderstatus_id.name =="Deleted"){
                    tblPorder.children[1].children[index].style.color = "#f00";
                    tblPorder.children[1].children[index].style.border = "2px solid red";
                    tblPorder.children[1].children[index].lastChild.children[1].disabled = true;
                    tblPorder.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

                }

                if(porders[index].porderstatus_id.name =="Completed"){
                    tblPorder.children[1].children[index].style.color = "rgba(3,77,15,0.93)";
                    tblPorder.children[1].children[index].style.border = "2px solid green";
                    tblPorder.children[1].children[index].lastChild.children[1].disabled = true;
                    tblPorder.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

                }

            }

        }

        function refrehInnerForm() {

            porderItem = new Object();
            oldporderItem = null;
           var totalamount = 0;

            // for refresh inner form
            fillCombo(cmbItem,"Select Item",items,"itemname","");

            if(cmbQuotation.value != ""){
               cmbQuotationCH();
            }else{
                cmbItem.disabled = true;
            }

            txtPurchasePrice.disabled = true;
            txtQuantity.disabled = true;
            txtLineTotal.disabled = true;

            cmbItem.style.border = initial;
            txtPurchasePrice.style.border = initial;
            txtQuantity.style.border = initial;
            txtLineTotal.style.border = initial;

            txtPurchasePrice.value = "";
            txtQuantity.value = "";
            txtLineTotal.value = "";

            // for refresh inner table
            fillInnerTable("tblPorderItem", porder.porderItemList,innerModify, innerDelete, false);

            if(porder.porderItemList.length != 0){
                for(var index in porder.porderItemList){
                    totalamount = (parseFloat(totalamount) + parseFloat(porder.porderItemList[index].linetotal)).toFixed(2);
                }

                txtTotalAmount.value = totalamount;
                porder.totalamount = txtTotalAmount.value;

                if(oldporder != null && porder.totalamount != oldporder.totalamount){
                    txtTotalAmount.style.border = updated;
                }else {
                    txtTotalAmount.style.border = valid;
                }
            }

        }

        function checkCreditLimit(){
            var creditlimitok = false;
            var arieaseamount = parseFloat(JSON.parse(cmbSupplier.value).ariasamount);
            var creditlimit = parseFloat(JSON.parse(cmbSupplier.value).creditlimit);

            porderbysupplier = httpRequest("../porder/pordertotal?supplierid="+JSON.parse(cmbSupplier.value).id,"GET");

            //if credit limit == 20000 eya badu aran thiyenawa 5000ka
            //ethakota ariease amount eka wenne  20000-5000= 15000 eta passe balanna eyage prevoius porders thiye nm
            // e porders wala total amount ekath ganna credit limit eken ekath adu unama thama eyata danata allowed credit
            //amount eka enne
             allowedCredit = creditlimit - arieaseamount - parseFloat(porderbysupplier.totalamount);
            var totalporderamount = parseFloat(txtLineTotal.value) + parseFloat(txtTotalAmount.value);

            if(creditlimit != 0){
                if (totalporderamount > allowedCredit ){
                    swal({
                        title: "Credit Limit Exceeded...!",
                        text: "\n\n Allowed Credit Amount :" + allowedCredit,
                        icon: "warning", button: false, timer: 20000,
                    });
                    creditlimitok = false
                  return   creditlimitok;
                }else {

                    creditlimitok = true;
                    return   creditlimitok;
                }


            }else{

                creditlimitok = true;
                return creditlimitok;

            }

        }
        
        function btnInnerAddMC() {

            if (checkCreditLimit()){
                var extbc = false;
                for (var index in porder.porderItemList){
                    if(porder.porderItemList[index].item_id.itemname == porderItem.item_id.itemname){
                        extbc = true;
                        break;
                    }
                }

                if(extbc){
                    swal({
                        title: "All ready Exist....!",
                        text: "\n\n",
                        icon: "warning", button: false, timer: 1200,
                    });
                }else {
                    swal({
                        title: "Added Successfully....!",
                        text: "\n\n",
                        icon: "success", button: false, timer: 1200,
                    });
                    porder.porderItemList.push(porderItem);
                    refrehInnerForm();

                }

            }else{


            }



        }
        
        function innerModify(){}

        function innerDelete(innerob,ind){
            porderItem = innerob;
            swal({
                title: "Are you sure to delete following Porder Item..?",
                text: "\n Item Name : " + porderItem.item_id.itemname +
                    "\n Purchase Price : " + porderItem.purchaseprice +
                    "\n Quantity : " + porderItem.qty,
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete)=> {
                if (willDelete) {
                    porder.porderItemList.splice(ind,1);
                        swal({
                            title: "Removed Successfully....!",
                            text: "\n\n",
                            icon: "success", button: false, timer: 1200,
                        });
                      refrehInnerForm();

                }
            });

        }
        
        function innerView(){}

        function getErrors() {

            var errors = "";
            addvalue = "";

            if (porder.addeddate  == null)
                errors = errors + "\n" + "Enter Added Date";
            else  addvalue = 1;

            if (porder.requireddate  == null)
                errors = errors + "\n" + "Enter Required Date";
            else  addvalue = 1;

            if (porder.totalamount  == null)
                errors = errors + "\n" + "Enter Total Amount";
            else  addvalue = 1;

            if (porder.porderstatus_id == null)
                errors = errors + "\n" + "Porder Status not Selected";
            else  addvalue = 1;

            if (porder.quotation_id == null)
                errors = errors + "\n" + "Quotation not Selected";
            else  addvalue = 1;


            return errors;

        }

        function btnAddMC(){
            if(getErrors()==""){
                if(txtDescription.value==""){
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
                title: "Are you sure to add following purchase order...?" ,
                  text :  "\nPorder Code : " + porder.pordercode +
                    "\nAdded Date : " + porder.addeddate +
                    "\nRequired Date : " + porder.requireddate +
                    "\nPorder Status : " + porder.porderstatus_id.name,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    var response = httpRequest("/porder", "POST", porder);
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

            if(oldporder== null && addvalue == ""){
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

        function fillForm(po,rowno){
            activerowno = rowno;

            if (oldporder==null) {
                filldata(po);
            } else {
                swal({
                    title: "Form has some values, updates values... Are you sure to discard the form ?",
                    text: "\n" ,
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        filldata(po);
                    }

                });
            }

        }
        
        function filldata(po) {

            clearSelection(tblPorder);
            selectRow(tblPorder,activerowno,active);

            porder = JSON.parse(JSON.stringify(po));
            oldporder = JSON.parse(JSON.stringify(po));

            txtNumber.value = porder.pordercode;
            txtNumber.disabled="disabled";

            txtTotalAmount.value = parseFloat(porder.totalamount);
            dteAddedDate.value = porder.addeddate;
            dteRequiredDate.value = porder.requireddate;

            fillCombo(cmbQuotation, "Select Quotation", quotations, "quotationnumber", porder.quotation_id.quotationnumber);
            fillCombo(cmbPoStatus, "Select Porder Status", porderstatuses, "name", porder.porderstatus_id.name);
            fillCombo(cmbSupplier, "Select Supplier", suppliers, "companyname", porder.quotation_id.quotationrequest_id.supplier_id.companyname);
            fillCombo(cmbEmployee, "Select Added Employee", employees, "callingname", porder.employee_id.callingname);

            disableButtons(true, false, false);
            setStyle(valid);
            changeTab('form');

            //Ststus eka complete kiyanne eka porder ekata process eka iwarai aye update karanna
            //denna be
            if(porder.porderstatus_id.name == "Completed"){
                cmbPoStatus.disabled = true;
                       }else {
                cmbPoStatus.disabled = false;
            }


            let currentDate = new Date();
            let requireDate =  new Date(porder.requireddate);
            //Required date eka current date ekata wada adui nm apata edit karanna bari wenna oni
            //eka thama me kle
            if(requireDate.getTime() < currentDate.getTime()){
                dteRequiredDate.disabled = true;

            }else{
                dteRequiredDate.disabled = false;
            }
            cmbSupplier.disabled = true;
            refrehInnerForm();
        }

        function getUpdates() {

            var updates = "";

            if(porder!=null && oldporder!=null) {


                if (porder.pordercode != oldporder.pordercode)
                    updates = updates + "\nPorder Code is Changed";

                if (porder.addeddate != oldporder.addeddate)
                    updates = updates + "\nAdded Date is Changed";

                if (porder.requireddate != oldporder.requireddate)
                    updates = updates + "\nRequired Date is Changed";

                if (porder.description != oldporder.description)
                    updates = updates + "\nDescription is Changed";

                if (porder.totalamount != oldporder.totalamount)
                    updates = updates + "\nTotal Amount is Changed";

                if (porder.quotation_id.quotationnumber != oldporder.quotation_id.quotationnumber)
                    updates = updates + "\nQuotation is Changed";

                if (porder.porderstatus_id.name != oldporder.porderstatus_id.name)
                    updates = updates + "\nPorder Status is Changed";

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
                        title: "Are you sure to update following porder details...?",
                        text: "\n"+ getUpdates(),
                        icon: "warning", buttons: true, dangerMode: true,
                    })
                        .then((willDelete) => {
                        if (willDelete) {
                            var response = httpRequest("/porder", "PUT", porder);
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

        function btnDeleteMC(po) {
            porder = JSON.parse(JSON.stringify(po));

            swal({
                title: "Are you sure to delete following porder...?",
                text: "\n Porder Code : " + porder.pordercode ,
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete)=> {
                if (willDelete) {
                    var responce = httpRequest("/porder","DELETE",porder);
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

        function btnPrintTableMC(porder) {
            //
            var newwindow = window.open();
            formattab = tblPorder.outerHTML;

            newwindow.document.write("" +
                "<html>" +
                "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
                "<link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
                "<body><div style='margin-top: 50px; '> <h1>Porder Details : </h1></div>" +
                "<div>"+ formattab+"</div>"+
                "</body>" +
                "</html>");
            setTimeout(function () {newwindow.print(); newwindow.close();},100) ;
        }

        function sortTable(cind) {
            cindex = cind;

         var cprop = tblPorder.firstChild.firstChild.children[cindex].getAttribute('property');

           if(cprop.indexOf('.') == -1) {
               porders.sort(
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
               porders.sort(
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
            fillTable('tblPorder',porders,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblPorder);
            loadForm();

            if(activerowno!="")selectRow(tblPorder,activerowno,active);



        }