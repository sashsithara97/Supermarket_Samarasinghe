

 

        window.addEventListener("load", initialize);

        //Initializing Functions

        function initialize() {
            $('[data-toggle="tooltip"]').tooltip();

            btnAdd.addEventListener("click",btnAddMC);
            btnClear.addEventListener("click",btnClearMC);
            btnUpdate.addEventListener("click",btnUpdateMC);
            txtSearchName.addEventListener("keyup",btnSearchMC);

            privilages = httpRequest("../privilage?module=CUSTOMERPOINT","GET");

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
            customerpoints = new Array();
          var data = httpRequest("/customerpoint/findAll?page="+page+"&size="+size+query,"GET");
            if(data.content!= undefined) customerpoints = data.content;
            createPagination('pagination',data.totalPages, data.number+1,paginate);
            fillTable('tblCustomerPoint',customerpoints,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblCustomerPoint);

            if(activerowno!="")selectRow(tblCustomerPoint,activerowno,active);

        }

        function paginate(page) {
            var paginate;
            if(oldcustomerpoint==null){
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

        function viewitem(custpoint,rowno) {

            printcustomerpoint = JSON.parse(JSON.stringify(custpoint));

            tdloyaltytype.innerHTML = printcustomerpoint.loyaltytype;
            tdstartrate.innerHTML = printcustomerpoint.startrate;
            tdendrate.innerHTML = printcustomerpoint.endrate;
            tddiscount.innerHTML = printcustomerpoint.discount;
            tdaddpoint.innerHTML = printcustomerpoint.addpoint;

            var format = printformtable.outerHTML;

            var newwindow=window.open();
            newwindow.document.write("<html>" +
                "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
                "<body><div style='margin-top: 150px'><h1>Customer Point Details :</h1></div>" +
                "<div>"+format+"</div>" +
                "<script>printformtable.removeAttribute('style')</script>" +
                "</body></html>");
            setTimeout(function () {newwindow.print(); newwindow.close();},100);
         }

        function loadForm() {
            customerpoint = new Object();
            oldcustomerpoint = null;

            txtLoyaltytype.value = "";
            txtDiscount.value = "";
            txtStartRate.value = "";
            txtEndRate.value = "";
            txtAddPoint.value = "";

             setStyle(initial);
             disableButtons(false, true, true);
        }

        function setStyle(style) {
            txtLoyaltytype.style.border = style;
            txtDiscount.style.border = style;
            txtStartRate.style.border = style;
            txtEndRate.style.border = style;
            txtAddPoint.style.border = style;
            
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


        function getErrors() {

            var errors = "";
            addvalue = "";


            if (customerpoint.loyaltytype == null)
                errors = errors + "\n" + "Enter Loyalty Type";
            else  addvalue = 1;

            if (customerpoint.startrate == null)
                errors = errors + "\n" + "Enter Start Rate";
            else  addvalue = 1;

            if (customerpoint.endrate == null)
                errors = errors + "\n" + "Enter End Rate";
            else  addvalue = 1;

            if (customerpoint.discount == null)
                errors = errors + "\n" + "Enter Discount";
            else  addvalue = 1;

            return errors;

        }

        function btnAddMC(){
            if(getErrors()==""){
                if(txtAddPoint.value==""){
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
                title: "Are you sure to add following Customer Point Details...?" ,
                  text :  "\nLoyalty Type : " + customerpoint.loyaltytype +
                    "\nStart Rate : " + customerpoint.startrate +
                    "\nEnd Rate : " + customerpoint.endrate +
                    "\nDiscount : " + customerpoint.discount,
                  
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    var response = httpRequest("/customerpoint", "POST", customerpoint);
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

            if(oldcustomerpoint == null && addvalue == ""){
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

        function fillForm(custpoint,rowno){
            activerowno = rowno;

            if (oldcustomerpoint==null) {
                filldata(custpoint);
            } else {
                swal({
                    title: "Form has some values, updates values... Are you sure to discard the form ?",
                    text: "\n" ,
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        filldata(custpoint);
                    }

                });
            }

        }

        function filldata(custpoint) {
            
            clearSelection(tblCustomerPoint);
            selectRow(tblCustomerPoint,activerowno,active);

            customerpoint = JSON.parse(JSON.stringify(custpoint));
            oldcustomerpoint = JSON.parse(JSON.stringify(custpoint));

            txtLoyaltytype.value = customerpoint.loyaltytype;
            txtStartRate.value = customerpoint.startrate;
            txtEndRate.value = customerpoint.endrate;
            txtAddPoint.value = customerpoint.addpoint;
            txtDiscount.value = customerpoint.discount;

            disableButtons(true, false, false);
            setStyle(valid);
            changeTab('form');
        }

        function getUpdates() {

            var updates = "";

            if(customerpoint!=null && oldcustomerpoint!=null) {

                if (customerpoint.loyaltytype != oldcustomerpoint.loyaltytype)
                    updates = updates + "\nLoyalty Type is Changed";

                if (customerpoint.startrate != oldcustomerpoint.startrate)
                    updates = updates + "\nStart Rate is Changed";

                if (customerpoint.endrate != oldcustomerpoint.endrate)
                    updates = updates + "\nEnd Rate is Changed";

                if (customerpoint.addpoint != oldcustomerpoint.addpoint)
                    updates = updates + "\nAdd Point is Changed";

                if (customerpoint.discount != oldcustomerpoint.discount)
                    updates = updates + "\nDiscount is Changed";

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
                        title: "Are you sure to update following Customer Point Details...?",
                        text: "\n"+ getUpdates(),
                        icon: "warning", buttons: true, dangerMode: true,
                    })
                        .then((willDelete) => {
                        if (willDelete) {
                            var response = httpRequest("/customerpoint", "PUT", customerpoint);
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

        function btnDeleteMC(custpoint) {
            customerpoint = JSON.parse(JSON.stringify(custpoint));

            swal({
                title: "Are you sure to delete following Customer Point Details...?",
                text: "\n Loyalty Type : " + customerpoint.loyaltytype +
                "\n Start Rate : " + customerpoint.startrate +
                "\n End Rate : " + customerpoint.endrate ,
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete)=> {
                if (willDelete) {
                    var responce = httpRequest("/customerpoint","DELETE",customerpoint);
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

       function btnPrintTableMC(customerpoint) {

            var newwindow=window.open();
            formattab = tblCustomerPoint.outerHTML;

           newwindow.document.write("" +
                "<html>" +
                "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
                "<link rel='stylesheet' href='../plugin/bootstrap/css/bootstrap.min.css'/></head>" +
                "<body><div style='margin-top: 150px; '> <h1>Customer Point Details : </h1></div>" +
                "<div>"+ formattab+"</div>"+
               "</body>" +
                "</html>");
           setTimeout(function () {newwindow.print(); newwindow.close();},100) ;
        }

        function sortTable(cind) {
            cindex = cind;

         var cprop = tblCustomerPoint.firstChild.firstChild.children[cindex].getAttribute('property');

           if(cprop.indexOf('.') == -1) {
               customerpoints.sort(
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
               customerpoints.sort(
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
            fillTable('tblCustomerPoint',customerpoints,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblCustomerPoint);
            loadForm();

            if(activerowno!="")selectRow(tblCustomerPoint,activerowno,active);



        }