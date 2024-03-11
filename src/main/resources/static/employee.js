

 

        window.addEventListener("load", initialize);

        //Initializing Functions

        function initialize() {

            $('[data-toggle="tooltip"]').tooltip();

            btnAdd.addEventListener("click",btnAddMC);
            btnClear.addEventListener("click",btnClearMC);
            btnUpdate.addEventListener("click",btnUpdateMC);

            dteDOBirth.onchange = dteDOBirthCH;
            txtSearchName.addEventListener("keyup",btnSearchMC);

            privilages = httpRequest("../privilage?module=EMPLOYEE","GET");
    
            genders = httpRequest("../gender/list","GET");
            designations = httpRequest("../designation/list","GET");
            civilstatuses = httpRequest("../civilstatus/list","GET");
            employeestatuses = httpRequest("../employeestatus/list","GET");

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
            employees = new Array();
          var data = httpRequest("/employee/findAll?page="+page+"&size="+size+query,"GET");
            if(data.content!= undefined) employees = data.content;
            createPagination('pagination',data.totalPages, data.number+1,paginate);
            fillTable('tblEmployee',employees,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblEmployee);

            if(activerowno!="")selectRow(tblEmployee,activerowno,active);

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

        function viewitem(emp,rowno) {

       printemployee = JSON.parse(JSON.stringify(emp));

            tdnum.setAttribute('value',printemployee.number);
            tdcname.innerHTML = printemployee.callingname;
            tdnic.innerHTML = printemployee.nic;
            tdaddress.innerHTML = printemployee.address;
            tdmobile.innerHTML = printemployee.mobile;
            tdland.innerHTML = printemployee.land;
            tdasdate.innerHTML = printemployee.doassignment;
            tddesg.innerHTML = printemployee.designationId.name;
            tdgender.innerHTML = printemployee.genderId.name;
            tdestatus.innerHTML = printemployee.employeestatusId.name;

            var format = printformtable.outerHTML;

            var newwindow=window.open();
            newwindow.document.write("<html>" +
                "<head><link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
                "<body><div style='margin-top: 50px'><h1>Employee Details :</h1></div>" +
                "<div>"+format+"</div>" +
                "<script>printformtable.removeAttribute('style')</script>" +
                "</body></html>");
            setTimeout(function () {newwindow.print(); newwindow.close();},100);
         }

        function loadForm() {
            employee = new Object();
            oldemployee = null;

             fillCombo(cmbGender,"Select Gender",genders,"name","");
             fillCombo(cmbDesignation,"Select Designation",designations,"name","");
             fillCombo(cmbCivilstatus,"Select Civil Status",civilstatuses,"name","");

             fillCombo(cmbEmployeestatus,"",employeestatuses,"name","Working");
            employee.employeestatusId=JSON.parse(cmbEmployeestatus.value);


             var today = new Date();
             var month = today.getMonth()+1;
             if(month<10) month = "0"+month;
             var date = today.getDate();
             if(date<10) date = "0"+date;

             dteDOAssignment.value=today.getFullYear()+"-"+month+"-"+date;
             employee.doassignment=dteDOAssignment.value;


            // Get Next Number Form Data Base
            var nextNumber = httpRequest("/employee/nextNumber", "GET");
            txtNumber.value = nextNumber.number;
            employee.number = txtNumber.value;
            txtNumber.disabled="disabled";

             txtFullname.value = "";
             txtCallingname.value = "";
             dteDOBirth.value = "";
             txtNIC.value = "";
             txtAddress.value = "";
             txtMobile.value = "";
             txtLand.value = "";
            txtEmail.value = "";

             txtDescription.value = "";
             removeFile('flePhoto');

             setStyle(initial);
             cmbEmployeestatus.style.border=valid;
             dteDOAssignment.style.border=valid;
             dteDOAssignment.disabled =true;
            cmbEmployeestatus.disabled =true;

            txtNumber.style.border=valid;

             disableButtons(false, true, true);
        }

        function setStyle(style) {

            txtNumber.style.border = style;
            txtFullname.style.border = style;
            txtCallingname.style.border = style;
            cmbGender.style.border = style;
            cmbCivilstatus.style.border = style;
            txtNIC.style.border = style;
            dteDOBirth.style.border = style;
            txtAddress.style.border = style;
            txtMobile.style.border = style;
            txtLand.style.border = style;
            cmbDesignation.style.border = style;
            dteDOAssignment.style.border = style;
            txtDescription.style.border = style;
            cmbEmployeestatus.style.border = style;
            txtEmail.style.border = style;

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
            for(index in employees){
                if(employees[index].employeestatusId.name =="Deleted"){
                    tblEmployee.children[1].children[index].style.color = "#f00";
                    tblEmployee.children[1].children[index].style.border = "2px solid red";
                    tblEmployee.children[1].children[index].lastChild.children[1].disabled = true;
                    tblEmployee.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

                }
            }

        }

        function nicTestFieldBinder(field,pattern,ob,prop,oldob) {
            var regpattern = new RegExp(pattern);

            var val = field.value.trim();
            if (regpattern.test(val)) {
                    var dobyear, gendername,noOfDays = "";
                    if (val.length===10){
                        dobyear = "19"+val.substring(0,2);
                        noOfDays = val.substring(2,5);
                    }else{
                         dobyear = val.substring(0,4);
                         noOfDays = val.substring(4,7);
                    }
                    birthdate = new Date(dobyear+"-"+"01-01");
                if (noOfDays>=1 && noOfDays<=366){
                    gendername =  "Male";
                }else if(noOfDays>=501 && noOfDays<=866){
                    noOfDays = noOfDays-500;
                    gendername =  "Female";
                }
                if(gendername=== "Female" ||  gendername ===  "Male"){
                    fillCombo(cmbGender,"Select Gender",genders,"name",gendername);
                    birthdate.setDate(birthdate.getDate()+parseInt(noOfDays)-1)
                    dteDOBirth.value = birthdate.getFullYear()+"-"+getmonthdate(birthdate);

                    employee.genderId = JSON.parse(cmbGender.value);
                    employee.dobirth = dteDOBirth.value;
                    employee.nic = field.value;
                    if (oldemployee != null && oldemployee.nic != employee.nic){
                        field.style.border=updated;}else {field.style.border=valid;}
                    if (oldemployee != null && oldemployee.dobirth != employee.dobirth){
                        dteDOBirth.style.border=updated;}else {dteDOBirth.style.border=valid;}
                    if (oldemployee != null && oldemployee.genderId.name != employee.genderId.name){
                        cmbGender.style.border=updated;}else {cmbGender.style.border=valid;}
                    dteDOBirthCH();
                }else{
                    field.style.border = invalid;
                    cmbGender.style.border = initial;
                    dteDOBirth.style.border = initial;
                    fillCombo(cmbGender,"Select Gender",genders,"name","");
                    dteDOBirth.value = "";
                        employee.nic = null;
                }
            }else{
                field.style.border = invalid;
                employee.nic = null;
            }

        }

        function nicFieldBinder(field,pattern,ob,prop,oldob) {
            var regpattern = new RegExp(pattern);
    
            var val = field.value.trim();
            if (regpattern.test(val)) {
                employee.nic = val;
                if (oldemployee != null && oldemployee.nic != employee.nic){
                    field.style.border = updated;
                    gender = generate(val,field,cmbGender,dteDOBirth);
                   fillCombo(cmbGender,"Select Gender",genders,"name",gender);
                   cmbGender.style.border=updated;
                    dteDOBirth.style.border=updated;
                    employee.genderId = JSON.parse(cmbGender.value);
                    employee.dobirth = dteDOBirth.value;
                }else{
                    field.style.border = valid;
                    gender =  generate(val,field,cmbGender,dteDOBirth);
                    fillCombo(cmbGender,"Select Gender",genders,"name",gender);
                    cmbGender.style.border=valid;
                    dteDOBirth.style.border=valid;
                    employee.genderId = JSON.parse(cmbGender.value);
                    employee.dobirth = dteDOBirth.value;
                }
            }
            else {
                field.style.border = invalid;
                employee.nic = null;
            }
        }

        function dteDOBirthCH() {
            var today = new Date();
            var birthday = new Date(dteDOBirth.value);
            if((today.getTime()-birthday.getTime())>(18*365*24*3600*1000)) {
                employee.dobirth = dteDOBirth.value;
                dteDOBirth.style.border = valid;
            }
            else
            {
                employee.dobirth = null;
                dteDOBirth.style.border = invalid;
            }
        }

        function getErrors() {

            var errors = "";
            addvalue = "";

            if (employee.fullname == null)
                errors = errors + "\n" + "Employee Full Name Not Entered";
            else  addvalue = 1;

            if (employee.nic == null)
                errors = errors + "\n" + "Employee nic Entered";
            else  addvalue = 1;

            if (employee.callingname == null)
                errors = errors + "\n" + "Employee Calling Name Entered";
            else  addvalue = 1;

            if (employee.civilstatusId == null)
                errors = errors + "\n" + "Civilstatus Not Selected";
            else  addvalue = 1;

            if (employee.address == null)
                errors = errors + "\n" + "Employee Address Not Entered";
            else  addvalue = 1;

            if (employee.mobile == null)
                errors = errors + "\n" + "Employee Mobile number Not Entered";
            else  addvalue = 1;

            if (employee.email == null)
                errors = errors + "\n" + "Enter Email";
            else  addvalue = 1;

            if (employee.designationId == null)
                errors = errors + "\n" + "Designation Not Selected";
            else  addvalue = 1;

            return errors;

        }

        function btnAddMC(){
            if(getErrors()==""){
                if(txtLand.value=="" || txtDescription.value ==""){
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
                title: "Are you sure to add following empolyee...?" ,
                  text :  "\nNumber : " + employee.number +
                    "\nFull Name : " + employee.fullname +
                    "\nCalling Name : " + employee.callingname +
                    "\nNIC : " + employee.nic +
                    "\nBirth Date : " + employee.dobirth +
                    "\nAddress : " + employee.address +
                    "\nMobile : " + employee.mobile +
                    "\nLand : " + employee.land +
                    "\nEMail : " + employee.email +
                    "\nAssignment Date : " + employee.doassignment +
                    "\nEmployee Status : " + employee.employeestatusId.name,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    var response = httpRequest("/employee", "POST", employee);
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

            if(oldemployee == null && addvalue == ""){
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

        function fillForm(emp,rowno){
            activerowno = rowno;

            if (oldemployee==null) {
                filldata(emp);
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


        function filldata(emp) {
            clearSelection(tblEmployee);
            selectRow(tblEmployee,activerowno,active);

            employee = JSON.parse(JSON.stringify(emp));
            oldemployee = JSON.parse(JSON.stringify(emp));

            txtNumber.value = employee.number;
            txtNumber.disabled="disabled";
            txtFullname.value = employee.fullname;
            txtCallingname.value = employee.callingname;
            dteDOBirth.value = employee.dobirth;
            txtNIC.value = employee.nic;
            txtAddress.value = employee.address;
            txtMobile.value = employee.mobile;
            txtLand.value = employee.land;
            txtEmail.value = employee.email;
            dteDOAssignment.value = employee.doassignment;
            txtDescription.value = employee.description;

            fillCombo(cmbGender, "Select Gender", genders, "name", employee.genderId.name);
            fillCombo(cmbDesignation, "Select Designation", designations, "name", employee.designationId.name);
            fillCombo(cmbCivilstatus, "Select Civil Status", civilstatuses, "name", employee.civilstatusId.name);
            fillCombo(cmbEmployeestatus, "", employeestatuses, "name", employee.employeestatusId.name);

            setDefaultFile('flePhoto', employee.photo);

            disableButtons(true, false, false);
            setStyle(valid);
            changeTab('form');
        }

        function getUpdates() {

            var updates = "";

            if(employee!=null && oldemployee!=null) {

                if (employee.number != oldemployee.number)
                    updates = updates + "\nNumber is Changed";

                if (employee.fullname != oldemployee.fullname)
                    updates = updates + "\nFullname is Changed";

                if (employee.nic != oldemployee.nic)
                    updates = updates + "\nNIC is Changed";

                if (employee.callingname != oldemployee.callingname)
                    updates = updates + "\nCallingname is Changed";

                if (employee.genderId.name != oldemployee.genderId.name)
                    updates = updates + "\nGender is Changed";

                if (employee.civilstatusId.name != oldemployee.civilstatusId.name)
                    updates = updates + "\nCivilstatus is Changed";

                if (employee.dobirth != oldemployee.dobirth)
                    updates = updates + "\nDate of Birth is Changed";

                if (employee.photo != oldemployee.photo)
                    updates = updates + "\nPhoto is Changed";

                if (employee.address != oldemployee.address)
                    updates = updates + "\nAddress is Changed";

                if (employee.mobile != oldemployee.mobile)
                    updates = updates + "\nMobile Number is Changed";

                if (employee.land != oldemployee.land)
                    updates = updates + "\nLand Number is Changed";

                if (employee.email != oldemployee.email)
                    updates = updates + "\nEmail is Changed";

                if (employee.designationId.name != oldemployee.designationId.name)
                    updates = updates + "\nDesignation is Changed";

                if (employee.doassignment != oldemployee.doassignment)
                    updates = updates + "\nDate of Assignment is Changed";


                if (employee.description != oldemployee.description)
                    updates = updates + "\nDescription is Changed";

                if (employee.employeestatusId.name != oldemployee.employeestatusId.name)
                    updates = updates + "\nEmployeestatus is Changed";
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
                        title: "Are you sure to update following empolyee details...?",
                        text: "\n"+ getUpdates(),
                        icon: "warning", buttons: true, dangerMode: true,
                    })
                        .then((willDelete) => {
                        if (willDelete) {
                            var response = httpRequest("/employee", "PUT", employee);
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

        function btnDeleteMC(emp) {
            employee = JSON.parse(JSON.stringify(emp));

            swal({
                title: "Are you sure to delete following employee...?",
                text: "\n Employee Number : " + employee.number +
                "\n Employee Fullname : " + employee.fullname,
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete)=> {
                if (willDelete) {
                    var responce = httpRequest("/employee","DELETE",employee);
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

       function btnPrintTableMC(employee) {

            var newwindow=window.open();
            formattab = tblEmployee.outerHTML;

           newwindow.document.write("" +
                "<html>" +
                "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
                "<link rel='stylesheet' href='../plugin/bootstrap/css/bootstrap.min.css'/></head>" +
                "<body><div style='margin-top: 150px; '> <h1>Employees Details : </h1></div>" +
                "<div>"+ formattab+"</div>"+
               "</body>" +
                "</html>");
           setTimeout(function () {newwindow.print(); newwindow.close();},100) ;
        }

        function sortTable(cind) {
            cindex = cind;

         var cprop = tblEmployee.firstChild.firstChild.children[cindex].getAttribute('property');

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
               employees.sort(
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
            fillTable('tblEmployee',employees,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblEmployee);
            loadForm();

            if(activerowno!="")selectRow(tblEmployee,activerowno,active);



        }