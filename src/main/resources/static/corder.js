

 

        window.addEventListener("load", initialize);

        //Initializing Functions

        function initialize() {
            $('[data-toggle="tooltip"]').tooltip();

            btnAdd.addEventListener("click",btnAddMC);
            btnClear.addEventListener("click",btnClearMC);
            btnUpdate.addEventListener("click",btnUpdateMC);

           cmbCustomer.addEventListener("change",cmbCustomerCH);
           cmbItem.addEventListener("change",cmbItemCH);
            txtQuantity.addEventListener("keyup",txtQuantityKU);

            txtSearchName.addEventListener("keyup",btnSearchMC);

            privilages = httpRequest("../privilage?module=CORDER","GET");

            // data list for main form combo box
            corderstatuses = httpRequest("../corderstatus/list","GET");
            customers = httpRequest("../customer/list","GET");
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
            corders = new Array();
          var data = httpRequest("/corder/findAll?page="+page+"&size="+size+query,"GET");
            if(data.content!= undefined) porders = data.content;
            createPagination('pagination',data.totalPages, data.number+1,paginate);
            fillTable('tblCorder',porders,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblCorder);

            if(activerowno!="")selectRow(tblCorder,activerowno,active);

        }

        function paginate(page) {
            var paginate;
            if(oldcorder==null){
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

        function viewitem(co,rowno) {

            printco = JSON.parse(JSON.stringify(co));

            tdconum.setAttribute('value',printco.cordercode);
            tdcocustomer.innerHTML = printco.customer_id.contactname;
            tdcoaddeddate.innerHTML = printco.addeddate;
            tdcorequireddate.innerHTML = printco.requireddate;
            tdcodescription.innerHTML = printco.description;
            tdcototalamount.innerHTML = printco.totalamount;
            tdconetamount.innerHTML = printco.netamount;
            tdcorderstatus.innerHTML = printco.corderstatus_id.name;
            tdpoquotation.innerHTML = printco.quotation_id.quotationnumber;

            var format = printformtable.outerHTML;

            var newwindow=window.open();
            newwindow.document.write("<html>" +
                "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
                "<body><div style='margin-top: 150px'><h1>Corder Details :</h1></div>" +
                "<div>"+format+"</div>" +
                "<script>printformtable.removeAttribute('style')</script>" +
                "</body></html>");
            setTimeout(function () {newwindow.print(); newwindow.close();},100);
         }

        function cmbCustomerCH() {
            var x = JSON.parse(cmbCustomer.value).id;
            console.log(x);

            fillCombo3(cmbItem,"Select Item",items,"itemcode","itemname","");

            cmbItem.disabled = false;

        }


        function chkDileveryCH() {

            if(chkDilevery.checked){
                corder.delireq = true;
                $('#rowDilevery').removeAttr('style');

               // txtCustomerName.value = ;
    //txtCustomerName.required= true;
            }else {
                $('#rowDilevery').css('display','none');
                corder.delireq = false;
            }
        }

        function getDeleveryMsg(obpro) {
            let msg = "Not-Required";
            if(obpro){
                msg = "Required";
            }
            return msg;
        }

        function loadForm() {
            corder = new Object();
            oldcorder = null;

            corder.corderItemList = new Array();

            // Get Next Number Form Data Base
            var nextNumber = httpRequest("/corder/nextnumber", "GET");
            txtNumber.value = nextNumber.cordercode;
            corder.cordercode = txtNumber.value;
            txtNumber.disabled="disabled";

            fillCombo(cmbCoStatus,"Select Status",corderstatuses,"name","Ordered");
            corder.corderstatus_id = JSON.parse(cmbCoStatus.value);
            fillCombo3(cmbCustomer,"Select Customer",customers,"contactname","mobile","");

            //Auto fill combo box and auto bind data into object
            fillCombo(cmbEmployee,"",employees,"callingname",session.getObject('activeuser').employeeId.callingname);
            cmbEmployee.disabled = true;
            corder.employee_id = JSON.parse(cmbEmployee.value);

            dteAddedDate.value  = getCurrentDateTime("date");
            corder.addeddate = dteAddedDate.value;
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
            txtNetAmount.value = "0.00";
            txtNetAmount.disabled = true;
            txtDiscount.value = 0.00;
            corder.discountratio =   txtDiscount.value;

            chkDilevery.checked = false;
            $('#chkDilevery').bootstrapToggle('off');
            corder.delireq = false;

            txtDescription.value = "";
            dteRequiredDate.value = "";


             setStyle(initial);
            cmbEmployee.style.border=valid;
            cmbCoStatus.style.border=valid;
            dteAddedDate.style.border=valid;
            txtTotalAmount.style.border=valid;
            txtDiscount.style.border=valid;
            cmbCoStatus.style.border=valid;
            txtNetAmount.style.border=valid;
            txtNumber.style.border=valid;
            cmbCoStatus.style.border=valid;
            txtDiscount.disabled = true;
            cmbCoStatus.disabled = true;
           txtNetAmount.disabled = true;



             disableButtons(false, true, true);

            refrehInnerForm();
        }

        function setStyle(style) {

            txtNumber.style.border = style;
            cmbCustomer.style.border = style;
            dteRequiredDate.style.border = style;
            txtTotalAmount.style.border = style;
            txtNetAmount.style.border = style;
            txtDiscount.style.border = style;
            txtDescription.style.border = style;
            txtAddress.style.border = style;
            cmbCoStatus.style.border = style;
            cmbEmployee.style.border = style;
            dteAddedDate.style.border = style;
            txtCustomerName.style.border = style;
            txtCustomermobile.style.border = style;

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
            for(index in corders){
                if(corders[index].corderstatus_id.name =="Deleted"){
                    tblCorder.children[1].children[index].style.color = "#f00";
                    tblCorder.children[1].children[index].style.border = "2px solid red";
                   tblCorder.children[1].children[index].lastChild.children[1].disabled = true;
                    tblCorder.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

                }
            }

        }

        function refrehInnerForm() {

            corderItem = new Object();
            oldcorderItem = null;
           var totalamount = 0;

            // for refresh inner form
            fillCombo(cmbItem,"Select Item",items,"itemname","");

            txtSalesPrice.disabled = true;
            txtQuantity.value = "";
            txtLineTotal.disabled = true;

            cmbItem.style.border = initial;
            txtSalesPrice.style.border = initial;
            txtQuantity.style.border = initial;
            txtLineTotal.style.border = initial;

            txtSalesPrice.value = "";
            txtQuantity.value = "";
            txtLineTotal.value = "";
            txtTotalAmount.value = "";

            // for refresh inner table
            fillInnerTable("tblCorderItem", corder.corderItemList,innerModify, innerDelete, false);
            if(corder.corderItemList.length != 0){
                for(var index in corder.corderItemList){
                    totalamount = (parseFloat(totalamount) + parseFloat(corder.corderItemList[index].linetotal)).toFixed(2);
                }

                txtTotalAmount.value = totalamount;
                corder.totalamount = txtTotalAmount.value;

               //Camculated net Amount in Discount KU Method
                if(oldcorder != null && corder.totalamount != oldcorder.totalamount){
                    txtTotalAmount.style.border = updated;
                }else {
                    txtTotalAmount.style.border = valid;

                }

            }

            if(txtDiscount.value != 0){

                totalamount = parseFloat(txtTotalAmount.value);
                discountamount = parseFloat(txtDiscount.value);

                netvalue = totalamount * (discountamount/100);
                finalnetamount = totalamount-netvalue;
                txtNetAmount.value = finalnetamount;
                corder.netamount = txtNetAmount.value;
            }else{

                txtNetAmount.value = totalamount;
                corder.netamount = txtNetAmount.value;

            }

        }

        function cmbItemCH() {
            itembatch = httpRequest("../batch/listbyitem?itemid="+JSON.parse(cmbItem.value).id,"GET");
            txtSalesPrice.value = toDecimal(itembatch.salesprice,2) ;
            corderItem.salesprice = parseFloat(txtSalesPrice.value);
            txtSalesPrice.border = valid;

        }


        function txtQuantityKU() {

            if(txtQuantity.value != 0 ){
                txtLineTotal.value = (parseFloat(txtSalesPrice.value) * parseFloat(txtQuantity.value)).toFixed(2);
                corderItem.linetotal = txtLineTotal.value;
                txtLineTotal.style.border=valid;
            }else {
                txtQuantity.style.border = invalid;
                txtLineTotal.value = "";
                corderItem.linetotal = null;
                txtLineTotal.style.border = initial;
                swal({
                    icon: "warning",
                    text: '\n Quantity Cann\'t Be 0   ',
                    button: false,
                    timer: 1500,});
            }

        }

        function btnInnerAddMC() {

            var extbc = false;
            for (var index in corder.corderItemList){
                if(corder.corderItemList[index].item_id.itemname == corderItem.item_id.itemname){
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
                corder.corderItemList.push(corderItem);
                refrehInnerForm();

            }

        }
        
        function innerModify(){}

        function innerDelete(innerob,ind){
            corderItem = innerob;
            swal({
                title: "Are you sure to delete following Customer ordered Item..?",
                text: "\n Item Name : " + corderItem.item_id.itemname +
                    "\n Sales Price : " + corderItem.salesprice +
                    "\n Quantity : " + corderItem.qty,
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete)=> {
                if (willDelete) {
                    corder.corderItemList.splice(ind,1);
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

            if (corder.requireddate  == null)
                errors = errors + "\n" + "Enter Required Date";
            else  addvalue = 1;

            if (corder.corderstatus_id == null)
                errors = errors + "\n" + "Customer order Status not Selected";
            else  addvalue = 1;

            if (corder.customer_id == null)
                errors = errors + "\n" + "Customer not Selected";
            else  addvalue = 1;

            return errors;

        }

        function btnAddMC(){
            if(getErrors()==""){
                if(txtDescription.value=="" || txtAddress.value =="" || txtCustomerName.value =="" || txtCustomermobile.value ==""){
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
                  text :  "\nCustomer Order Code : " + corder.cordercode +
                    "\nAdded Date : " + corder.addeddate +
                    "\nRequired Date : " + corder.requireddate +
                    "\nDescription : " + corder.description +
                    "\nCustomer Order Status : " + corder.corderstatus_id.name +
                    "\nTotal Amount : " + corder.totalamount+
                    "\nNet Amount : " + corder.netamount +
                    "\n Dilevery: " + getDeleveryMsg(corder.delireq),
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    var response = httpRequest("/corder", "POST", corder);
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

            if(oldcorder== null && addvalue == ""){
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

        function fillForm(co,rowno){
            activerowno = rowno;

            if (oldcorder==null) {
                filldata(co);
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
        
        function filldata(co) {

            clearSelection(tblCorder);
            selectRow(tblCorder,activerowno,active);

            corder = JSON.parse(JSON.stringify(co));
            oldcorder = JSON.parse(JSON.stringify(co));

            txtNumber.value = corder.cordercode;
            txtNumber.disabled="disabled";

            txtTotalAmount.value = corder.totalamount;
            txtNetAmount.value = corder.netamount;
            txtDiscount.value = corder.discountratio;
            dteAddeddate.value = corder.addeddate;
            dteRequiredDate.value = corder.requireddate;
            txtDescription.value = corder.description;
            txtAddress.value = corder.address;
            txtCustomerName.value = corder.cp_name;
            txtCustomermobile.value = corder.cp_mobile;
         

            fillCombo(cmbCustomer, "Select Customer", customers, "contactname", corder.customer_id.contactname);
            fillCombo(cmbCoStatus, "Select Corder Status", corderstatuses, "name", corder.corderstatus_id.name);

            disableButtons(true, false, false);
            setStyle(valid);
            changeTab('form');
        }

        function getUpdates() {

            var updates = "";

            if(corder!=null && oldcorder!=null) {


                if (corder.requireddate != oldcorder.requireddate)
                    updates = updates + "\nRequired Date is Changed";

                if (corder.description != oldcorder.description)
                    updates = updates + "\nDescription is Changed";

                if (corder.address != oldcorder.address)
                    updates = updates + "\nAddress is Changed";

                if (corder.totalamount != oldcorder.totalamount)
                    updates = updates + "\nTotal Amount is Changed";

                if (corder.netamount != oldcorder.netamount)
                    updates = updates + "\nNet Amount is Changed";

                if (corder.discountratio != oldcorder.discountratio)
                    updates = updates + "\nDiscount Ratio is Changed";

                if (corder.customer_id.contactname != oldcorder.customer_id.contactname)
                    updates = updates + "\nQuotation is Changed";

                if (corder.corderstatus_id.name != oldcorder.corderstatus_id.name)
                    updates = updates + "\nCustomer order Status is Changed";

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
                            var response = httpRequest("/corder", "PUT", corder);
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

        function btnDeleteMC(co) {
            corder = JSON.parse(JSON.stringify(co));

            swal({
                title: "Are you sure to delete following Customer Order...?",
                text: "\n Order Code : " + corder.cordercode ,
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete)=> {
                if (willDelete) {
                    var responce = httpRequest("/corder","DELETE",corder);
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

       function btnPrintTableMC(corder) {

            var newwindow=window.open();
            formattab = tblCorder.outerHTML;

           newwindow.document.write("" +
                "<html>" +
                "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
                "<link rel='stylesheet' href='../plugin/bootstrap/css/bootstrap.min.css'/></head>" +
                "<body><div style='margin-top: 150px; '> <h1>Corder Details : </h1></div>" +
                "<div>"+ formattab+"</div>"+
               "</body>" +
                "</html>");
           setTimeout(function () {newwindow.print(); newwindow.close();},100) ;
        }

        function sortTable(cind) {
            cindex = cind;

         var cprop = tblCorder.firstChild.firstChild.children[cindex].getAttribute('property');

           if(cprop.indexOf('.') == -1) {
               corders.sort(
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
               corders.sort(
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
            fillTable('tblCorder',corders,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblCorder);
            loadForm();

            if(activerowno!="")selectRow(tblCorder,activerowno,active);



        }