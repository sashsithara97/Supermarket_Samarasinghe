

        window.addEventListener("load", initialize);

        //Initializing Functions

        function initialize() {

            $('[data-toggle="tooltip"]').tooltip();

            btnAdd.addEventListener("click",btnAddMC);
            btnClear.addEventListener("click",btnClearMC);
            btnUpdate.addEventListener("click",btnUpdateMC);
            txtSearchName.addEventListener("keyup",btnSearchMC);
            cmbSupplier.addEventListener("change",cmbSupplierCH);

            privilages = httpRequest("../privilage?module=QUOTATIONREQUEST","GET");

            qrstatuses = httpRequest("../qrstatus/list","GET");
            allsuppliers = httpRequest("../supplier/list","GET");
            suppliers = httpRequest("../supplier/listbysupplierstatus","GET");
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
       /*     txtSearchName.value="";
            txtSearchName.style.background = "";*/

            //Table Area
            activerowno = "";
            activepage = 1;
            var query = "&searchtext=";
            loadTable(1,cmbPageSize.value,query);
        }

        function loadTable(page,size,query) {
            page = page - 1;
            qrequests = new Array();
          var data = httpRequest("/quotationrequest/findAll?page="+page+"&size="+size+query,"GET");
            if(data.content!= undefined) qrequests = data.content;
            createPagination('pagination',data.totalPages, data.number+1,paginate);
            fillTable('tblQRequest',qrequests,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblQRequest);

            if(activerowno!="")selectRow(tblQRequest,activerowno,active);

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
              
       function viewitem(qrequest,rowno) {

            printquotationrequest = JSON.parse(JSON.stringify(qrequest));

            tdnum.setAttribute('value',printquotationrequest.qrcode);
            tdaddeddate.innerHTML = printquotationrequest.addeddate;
            tdrequireddate.innerHTML = printquotationrequest.requireddate;
            tddesc.innerHTML = printquotationrequest.description;
            tdqrstatus.innerHTML = printquotationrequest.qrstatus_id.name;
            tdsupplier.innerHTML = printquotationrequest.supplier_id.companyname;
           fillInnerTable("tblinnerQRItem", printquotationrequest.quotationrequestItemList,innerModify, innerDelete,false);


            var format = printformtable.outerHTML;

           var newwindow=window.open();

           newwindow.document.write("<html>" +
               "<head><link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
               "<body><div style='margin-top: 50px'><h1>Quotation Request Details :</h1></div>" +
               "<div>"+format+"</div>" +
               "<script>printformtable.removeAttribute('style')</script>" +
               "</body></html>");

           //open wena window eka 100mili seconds open wela thiyenawa new window eka print kiyana eka ain kalama
           //miliseconds 100kin print preview eka close wenawa
           setTimeout(function () {newwindow.print(); newwindow.close();},100);
         }

        function loadForm() {

            quotationrequest = new Object();
            oldquotationrequest = null;

            quotationrequest.quotationrequestItemList = new Array();

            fillCombo(cmbQRStatus,"Select QR Status",qrstatuses,"name","Requested");
            quotationrequest.qrstatus_id = JSON.parse(cmbQRStatus.value);

            fillCombo(cmbSupplier,"Select Supplier",suppliers,"companyname","");
            //Auto fill combo box and auto bind data into object
            fillCombo(cmbAddedEmployee,"",employees,"callingname",session.getObject('activeuser').employeeId.callingname);

            cmbAddedEmployee.disabled = true;
            quotationrequest.employee_id = JSON.parse(cmbAddedEmployee.value);

            //Get next number from database
            var nextNumber = httpRequest("/quotationrequest/nextnumber", "GET");
            txtQrCode.value = nextNumber.qrcode;
            quotationrequest.qrcode = txtQrCode.value;
            txtQrCode.disabled="disabled";

            dteAddeddate.value  = getCurrentDateTime("date");
            quotationrequest.addeddate = dteAddeddate.value;
            dteAddeddate.disabled = true;

            dteRequireddate.min  = getCurrentDateTime("date");
            let maxdate = new Date();
           maxdate.setDate(maxdate.getDate() + 14);
            dteRequireddate.max = maxdate.getFullYear()+"-"+ getmonthdate(maxdate);

           quotationrequest.requireddate = dteRequireddate.value;

            txtDescription.value = "";
            setStyle(initial);
            dteAddeddate.style.border=valid;
            txtQrCode.style.border=valid;
            cmbQRStatus.style.border=valid;
            cmbQRStatus.disabled = true;
            cmbAddedEmployee.style.border=valid;
            cmbItem.disabled = true;
            cmbSupplier.disabled=false;
            dteRequireddate.value = "";

            disableButtons(false, true, true);

            refrehInnerForm();
        }

        function cmbSupplierCH(){

            itemsbysupplier = httpRequest("../item/itemlistbysupplier?supplierid="+JSON.parse(cmbSupplier.value).id,"GET");
            fillCombo(cmbItem,"Select Item",itemsbysupplier,"itemname","");
            cmbItem.disabled = false;

        }

        function refrehInnerForm() {

            quotationrequestItem = new Object();
            oldquotationrequestItem = null;

            if(cmbSupplier.value != ""){
                cmbSupplierCH();

            }else{
                fillCombo(cmbItem,"Select Item",[],"itemname","");

            }


            quotationrequestItem.requested = true;
            quotationrequestItem.received = false;

            cmbItem.style.border = initial;
            // for refresh inner table
            fillInnerTable("tblQRItem", quotationrequest.quotationrequestItemList,innerModify, innerDelete,false);
        }

        function innerModify(innerob , ind){

                   }

         function innerDelete(innerob,ind){
            quotationrequestItem = innerob;
            swal({
                title: "Are you sure to delete following Requested Items...?",
                text: "\n Item Name : " + quotationrequestItem.item_id.itemname ,
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete)=> {
                if (willDelete) {
                    quotationrequest.quotationrequestItemList.splice(ind,1);
                    swal({
                        title: "Removed Successfully....!",
                        text: "\n\n",
                        icon: "success", button: false, timer: 1200,
                    });
                    refrehInnerForm();

                }
            });

        }

        function getDuplicate() {
            var extbc = false;
            for (var index in quotationrequest.quotationrequestItemList){
                if(quotationrequest.quotationrequestItemList[index].item_id.itemname == quotationrequestItem.item_id.itemname){
                    extbc = true;
                    break;
                }
            }

            return extbc;
        }

        function innerClear(){
            swal({
                title: "Form has some values, updates values... Are you sure to discard the form ?",
                text: "\n" ,
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    refrehInnerForm();
                }

            });


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
                quotationrequest.quotationrequestItemList.push(quotationrequestItem);
                refrehInnerForm();

            }

        }

        function setStyle(style) {
            txtQrCode.style.border = style;
            dteAddeddate.style.border = style;
            dteRequireddate.style.border = style;
            txtDescription.style.border = style;
            cmbSupplier.style.border = style;
            cmbQRStatus.style.border = style;
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
            for(index in qrequests){
                if(qrequests[index].qrstatus_id.name =="Deleted"){
                    tblQRequest.children[1].children[index].style.color = "#f00";
                    tblQRequest.children[1].children[index].style.border = "2px solid red";
                    tblQRequest.children[1].children[index].lastChild.children[1].disabled = true;
                    tblQRequest.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

                }
            }

        }

        function getErrors() {

            var errors = "";
            addvalue = "";

        if (quotationrequest.requireddate == null)
                errors = errors + "\n" + "Required date not entered";
            else  addvalue = 1;

            if (quotationrequest.qrstatus_id == null)
                errors = errors + "\n" + "Status Not Selected";
            else  addvalue = 1;

            if (quotationrequest.supplier_id == null)
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
                title: "Are you sure to add following Quotation Request...?" ,
                  text :  "\nQR Code : " + quotationrequest.qrcode +
                    "\nAdded Date : " + quotationrequest.addeddate +
                    "\nRequired Date : " + quotationrequest.requireddate +
                    "\nQuotationrequest Status : " + quotationrequest.qrstatus_id.name +
                    "\nSupplier : " + quotationrequest.supplier_id.companyname,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    var response = httpRequest("/quotationrequest", "POST", quotationrequest);
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
                        activerowno=1;
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

            if(oldquotationrequest == null && addvalue == ""){
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

        function fillForm(qrequest,rowno){
            activerowno = rowno;

            if (oldquotationrequest==null) {
                filldata(qrequest);
            } else {
                swal({
                    title: "Form has some values, updates values... Are you sure to discard the form ?",
                    text: "\n" ,
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        filldata(qrequest);
                    }

                });
            }

        }

        function filldata(qrequest) {

            clearSelection(tblQRequest);
            selectRow(tblQRequest,activerowno,active);

            quotationrequest = JSON.parse(JSON.stringify(qrequest));
            oldquotationrequest = JSON.parse(JSON.stringify(qrequest));

            txtQrCode.value = quotationrequest.qrcode;
            txtDescription.value = quotationrequest.description;
            dteAddeddate.value = quotationrequest.addeddate;
            dteRequireddate.value = quotationrequest.requireddate;

            fillCombo(cmbSupplier, "Select Supplier ",allsuppliers, "companyname", quotationrequest.supplier_id.companyname);
            cmbSupplier.disabled = true;
            fillCombo(cmbQRStatus, "Select Status",qrstatuses, "name", quotationrequest.qrstatus_id.name);
            cmbQRStatus.disabled = false;

            let currentDate = new Date();
            let requireDate =  new Date(quotationrequest.requireddate);


            //Required date eka current date ekata wada adui nm apata edit karanna bari wenna oni
            //eka thama me kle

            if(requireDate.getTime() < currentDate.getTime()){
                dteRequireddate.disabled = true;

            }else{
                dteRequireddate.disabled = false;
            }


            refrehInnerForm();
            cmbSupplierCH();

            disableButtons(true, false, false);
            setStyle(valid);
            changeTab('form');
        }

        function getUpdates() {

            var updates = "";

            if(quotationrequest!=null && oldquotationrequest!=null) {

                if (quotationrequest.qrcode != oldquotationrequest.qrcode)
                    updates = updates + "\nRequest Code is Changed";

                if (quotationrequest.addeddate != oldquotationrequest.addeddate)
                    updates = updates + "\nAdded Date is Changed";

                if (quotationrequest.requireddate != oldquotationrequest.requireddate)
                    updates = updates + "\nRequired Date is Changed";

                if (quotationrequest.description != oldquotationrequest.description)
                    updates = updates + "\nDescription is Changed";

                if (quotationrequest.qrstatus_id.name != oldquotationrequest.qrstatus_id.name)
                    updates = updates + "\nQuotation request Status is Changed";

                if (quotationrequest.supplier_id.name != oldquotationrequest.supplier_id.name)
                    updates = updates + "\nSupplier is Changed";

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
                        title: "Are you sure to update following Quotation Request details...?",
                        text: "\n"+ getUpdates(),
                        icon: "warning", buttons: true, dangerMode: true,
                    })
                        .then((willDelete) => {
                        if (willDelete) {
                            var response = httpRequest("/quotationrequest", "PUT",quotationrequest);
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
                            else {
                            swal({
                                title: 'Failed to Update as',icon: "error",
                                text: '\n '+ response,
                                button: true});

                            }

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

        function btnDeleteMC(qrequest) {
            quotationrequest = JSON.parse(JSON.stringify(qrequest));

            swal({
                title: "Are you sure to delete following Quotation Request...?",
                text: "\n Quotation Request Code : " + quotationrequest.qrcode ,
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete)=> {
                if (willDelete) {
                    var responce = httpRequest("/quotationrequest","DELETE",quotationrequest);
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

       function btnPrintTableMC(quotationrequest) {

            var newwindow=window.open();
            formattab = tblQRequest.outerHTML;

           newwindow.document.write("" +
                "<html>" +
                "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
                "<link rel='stylesheet' href='../plugin/bootstrap/css/bootstrap.min.css'/></head>" +
                "<body><div style='margin-top: 150px; '> <h1>Quotation Request Details : </h1></div>" +
                "<div>"+ formattab+"</div>"+
               "</body>" +
                "</html>");
           setTimeout(function () {newwindow.print(); newwindow.close();},100) ;
        }

        function sortTable(cind) {
            cindex = cind;

         var cprop = cmbQRStatus.firstChild.firstChild.children[cindex].getAttribute('property');

           if(cprop.indexOf('.') == -1) {
               qrequests.sort(
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
               qrequests.sort(
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
            fillTable('tblQRequest',qrequests,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblQRequest);
            loadForm();

            if(activerowno!="")selectRow(tblQRequest,activerowno,active);



        }