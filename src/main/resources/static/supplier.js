
        window.addEventListener("load", initialize);

        //Initializing Functions

        function initialize() {

            $('[data-toggle="tooltip"]').tooltip();

            btnAdd.addEventListener("click",btnAddMC);
            btnClear.addEventListener("click",btnClearMC);
            btnUpdate.addEventListener("click",btnUpdateMC);

            txtSearchName.addEventListener("keyup",btnSearchMC);
            cmbCategory.addEventListener("change",cmbCategoryCH);
            cmbBrand.addEventListener("change",cmbItemCH);

            privilages = httpRequest("../privilage?module=SUPPLIER","GET");

            // data list for main form combo box
            supplierstatuses = httpRequest("../supplierstatus/list","GET");
            employees = httpRequest("../employee/list","GET");

            // data list for inner form combo box
           brands = httpRequest("../brand/list","GET");
            categories = httpRequest("../category/list","GET");
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
            suppliers = new Array();
          var data = httpRequest("/supplier/findAll?page="+page+"&size="+size+query,"GET");
            if(data.content!= undefined) suppliers = data.content;
            createPagination('pagination',data.totalPages, data.number+1,paginate);
            fillTable('tblSupplier',suppliers,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblSupplier);

            if(activerowno!="")selectRow(tblSupplier,activerowno,active);

        }

        function paginate(page) {
            var paginate;
            if(oldsupplier ==null){
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

        function viewitem(sup,rowno) {

            printsupplier = JSON.parse(JSON.stringify(sup));

            tdnum.setAttribute('value',printsupplier.regnumber);
            tdcompanyname.innerHTML = printsupplier.companyname;
            tdcompanyland.innerHTML = printsupplier.companyland;
            tdcontactname.innerHTML = printsupplier.contactname;
            tdmobile.innerHTML = printsupplier.mobile;
            tdemail.innerHTML = printsupplier.email;
            tdaddress.innerHTML = printsupplier.address;
            tdbrn.innerHTML = printsupplier.brn;
            tdbankname.innerHTML = printsupplier.bankname;
            tdaccountname.innerHTML = printsupplier.accountname;
            tdaccountnumber.innerHTML = printsupplier.accountnumber;
            tdbankbranch.innerHTML = printsupplier.bankbranch;
            tdaddeddate.innerHTML = printsupplier.addeddate;
            tddescription.innerHTML = printsupplier.description;
            tdcreditlimit.innerHTML = printsupplier.creditlimit;
            tdprintsupplierstatus.innerHTML = printsupplier.supplierstatus_id.name;

            var format = printformtable.outerHTML;

            var newwindow=window.open();
            newwindow.document.write("<html>" +
                "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
                "<body><div style='margin-top: 150px'><h1>Supplier Details :</h1></div>" +
                "<div>"+format+"</div>" +
                "<script>printformtable.removeAttribute('style')</script>" +
                "</body></html>");
            setTimeout(function () {newwindow.print(); newwindow.close();},100);
         }

        function loadForm() {
            supplier = new Object();
            oldsupplier = null;

            supplier.supplierItemList = new Array();

            // Get Next Number Form Data Base
            var nextNumber = httpRequest("/supplier/nextnumber", "GET");
            txtNumber.value = nextNumber.regnumber;
            supplier.regnumber = txtNumber.value;
            txtNumber.disabled="disabled";

            fillCombo(cmbSupplierstatus,"Select Supplier Status",supplierstatuses,"name","New");
            supplier.supplierstatus_id = JSON.parse(cmbSupplierstatus.value);

            //Auto fill combo box and auto bind data into object
            fillCombo(cmbAddedemployee,"",employees,"callingname",session.getObject('activeuser').employeeId.callingname);
            cmbAddedemployee.disabled = true;
            supplier.employee_id = JSON.parse(cmbAddedemployee.value);

            dteAddeddate.value  = getCurrentDateTime("date");
            supplier.addeddate = dteAddeddate.value;
            dteAddeddate.disabled = true;
            supplier.ariasamount = 0.00;


            txtCompanyname.value = "";
            txtContactname.value = "";
            txtEmail.value = "";
            txtAddress.value = "";
            txtDescription.value = "";
            txtBrn.value = "";
            txtMobile.value = "";
            txtLand.value = "";

            txtAccountnumber.value = "";
            txtBank.value = "";
            txtBankbranch.value = "";
            txtAccountname.value = "";
            txtCreditlimit.value = "";

            cmbBrand.disabled = "disabled";
            cmbItem.disabled = "disabled";
            cmbSupplierstatus.disabled = "disabled";

            setStyle(initial);
            cmbAddedemployee.style.border=valid;
            dteAddeddate.style.border=valid;
            cmbSupplierstatus.style.border = valid;
            txtNumber.style.border=valid;
            cmbBrand.style.border = valid;

            disableButtons(false, true, true);

            refrehInnerForm();
        }

        function setStyle(style) {

            txtNumber.style.border = style;
            txtCompanyname.style.border = style;
            txtContactname.style.border = style;
            txtEmail.style.border = style;
            txtAddress.style.border = style;
            txtDescription.style.border = style;
            txtBrn.style.border = style;
            txtMobile.style.border = style;
            txtLand.style.border = style;
            
            cmbBrand.style.border = style;
            cmbCategory.style.border = style;
            cmbItem.style.border = style;

            txtAccountnumber.style.border = style;
            txtBank.style.border = style;
            txtBankbranch.style.border = style;
            txtAccountname.style.border = style;
            txtCreditlimit.style.border = style;
            dteAddeddate.style.border = style;
            cmbSupplierstatus.style.border = style;
            cmbAddedemployee.style.border = style;

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
            for(index in suppliers){
                if(suppliers[index].supplierstatus_id.name =="Deleted"){
                    tblSupplier.children[1].children[index].style.color = "#f00";
                    tblSupplier.children[1].children[index].style.border = "2px solid red";
                    tblSupplier.children[1].children[index].lastChild.children[1].disabled = true;
                    tblSupplier.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

                }
            }

        }

        function refrehInnerForm() {

            supplierItem = new Object();
            oldsupplierItem = null;

            fillCombo(cmbCategory,"Select Category",categories,"name","");
            fillCombo(cmbBrand,"Select Brand",brands,"name","");
            fillCombo(cmbItem,"Select Item",items,"itemname","");

            cmbBrand.style.border = initial;
            cmbCategory.style.border = initial;
            cmbItem.style.border = initial;
            cmbItem.disabled = true;

            // for refresh inner table
            fillInnerTable("tblSupplyItem", supplier.supplierItemList,innerModify, innerDelete, innerView);

        }

        function cmbCategoryCH() {

            brandcategory = httpRequest("../brand/listbycategory?categoryid="+JSON.parse(cmbCategory.value).id,"GET");
            fillCombo(cmbBrand,"Select Brand",brandcategory,"name","");
            cmbBrand.disabled = false;
            cmbCategory.style.border = valid;

        }

        function cmbItemCH() {

            branditem = httpRequest("../item/listbybrand?brandid="+JSON.parse(cmbBrand.value).id,"GET");
           fillCombo(cmbItem,"Select Item",branditem,"itemname","");
            cmbItem.disabled = false;
            cmbBrand.style.border = valid;

        }

        function btnInnerAddMC() {

            var extbc = false;
            for (var index in supplier.supplyBrandList){
                if(supplier.supplierItemList[index].item_id.itemname == supplierItem.item_id.itemname){
                    extbc = true;
                    break;
                }
            }

            if(extbc){
                swal({
                    title: "All ready Ext....!",
                    text: "\n\n",
                    icon: "waring", button: false, timer: 1200,
                });
            }else {
                swal({
                    title: "Added Successfully....!",
                    text: "\n\n",
                    icon: "success", button: false, timer: 1200,
                });
                supplier.supplierItemList.push(supplierItem);
                refrehInnerForm();

            }

        }
        
        function innerModify(){}

        //To do
        function btnInnerClearMC() {



        }

        function innerDelete(innerob,ind){
            supplierItem = innerob;
            swal({
                title: "Are you sure to delete followingSupplier Item...?",
                text: "\n Item Name : " + supplierItem.item_id.itemname,
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete)=> {
                if (willDelete) {
                    supplier.supplierItemList.splice(ind,1);
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

            if (supplier.companyname == null)
                errors = errors + "\n" + "Enter Company Name";
            else  addvalue = 1;

            if (supplier.companyland == null)
                errors = errors + "\n" + "Enter Land Number";
            else  addvalue = 1;

            if (supplier.contactname  == null)
                errors = errors + "\n" + "Enter Contact Name";
            else  addvalue = 1;

            if (supplier.mobile  == null)
                errors = errors + "\n" + "Enter Mobil number";
            else  addvalue = 1;

            if (supplier.email  == null)
                errors = errors + "\n" + "Enter Email";
            else  addvalue = 1;

            if (supplier.address  == null)
                errors = errors + "\n" + "Enter Address";
            else  addvalue = 1;

            if (supplier.addeddate  == null)
                errors = errors + "\n" + "Enter Added Date";
            else  addvalue = 1;

            if (supplier.supplierstatus_id == null)
                errors = errors + "\n" + "Supplier Status not Selected";
            else  addvalue = 1;

          return errors;

        }

        function btnAddMC(){
            if(getErrors()==""){
                if(txtBrn.value=="" || txtAccountnumber.value =="" || txtBank.value =="" || txtBankbranch.value ==""
                    || txtAccountname.value =="" || txtCreditlimit.value =="" || txtDescription.value =="" ){
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
                title: "Are you sure to add following supplier...?" ,
                  text :  "\nReg Number : " + supplier.regnumber +
                    "\nCompany Name : " + supplier.companyname +
                    "\nContact Name : " + supplier.contactname  +
                      "\nMobile : " + supplier.mobile +
                      "\nLand : " + supplier.companyland +
                    "\nEmail : " + supplier.email +
                      "\nAddress : " + supplier.address +
                    "\nAdded Date : " + supplier.addeddate +
                    "\nDescription : " + supplier.description +
                    "\nSupplier Status : " + supplier.supplierstatus_id.name,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    var response = httpRequest("/supplier", "POST", supplier);
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

            if(oldsupplier== null && addvalue == ""){
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

        function fillForm(sup,rowno){
            activerowno = rowno;

            if (oldsupplier==null) {
                filldata(sup);
            } else {
                swal({
                    title: "Form has some values, updates values... Are you sure to discard the form ?",
                    text: "\n" ,
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        filldata(sup);
                    }

                });
            }

        }
        
        function filldata(sup) {

            clearSelection(tblSupplier);
            selectRow(tblSupplier,activerowno,active);

            supplier = JSON.parse(JSON.stringify(sup));
            oldsupplier = JSON.parse(JSON.stringify(sup));

            txtNumber.value = supplier.regnumber;
            txtNumber.disabled="disabled";

            txtCompanyname.value = supplier.companyname;
            txtContactname.value = supplier.contactname;
            txtEmail.value = supplier.email;
            txtMobile.value = supplier.mobile;
            txtLand.value = supplier.companyland;
            txtBrn.value = supplier.brn;
            txtAddress.value = supplier.address;
            txtDescription.value = supplier.description;
            txtBank.value = supplier.bankname;
            txtAccountname.value = supplier.accountname;
            txtAccountnumber.value = supplier.accountnumber;
            txtBankbranch.value = supplier.bankbranch;
            txtCreditlimit.value = supplier.creditlimit;
            dteAddeddate.value = supplier.addeddate;

            fillCombo(cmbSupplierstatus, "Select Supplier Status", supplierstatuses, "name", supplier.supplierstatus_id.name);

            disableButtons(true, false, false);
            setStyle(valid);
            changeTab('form');
        }

        function getUpdates() {

            var updates = "";

            if(supplier!=null && oldsupplier!=null) {

                if (supplier.regnumber != oldsupplier.regnumber)
                    updates = updates + "\nReg Number is Changed";

                if (supplier.companyname != oldsupplier.companyname)
                    updates = updates + "\nCompany Name is Changed";

                if (supplier.companyland != oldsupplier.companyland)
                    updates = updates + "\nLand Number is Changed";

                if (supplier.contactname != oldsupplier.contactname)
                    updates = updates + "\nContact Name is Changed";

                if (supplier.mobile != oldsupplier.mobile)
                    updates = updates + "\nMobile Number is Changed";

                if (supplier.email != oldsupplier.email)
                    updates = updates + "\nEmail is Changed";

                if (supplier.address != oldsupplier.address)
                    updates = updates + "\nAddress is Changed";

                if (supplier.brn != oldsupplier.brn)
                    updates = updates + "\nBRN is Changed";

                if (supplier.bankname != oldsupplier.bankname)
                    updates = updates + "\nBank Name is Changed";

                if (supplier.accountname != oldsupplier.accountname)
                    updates = updates + "\nAccount Name is Changed";

                if (supplier.accountnumber != oldsupplier.accountnumber)
                    updates = updates + "\nAccount Number is Changed";

                if (supplier.bankbranch != oldsupplier.bankbranch)
                    updates = updates + "\nBank Branch is Changed";

                if (supplier.addeddate != oldsupplier.addeddate)
                    updates = updates + "\nAdded Date is Changed";

                if (supplier.description != oldsupplier.description)
                    updates = updates + "\nDescription is Changed";

                if (supplier.creditlimit != oldsupplier.creditlimit)
                    updates = updates + "\nCreditlimit is Changed";

                if (supplier.supplierstatus_id.name != oldsupplier.supplierstatus_id.name)
                    updates = updates + "\nSupplier Status is Changed";


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
                        title: "Are you sure to update following supplier details...?",
                        text: "\n"+ getUpdates(),
                        icon: "warning", buttons: true, dangerMode: true,
                    })
                        .then((willDelete) => {
                        if (willDelete) {
                            var response = httpRequest("/supplier", "PUT", supplier);
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

        function btnDeleteMC(sup) {
            supplier = JSON.parse(JSON.stringify(sup));

            swal({
                title: "Are you sure to delete following supplier...?",
                text: "\n Supplier Reg Number : " + supplier.regnumber +
                "\n Supplier Contact Name : " + supplier.contactname,
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete)=> {
                if (willDelete) {
                    var responce = httpRequest("/supplier","DELETE",supplier);
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
                else {   loadForm();
                }

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

       function btnPrintTableMC(supplier) {

            var newwindow=window.open();
            formattab = tblSupplier.outerHTML;

           newwindow.document.write("" +
                "<html>" +
                "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
                "<link rel='stylesheet' href='../plugin/bootstrap/css/bootstrap.min.css'/></head>" +
                "<body><div style='margin-top: 150px; '> <h1>Supplier Details : </h1></div>" +
                "<div>"+ formattab+"</div>"+
               "</body>" +
                "</html>");
           setTimeout(function () {newwindow.print(); newwindow.close();},100) ;
        }

        function sortTable(cind) {
            cindex = cind;

         var cprop = tblSupplier.firstChild.firstChild.children[cindex].getAttribute('property');

           if(cprop.indexOf('.') == -1) {
               suppliers.sort(
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
               suppliers.sort(
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
            fillTable('tblSupplier',suppliers,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblSupplier);
            loadForm();

            if(activerowno!="")selectRow(tblSupplier,activerowno,active);



        }