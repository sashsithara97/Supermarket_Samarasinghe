
window.addEventListener("load", initialize);

        //Initializing Functions
        function initialize() {
            $('[data-toggle="tooltip"]').tooltip();

            txtPassword.addEventListener("keyup",txtPasswordKU);
            txtRetypePassword.addEventListener("keyup",txtRetypePasswordKU);
            txtSearchName.addEventListener("keyup",btnSearchMC);

            privilages = httpRequest("../privilage?module=USER","GET");

          employeeswithoutusers = httpRequest("../employee/list/withoutusers","GET");
          employees = httpRequest("../employee/list","GET");
          roleslist = httpRequest("../role/list","GET");

            //apply selecr2 into your select box
            $(".js-example-basic-multiple").select2({
                placeholder: " Select Roles",
                allowClear: true
            });

            valid = "2px solid green";
            invalid = "2px solid red";
            initial = "2px solid #d6d6c2";
            updated = "2px solid #ff9900";
            active = "#ff9900";

            loadForm();
            loadView();

        }

        function loadView() {

            //Search Area
            txtSearchName.value="";
            txtSearchName.style.border = "";

            //Table Area
            activerowno = "";
            activepage = 1;
            var query = "";
            loadTable(1,cmbPageSize.value,query);

        }

        function loadTable(page,size,query) {
            page = page - 1;
            users = new Array();
            var data = httpRequest("/user/findAll?page="+page+"&size="+size+query,"GET");
            if(data.content!= undefined) users = data.content;
            createPagination('pagination',data.totalPages, data.number+1,paginate);
            fillTable('tblUser',users,fillForm,btnDeleteMC,printrow);
            clearSelection(tblUser);
            if(activerowno!="")selectRow(tblUser,activerowno,active);
            window.location.href="#ui";
        }

        function paginate(page) {
            var paginate;
            if(olduser==null){
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
                loadSearchedTable();
                loadForm();
            }

        }

        function loadForm() {

            user = new Object();
            olduser = null;

            fillCombo(cmbEmployee,"Select Employee",employeeswithoutusers,"callingname","");
            fillCombo(cmbEmployeeCreated,"Loged Employee",employees,"callingname",session.getObject("activeuser").employeeId.callingname);
            fillCombo(cmbUserRoles,"",roleslist,"role","");

            var today = new Date();
            var month = today.getMonth()+1;
            if(month<10) month = "0"+month;
            var date = today.getDate();
            if(date<10) date = "0"+date;

            dteDOCreated.value=today.getFullYear()+"-"+month+"-"+date;

            user.docreation = dteDOCreated.value;
            user.employeeCreatedId = JSON.parse(cmbEmployeeCreated.value);

            txtUsername.value = "";
            txtPassword.value = "";
            txtRetypePassword.value = "";
            txtDescription.value = "";

            setStyle(initial);

            dteDOCreated.style.border = valid;
            cmbEmployeeCreated.style.border = valid;
            disableButtons(false, true, true);
            cmbEmployeeCreated.disabled="disabled";
        }

        function setStyle(style) {

            txtUsername.style.border = style;
            txtPassword.style.border = style;
            txtRetypePassword.style.border = style;
            cmbEmployee.style.border = style;
            dteDOCreated.style.border = style;
            txtDescription.style.border = style;
            cmbEmployeeCreated.style.border = style;
            cmbUserRoles.style.border = style;

            $("#userselect2parent .select2-container").css('border',style);

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

}

        function txtPasswordKU() {
            txtRetypePassword.value="";
            txtRetypePassword.style.border = invalid;

        }

        function txtRetypePasswordKU() {
            var pattern = new RegExp('^[A-Za-z0-9]{5,5}$');
            var password = txtPassword.value;
            var retypepassword = txtRetypePassword.value;
            if(pattern.test(password) && password==retypepassword) {
                user.password = password;
                txtRetypePassword.style.border = valid;
                txtPassword.style.border = valid;
            }
            else
            {
                user.password = null;
                txtRetypePassword.style.border = invalid;
            }
        }

        //Form Operation Functions
        function getErrors() {

            var errors = "";
            addvalue = "";

            if (user.employeeId == null)
                errors = errors + "\n" + "Employee Not Selected";
            else  addvalue = 1;

            if (user.userName == null)
                errors = errors + "\n" + "User Name Not Entered";
            else  addvalue = 1;

            if (user.password == null)
                errors = errors + "\n" + "Password Not Inserted or Mismatch";
            else  addvalue = 1;

            if (user.roles.length == 0)
                errors = errors + "\n" + "Roles Not Selected";
            else  addvalue = 1;

            return errors;

        }

        function btnAddMC(){
            var errors = getErrors();

            if(errors=="") {

                swal({
                    title: "Are you sure to add following User ?",
                    text: "\nEmployee : " + user.employeeId.callingname +
                        "\nUsername : " + user.userName +
                        "\nUser email : " + user.email +
                        "\nCreated By : " + user.employeeCreatedId.callingname,
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        var response = httpRequest("/user", "POST", user);
                        if (response == "0") {
                            swal({
                                title: "Saved Successfully....!",
                                text: "\n\n",
                                icon: "success", button: false, timer: 1200,
                            });
                            employeeswithoutusers = httpRequest("../employee/withoutusers", "GET");
                            loadForm();
                            activerowno = 1;
                            loadSearchedTable();
                        } else
                            swal({
                                title: 'Save not Success... , You have following errors', icon: "error",
                                text: '\n ' + response,
                                button: true
                            });
                    }

                });
            } else {   swal({
                title: "You have following errors",
                text: "\n"+getErrors(),
                icon: "error",
                button: true,
                });

            }
        }

        function btnClearMC() {
    //Get Cofirmation from the User window.confirm();
    checkerr = getErrors();


    if(olduser == null && addvalue == ""){
        loadForm();
    }else{
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n" ,
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                loadForm();
                loadView()
            }

        });
    }
}

        function fillForm(itm,rowno){
    activerowno = rowno;

    if (olduser==null) {
        filldata(itm);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n" ,
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(itm);
            }

        });
    }

}

        function filldata(usr) {
    clearSelection(tblUser);
    disableButtons(true, false, false);
    selectRow(tblUser,activerowno,active);


                user = JSON.parse(JSON.stringify(usr));
                olduser = JSON.parse(JSON.stringify(usr));

                // fill combo 2
               fillCombo2(cmbUserRoles,"",roleslist,"role",user.roles);

                $('.select2-selection').css('border','2px solid green');

                txtUsername.value = user.userName;
                dteDOCreated.value = user.docreation;
                txtDescription.value = user.description;
                txtUsername.disabled="disabled";
                txtPassword.disabled="disabled";
                txtRetypePassword.disabled="disabled";
                dteDOCreated.disabled="disabled";

                if(!user.active){
                    chkStatus.checked = false;
                    $('#chkStatus').bootstrapToggle('off')
                }else {
                    chkStatus.checked = true;
                    $('#chkStatus').bootstrapToggle('on')
                }
                fillCombo(cmbEmployee, "", employees, "callingname", user.employeeId.callingname);

                fillCombo(cmbEmployeeCreated, "", employees, "callingname", user.employeeCreatedId.callingname);
                cmbEmployee.disabled="disabled";
                cmbEmployeeCreated.disabled="disabled";


                setStyle(valid);


        }

        function getUpdates() {

            var updates = "";

            if(user!=null && olduser!=null) {

                if (isEqualtolist(user.roles,olduser.roles,"role"))
                     updates = updates + "\nRoles are Changed";

                if (user.description != olduser.description)
                    updates = updates + "\nDescription is Changed";

                if (user.active != olduser.active)
                    updates = updates + "\nUserstatus is Changed";
            }
            return updates;
        }

        function btnUpdateMC() {
            var errors = getErrors();
            if (errors == "") {
                var updates = getUpdates();
                if (updates == "") swal({
                    title: 'Nothing Updated..!',icon: "warning",
                    text: '\n',
                    button: false,
                    timer: 1200});
                else {

                    swal({
                        title: "Are you sure to update following User details...?",
                        text: "\n"+ getUpdates(),
                        icon: "warning", buttons: true, dangerMode: true,
                    }) .then((willDelete) => {
                            if (willDelete) {
                        var response = httpRequest("/user","PUT",user);
                        if(response=="0"){
                            swal({
                                title: "Updated Successfully....!",
                                text: "\n\n",
                                icon: "success", button: false, timer: 1200,
                            });
                            loadForm();
                            loadSearchedTable();

                        }
                        else swal({
                            position: 'center',
                            icon: 'error',
                            title: 'Failed to Update as...!',
                            text: '\n' + response,
                            button: true,
                        });
                    }
                });
            }}
            else
                swal({
                    position: 'center',
                    icon: 'warning',
                    title: 'You have following errors in your form...!',
                    text: '\n' + getErrors(),
                    button: true,
                });

        }

        function btnDeleteMC(uer) {
            user = JSON.parse(JSON.stringify(uer));

            swal({title:"Are your sure to delete following ! \n\n",
               text: "Number : " +user.userName+ "\nEmployee name : " +user.employeeId.callingname,
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete)=> {
                if(willDelete){

                var response = httpRequest("/user","DELETE",user);
                if(response=="0"){
                    swal({
                        title: "Deleted Successfully....!",
                        text: "\n\n  Status change to delete",
                        icon: "success", button: false, timer: 1200,
                    });
                    employeeswithoutusers = httpRequest("../employee/list/withoutusers","GET");
                    loadForm();
                    loadSearchedTable();

                }
                else swal({
                    title: "You have following erros....!",
                    text: "\n\n" + response,
                    icon: "error", button: true,

                });

                }
            } );

        }

        //Search Functions
        function loadSearchedTable(){


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

        //Custom combo binder
        function cusComboBoxBinder(field) {
            rlist = $('.js-example-basic-multiple').val();
            user.roles = new Array();

            rlist.forEach(function(item){
                eval('var obj='+item);
                user.roles.push(obj);
            })

            if(user.roles.length != 0){

                if (olduser != null && isEqualtolist(user.roles,olduser.roles,"role") ){
                    $('.select2-selection').css('border','2px solid khaki');
                }else {
                    $('.select2-selection').css('border','2px solid green');
                }
            }else
                $('.select2-selection').css('border','2px solid red');

        }

        function printrow(usr) {
    user = JSON.parse(JSON.stringify(usr));




}

        function btnPrintTableMC() {

    var newwindow=window.open();
    formattab = tblUser.outerHTML;

    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='../plugin/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 150px; '> <h1>User Details : </h1></div>" +
        "<div>"+ formattab+"</div>"+
        "</body>" +
        "</html>");
    setTimeout(function () {newwindow.print(); newwindow.close();},100) ;
}
