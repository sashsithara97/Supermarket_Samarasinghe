

 

        window.addEventListener("load", initialize);

        //Initializing Functions

        function initialize() {
            $('[data-toggle="tooltip"]').tooltip();

            btnAdd.addEventListener("click",btnAddMC);
            btnClear.addEventListener("click",btnClearMC);
            btnUpdate.addEventListener("click",btnUpdateMC);
            txtSearchName.addEventListener("keyup",btnSearchMC);

            privilages = httpRequest("../privilage?module=CUSTOMER","GET");
    
            customerStatuses = httpRequest("../customerStatus/list","GET");
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
            customers = new Array();
          var data = httpRequest("/customer/findAll?page="+page+"&size="+size+query,"GET");
            if(data.content!= undefined) customers = data.content;
            createPagination('pagination',data.totalPages, data.number+1,paginate);
            fillTable('tblCustomer',customers,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblCustomer);

            if(activerowno!="")selectRow(tblCustomer,activerowno,active);

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

        function viewitem(cust,rowno) {

            printcustomer = JSON.parse(JSON.stringify(cust));

            tdnum.setAttribute('value',printcustomer.regno);
            tdfname.innerHTML = printcustomer.fullname;
            tdcname.innerHTML = printcustomer.contactname;
            tdnic.innerHTML = printcustomer.nic;
            tdaddress.innerHTML = printcustomer.address;
            tdmobile.innerHTML = printcustomer.mobile;
            tdland.innerHTML = printcustomer.land;
            tdaddeddate.innerHTML = printcustomer.addeddate;
            tddesc.innerHTML = printcustomer.description;

            tdcstatus.innerHTML = printcustomer.customerstatus_id.name;

            var format = printformtable.outerHTML;

            var newwindow=window.open();
            newwindow.document.write("<html>" +
                "<head><link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
                "<body><div style='margin-top: 50px'><h1>Customer Details :</h1></div>" +
                "<div>"+format+"</div>" +
                "<script>printformtable.removeAttribute('style')</script>" +
                "</body></html>");
            setTimeout(function () {newwindow.print(); newwindow.close();},100);
         }

        function loadForm() {
            customer = new Object();
            oldcustomer = null;

             fillCombo(cmbStatus,"Select Customer Status",customerStatuses,"name","Available");
            customer.customerstatus_id = JSON.parse(cmbStatus.value);
            //Auto fill combo box and auto bind data into object
            fillCombo(cmbAddedEmployee,"",employees,"callingname",session.getObject('activeuser').employeeId.callingname);
            cmbAddedEmployee.disabled = true;
            customer.employee_id = JSON.parse(cmbAddedEmployee.value);

            dteAddeddate.value  = getCurrentDateTime("date");
            customer.addeddate = dteAddeddate.value;
            dteAddeddate.disabled = true;

            // Get Next Number Form Data Base
            var nextNumber = httpRequest("/customer/nextnumber", "GET");
            txtCode.value = nextNumber.regno;
            customer.regno = txtCode.value;

            txtContactname.value = "";
            txtFullname.value = "";
            txtDescription.value = "";
            txtNIC.value = "";
            txtMobile.value = "";
            txtLand.value = "";
            txtAddress.value = "";
            txtEmail.value = "";
            txtPoint.value = 0.00;
            customer.point =  txtPoint.value;

             setStyle(initial);
            dteAddeddate.style.border=valid;
            cmbStatus.style.border=valid;
            txtCode.style.border=valid;
            txtPoint.style.border=valid;
            cmbStatus.disabled = true;
            txtPoint.disabled = true;
            txtCode.disabled = true;
            cmbAddedEmployee.style.border=valid;

            disableButtons(false, true, true);
        }

        function setStyle(style) {
            txtCode.style.border = style;
            txtContactname.style.border = style;
            txtFullname.style.border = style;
            txtDescription.style.border = style;
            txtNIC.style.border = style;
            txtMobile.style.border = style;
            txtLand.style.border = style;
            txtAddress.style.border = style;
            txtEmail.style.border = style;
            txtPoint.style.border = style;
            cmbStatus.style.border = style;
            dteAddeddate.style.border = style;
            
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
            for(index in customers){
                if(customers[index].customerstatus_id.name =="Deleted"){
                    tblCustomer.children[1].children[index].style.color = "#f00";
                    tblCustomer.children[1].children[index].style.border = "2px solid red";
                    tblCustomer.children[1].children[index].lastChild.children[1].disabled = true;
                    tblCustomer.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

                }
            }

        }


        function getErrors() {

            var errors = "";
            addvalue = "";

            if (customer.fullname == null)
                errors = errors + "\n" + "Enter Customer Full Name ";
            else  addvalue = 1;

            if (customer.nic == null)
                errors = errors + "\n" + "Enter Customer nic ";
            else  addvalue = 1;

            if (customer.contactname == null)
                errors = errors + "\n" + "Enter Customer Contact Name ";
            else  addvalue = 1;

            if (customer.address == null)
                errors = errors + "\n" + "Enter Customer Address ";
            else  addvalue = 1;

            if (customer.mobile == null)
                errors = errors + "\n" + "Enter Customer Mobile number";
            else  addvalue = 1;

            if (customer.land == null)
                errors = errors + "\n" + "Enter Customer Land number";
            else  addvalue = 1;

            if (customer.email == null)
                errors = errors + "\n" + "Enter Customer Email";
            else  addvalue = 1;

            return errors;

        }

        function btnAddMC(){
            if(getErrors()==""){
                if(txtLand.value=="" || txtDescription.value =="" || txtPoint.value ==""){
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
                title: "Are you sure to add following Customer...?" ,
                  text :  "\nReg Number : " + customer.regno +
                    "\nFull Name : " + customer.fullname +
                    "\nContact Name : " + customer.contactname +
                    "\nNIC : " + customer.nic +
                    "\nAddress : " + customer.address +
                    "\nMobile : " + customer.mobile +
                    "\nLand : " + customer.land +
                      "\nEmail : " + customer.email +
                      "\nPoints : " + customer.point +
                    "\nAdded Date : " + customer.addeddate +
                    "\nDescription : " + customer.description +
                    "\nCustomer Status : " + customer.customerstatus_id.name,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    var response = httpRequest("/customer", "POST", customer);
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

            if(oldcustomer == null && addvalue == ""){
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

        function fillForm(cust,rowno){
            activerowno = rowno;

            if (oldcustomer==null) {
                filldata(cust);
            } else {
                swal({
                    title: "Form has some values, updates values... Are you sure to discard the form ?",
                    text: "\n" ,
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        filldata(cust);
                    }

                });
            }

        }

        function filldata(cust) {
            clearSelection(tblCustomer);
            selectRow(tblCustomer,activerowno,active);

            customer = JSON.parse(JSON.stringify(cust));
            oldcustomer = JSON.parse(JSON.stringify(cust));

            txtCode.value = customer.regno;
            txtContactname.value = customer.contactname;
            txtFullname.value = customer.fullname;
            txtDescription.value = customer.description;
            txtNIC.value = customer.nic;
            txtMobile.value = customer.mobile;
            txtLand.value = customer.land;
            txtAddress.value = customer.address;
            txtEmail.value = customer.email;
            txtPoint.value = customer.point;
            dteAddeddate.value = customer.addeddate;

            fillCombo(cmbStatus, "Select Status", customerStatuses, "name", customer.customerstatus_id.name);


            disableButtons(true, false, false);
            setStyle(valid);
            changeTab('form');
        }

        function getUpdates() {

            var updates = "";

            if(customer!=null && oldcustomer!=null) {

                if (customer.regno != oldcustomer.regno)
                    updates = updates + "\nReg Number is Changed";

                if (customer.fullname != oldcustomer.fullname)
                    updates = updates + "\nFullname is Changed";

                if (customer.nic != oldcustomer.nic)
                    updates = updates + "\nNIC is Changed";

                if (customer.email != oldcustomer.email)
                    updates = updates + "\nEmail is Changed";

                if (customer.point != oldcustomer.point)
                    updates = updates + "\nPoints is Changed";

                if (customer.contactname != oldcustomer.contactname)
                    updates = updates + "\nContact Name is Changed";

                if (customer.customerstatus_id.name != oldcustomer.customerstatus_id.name)
                    updates = updates + "\nCustomer Status is Changed";

                if (customer.address != oldcustomer.address)
                    updates = updates + "\nAddress is Changed";

                if (customer.mobile != oldcustomer.mobile)
                    updates = updates + "\nMobile Number is Changed";

                if (customer.land != oldcustomer.land)
                    updates = updates + "\nLand Number is Changed";

                if (customer.addeddate != oldcustomer.addeddate)
                    updates = updates + "\nAdded Date is Changed";

                if (customer.description != oldcustomer.description)
                    updates = updates + "\nDescription is Changed";

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
                        title: "Are you sure to update following customer details...?",
                        text: "\n"+ getUpdates(),
                        icon: "warning", buttons: true, dangerMode: true,
                    })
                        .then((willDelete) => {
                        if (willDelete) {
                            var response = httpRequest("/customer", "PUT", customer);
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

        function btnDeleteMC(cust) {
            customer = JSON.parse(JSON.stringify(cust));

            swal({
                title: "Are you sure to delete following employee...?",
                text: "\n Customer Regnumber : " + customer.regno +
                "\n Customer Fullname : " + customer.fullname,
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete)=> {
                if (willDelete) {
                    var responce = httpRequest("/customer","DELETE",customer);
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

        function btnPrintTableMC(customer) {
            //
            var newwindow = window.open();
            formattab = tblCustomer.outerHTML;

            newwindow.document.write("" +
                "<html>" +
                "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
                "<link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
                "<body><div style='margin-top: 50px; '> <h1>Customer Details : </h1></div>" +
                "<div>"+ formattab+"</div>"+
                "</body>" +
                "</html>");
            setTimeout(function () {newwindow.print(); newwindow.close();},100) ;
        }


        function sortTable(cind) {
            cindex = cind;

         var cprop = tblCustomer.firstChild.firstChild.children[cindex].getAttribute('property');

           if(cprop.indexOf('.') == -1) {
               customers.sort(
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
               customers.sort(
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
            fillTable('tblCustomer',customers,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblCustomer);
            loadForm();

            if(activerowno!="")selectRow(tblCustomer,activerowno,active);



        }