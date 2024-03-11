


        window.addEventListener("load", initialize);

        //Initializing Functions

        function initialize() {

            $('[data-toggle="tooltip"]').tooltip();

            btnAdd.addEventListener("click",btnAddMC);
            btnClear.addEventListener("click",btnClearMC);
            btnUpdate.addEventListener("click",btnUpdateMC);

           cmbSupplier.addEventListener("change",cmbSupplierCH);
           cmbItem.addEventListener("change",cmbItemCH);
           cmbBatch.addEventListener("change",cmbBatchCH);
            txtQuantity.addEventListener("keyup",txtQuantityKU);

            txtSearchName.addEventListener("keyup",btnSearchMC);

            privilages = httpRequest("../privilage?module=SUPPLIERRETURN","GET");

            // data list for main form combo box
            allsuppliers = httpRequest("../supplier/list","GET");

            // data list for Selected Suppliers
            suppliers = httpRequest("../supplier/listbysupplierstatus","GET");
            returnreasons = httpRequest("../returnreasion/list","GET");

            employees = httpRequest("../employee/list","GET");
            supplierreturnstatuses =  httpRequest("../srstatus/list","GET");

            // data list for inner form combo box
            items = httpRequest("../item/list","GET");
            batches = httpRequest("../batch/list","GET");

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
            supplierreturns = new Array();
          var data = httpRequest("/supplierreturn/findAll?page="+page+"&size="+size+query,"GET");
            if(data.content!= undefined) supplierreturns = data.content;
            createPagination('pagination',data.totalPages, data.number+1,paginate);
            fillTable('tblSupplierReturn',supplierreturns,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblSupplierReturn);

            if(activerowno!="")selectRow(tblSupplierReturn,activerowno,active);

        }

        function paginate(page) {
            var paginate;
            if(oldsupplierreturn==null){
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

        function viewitem(supreturn,rowno) {

            printsupreturn = JSON.parse(JSON.stringify(supreturn));

            tdsrnum.setAttribute('value', printsupreturn.supplierreturnno);
            tdsrreturntotalamount.innerHTML =  printsupreturn.returntotalamount;
            tdsraddeddate.innerHTML =  printsupreturn.addeddate;
            tdsrdescription.innerHTML =  printsupreturn.description;
            tdsupreturnstatus.innerHTML =  printsupreturn.srstatus_id.name;

            var format = printformtable.outerHTML;

            var newwindow=window.open();
            newwindow.document.write("<html>" +
                "<head><link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
                "<body><div style='margin-top: 50px'><h1>Supplier Return Details :</h1></div>" +
                "<div>"+format+"</div>" +
                "<script>printformtable.removeAttribute('style')</script>" +
                "</body></html>");
            setTimeout(function () {newwindow.print(); newwindow.close();},100);

         }

        function cmbSupplierCH() {

            supplieritems = httpRequest("../item/listbysupplier?supplierid="+JSON.parse(cmbSupplier.value).id,"GET");
             fillCombo(cmbItem,"Select Item",supplieritems,"itemname","");
            cmbItem.style.border = valid;
            cmbItem.disabled = false;

         }

        function cmbItemCH() {
            itembatches = httpRequest("../batch/listbysupplieranditem?itemid="+JSON.parse(cmbItem.value).id + "&supplierid="+JSON.parse(cmbSupplier.value).id ,"GET");
        fillCombo(cmbBatch,"Select Batch",itembatches,"batchcode","");
        cmbBatch.disabled = false;
            }

        function cmbBatchCH() {

            txtPurchasePrice.value =  JSON.parse(cmbBatch.value).purchaseprice;
            supplierReturnBatch.purchaseprice = txtPurchasePrice.value;

            //Batch object eke thiyena eka thamai avaqty
            txtQuantity.value =  JSON.parse(cmbBatch.value).avaqty;
            supplierReturnBatch.qty = txtQuantity.value;

            txtQuantityKU();
            txtQuantity.disabled = false ;

        }

        function txtQuantityKU() {

            if(txtQuantity.value > 0 && txtQuantity.value <= JSON.parse(cmbBatch.value).avaqty){
                txtLineTotal.value = (parseFloat(txtPurchasePrice.value) * parseFloat(txtQuantity.value)).toFixed(2);
                supplierReturnBatch.linetotal = txtLineTotal.value;
                txtLineTotal.style.border=valid;
            }else {
                txtQuantity.style.border = invalid;
                txtLineTotal.value = "";
                supplierReturnBatch.linetotal = null;
                txtLineTotal.style.border = initial;
                swal({
                    icon: "warning",
                    text: '\n Quantity Cann\'t Be 0   ',
                    button: false,
                    timer: 1500,});
            }

        }


         /*    function txtQuantityKU() {
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

            }*/

        function loadForm() {

            supplierreturn = new Object();
            oldsupplierreturn = null;

            supplierreturn.supplierReturnBatchList = new Array();

            // Get Next Number Form Data Base
            var nextNumber = httpRequest("/supplierreturn/nextnumber", "GET");
            txtReturnCode.value = nextNumber.supplierreturnno;
            supplierreturn.supplierreturnno = txtReturnCode.value;
            txtReturnCode.disabled="disabled";

            fillCombo(cmbSupplier,"Select Supplier",suppliers,"companyname","");
            fillCombo(cmbReturnStatus,"Select Return Status",supplierreturnstatuses,"name","Pending");
            cmbReturnStatus.disabled = true;
            supplierreturn.srstatus_id = JSON.parse(cmbReturnStatus.value);
            //Auto fill combo box and auto bind data into object
            fillCombo(cmbEmployee,"",employees,"callingname",session.getObject('activeuser').employeeId.callingname);
            cmbEmployee.disabled = true;
            supplierreturn.employee_id = JSON.parse(cmbEmployee.value);

            dteAddedDate.value  = getCurrentDateTime("date");
            supplierreturn.addeddate = dteAddedDate.value;
            dteAddedDate.disabled = true;

            txtDescription.value = "";
            txtTotalAmount.value ="";
            txtTotalAmount.disabled =true;

            setStyle(initial);
            cmbEmployee.style.border=valid;
            dteAddedDate.style.border=valid;
            txtReturnCode.style.border=valid;
            cmbReturnStatus.style.border=valid;

            cmbItem.disabled = "disabled";
            cmbBatch.disabled = "disabled";

             disableButtons(false, true, true);

           refrehInnerForm();
        }

        function setStyle(style) {

            txtReturnCode.style.border = style;
            cmbSupplier.style.border = style;
            dteAddedDate.style.border = style;
            txtDescription.style.border = style;
            cmbReturnStatus.style.border = style;
            cmbEmployee.style.border = style;
            txtTotalAmount.style.border = style;

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
            for(index in supplierreturns){

                tblSupplierReturn.children[1].children[index].lastChild.children[0].style.display = "none";
                if(supplierreturns[index].srstatus_id.name =="Deleted"){
                    tblSupplierReturn.children[1].children[index].style.color = "#f00";
                    tblSupplierReturn.children[1].children[index].style.border = "2px solid red";
                    tblSupplierReturn.children[1].children[index].lastChild.children[1].disabled = true;
                    tblSupplierReturn.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

                }
            }

        }

        function refrehInnerForm() {

            supplierReturnBatch = new Object();
            oldsupplierReturnBatch = null;
           var totalamount = 0;

            // for refresh inner form
            fillCombo(cmbItem,"Select Item",items,"itemname","");
            fillCombo(cmbReturnReason,"Select Return Reason",returnreasons,"name","");
            fillCombo(cmbBatch,"Select Batch",batches,"batchcode","");

            txtPurchasePrice.disabled = true;
            txtQuantity.disabled = true;
            txtLineTotal.disabled = true;

            cmbItem.style.border = initial;
            cmbReturnReason.style.border = initial;
            cmbBatch.style.border = initial;
            txtPurchasePrice.style.border = initial;
            txtQuantity.style.border = initial;
            txtLineTotal.style.border = initial;

            txtPurchasePrice.value = "";
            txtQuantity.value = "";
            txtLineTotal.value = "";

            // for refresh inner table
            fillInnerTable("tblSupplierBatch",supplierreturn.supplierReturnBatchList,innerModify, innerDelete, false);

            if(supplierreturn.supplierReturnBatchList.length != 0){
                for(var index in supplierreturn.supplierReturnBatchList){
                    totalamount = (parseFloat(totalamount) + parseFloat(supplierreturn.supplierReturnBatchList[index].linetotal)).toFixed(2);
                }

                txtTotalAmount.value = totalamount;
                supplierreturn.returntotalamount = txtTotalAmount.value;
                if(oldsupplierreturn != null && supplierreturn.returntotalamount != oldsupplierreturn.returntotalamount){
                    txtTotalAmount.style.border = updated;
                }else {
                    txtTotalAmount.style.border = valid;
                }
            }

        }
        
        function btnInnerAddMC() {

            var extbc = false;
            for (var index in supplierreturn.supplierReturnBatchList){
                if(supplierreturn.supplierReturnBatchList[index].item_id.itemname == supplierReturnBatch.item_id.itemname){
                    extbc = true;
                    break;
                }
            }

            if(extbc){
                swal({
                    title: "All ready Exist....!",
                    text: "\n\n",
                    icon: "waring", button: false, timer: 1200,
                });
            }else {
                swal({
                    title: "Added Successfully....!",
                    text: "\n\n",
                    icon: "success", button: false, timer: 1200,
                });
                supplierreturn.supplierReturnBatchList.push(supplierReturnBatch);
                refrehInnerForm();

            }

        }
        
        function innerModify(){}

        function innerDelete(innerob,ind){
            supplierReturnBatch = innerob;
            swal({
                title: "Are you sure to delete following Supplier Batch..?",
                text: "\n  Item Name : " + supplierReturnBatch.item_id.itemname +
                    "\n Purchase Price : " + supplierReturnBatch.purchaseprice +
                    "\n Quantity : " + supplierReturnBatch.qty,
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

            if (supplierreturn.addeddate  == null)
                errors = errors + "\n" + "Enter Added Date";
            else  addvalue = 1;

            if (supplierreturn.returntotalamount  == null)
                errors = errors + "\n" + "Enter Total Amount";
            else  addvalue = 1;

            if (supplierreturn.supplier_id == null)
                errors = errors + "\n" + "Supplier Status not Selected";
            else  addvalue = 1;

            if (supplierreturn.srstatus_id == null)
                errors = errors + "\n" + "Return Status not Selected";
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
                title: "Are you sure to add following Supplier Return items...?" ,
                  text :  "\nSupplier Return Code : " + supplierreturn.supplierreturnno +
                    "\nAdded Date : " + supplierreturn.addeddate +
                    "\n Total Amount : " + supplierreturn.returntotalamount +
                    "\nReturn Status : " + supplierreturn.srstatus_id.name,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    var response = httpRequest("/supplierreturn", "POST", supplierreturn);
                    if (response == "0") {
                        swal({
                            position: 'center',
                            icon: 'success',
                            title: 'Your work has been Done \n Save SuccessFully..!',
                            text: '\n',
                            button: false,
                            timer: 1200
                        });
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

            if(oldsupplierreturn== null && addvalue == ""){
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

        function fillForm(sr,rowno){

            activerowno = rowno;

            if (oldporder==null) {
                filldata(sr);
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
        
        function filldata(sr) {

            clearSelection(tblSupplierReturn);
            selectRow(tblSupplierReturn,activerowno,active);

            supplierreturn = JSON.parse(JSON.stringify(sr));
            oldsupplierreturn = JSON.parse(JSON.stringify(sr));

            txtNumber.value = porder.pordercode;
            txtNumber.disabled="disabled";

            txtReturnCode.value = supplierreturn.supplierreturnno;
            dteAddeddate.value = supplierreturn.addeddate;
            txtTotalAmount.value = supplierreturn.returntotalamount;
            txtDescription.value = supplierreturn.description;

            fillCombo(cmbSupplier, "Select Supplier",suppliers, "companyname", supplierreturn.quotation_id.quotationnumber);
            fillCombo(cmbReturnStatus, "Select Return Status",supplierreturnstatuses, "name", supplierreturn.porderstatus_id.name);

            disableButtons(true, false, false);
            setStyle(valid);
            changeTab('form');
        }

        function getUpdates() {

            var updates = "";

            if(supplierreturn!=null && oldsupplierreturn!=null) {


                if (supplierreturn.supplierreturnno != oldsupplierreturn.supplierreturnno)
                    updates = updates + "\nSupplierreturn Code is Changed";

                if (supplierreturn.addeddate != oldsupplierreturn.addeddate)
                    updates = updates + "\nAdded Date is Changed";

                if (supplierreturn.returntotalamount != oldsupplierreturn.returntotalamount)
                    updates = updates + "\nReturn Total Amount is Changed";

                if (supplierreturn.description != oldsupplierreturn.description)
                    updates = updates + "\nDescription is Changed";

                if (supplierreturn.supplier_id.companyname != oldsupplierreturn.supplier_id.companyname)
                    updates = updates + "\nSupplier is Changed";

                if (supplierreturn.srstatus_id.name != oldsupplierreturn.srstatus_id.name)
                    updates = updates + "\nReturn Status is Changed";

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
                        title: "Are you sure to update following Supplier Return details...?",
                        text: "\n"+ getUpdates(),
                        icon: "warning", buttons: true, dangerMode: true,
                    })
                        .then((willDelete) => {
                        if (willDelete) {
                            var response = httpRequest("/supplierreturn", "PUT", supplierreturn);
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

        function btnDeleteMC(sr) {

            supplierreturn = JSON.parse(JSON.stringify(sr));

            swal({
                title: "Are you sure to delete following Supplier Return...?",
                text: "\n Return Code : " + supplierreturn.supplierreturnno,
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete)=> {
                if (willDelete) {
                    var responce = httpRequest("/supplierreturn","DELETE",supplierreturn);
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

       function btnPrintTableMC(supplierreturn) {

            var newwindow=window.open();
            formattab = tblSupplierReturn.outerHTML;

           newwindow.document.write("" +
                "<html>" +
                "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
                "<link rel='stylesheet' href='../plugin/bootstrap/css/bootstrap.min.css'/></head>" +
                "<body><div style='margin-top: 150px; '> <h1>Supplier Return Details : </h1></div>" +
                "<div>"+ formattab+"</div>"+
               "</body>" +
                "</html>");
           setTimeout(function () {newwindow.print(); newwindow.close();},100) ;
        }

        function sortTable(cind) {

            cindex = cind;
         var cprop = tblSupplierReturn.firstChild.firstChild.children[cindex].getAttribute('property');

           if(cprop.indexOf('.') == -1) {
               supplierreturns.sort(
                   function(a, b) {
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
               supplierreturns.sort(
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
            fillTable('tblSupplierReturn',tblSupplierReturn,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblSupplierReturn);
            loadForm();

            if(activerowno!="")selectRow(tblSupplierReturn,activerowno,active);



        }