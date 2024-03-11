

        window.addEventListener("load", initialize);

        //Initializing Functions

        function initialize() {

            $('[data-toggle="tooltip"]').tooltip();

            //btnAdd.addEventListener("click",btnAddMC);

            btnClear.addEventListener("click",btnClearMC);
            btnUpdate.addEventListener("click",btnUpdateMC);

            txtSearchName.addEventListener("keyup",btnSearchMC);

            //privilage object for item module
            privilages = httpRequest("../privilage?module=BATCH","GET");

            // get data arrays for fill combobox
            batchstatuses = httpRequest("../batchstatus/list","GET");
            items = httpRequest("../item/list","GET");
            suppliers = httpRequest("../supplier/list","GET");

            //
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
            batches = new Array();

          var data = httpRequest("/batch/findAll?page="+page+"&size="+size+query,"GET");
            if(data.content!= undefined) batches = data.content;
            createPagination('pagination',data.totalPages, data.number+1,paginate);

            fillTable('tblBatch',batches,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblBatch);

            if(activerowno!="")selectRow(tblBatch,activerowno,active);

        }

        function paginate(page) {
            var paginate;
            if(oldbatch==null){
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

        function viewitem(batc,rowno) {

            printbatch = JSON.parse(JSON.stringify(batc));

            tdbatchcode.innerHTML = printbatch.batchcode;
            tdItemName.innerHTML = printbatch.item_id.itemname;
            tdsalesprice.innerHTML = printbatch.salesprice;
            tdpurchaseprice.innerHTML = printbatch.purchaseprice;
            tdavaqty.innerHTML = printbatch.avaqty;
            tdreturnqty.innerHTML = printbatch.returnqty;
            tdtotalqty.innerHTML = printbatch.totalqty;
            tdexpdate.innerHTML = printbatch.expdate;
            tdmfgdate.innerHTML = printbatch.mfgdate;
            tddiscount.innerHTML = printbatch.discount;
            tdIStatus.innerHTML = printbatch.batchstatus_id.name;

            var format = printformtable.outerHTML;

            var newwindow=window.open();
            newwindow.document.write("<html>" +
                "<head><link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
                "<body><div style='margin-top: 50px'><h1>Batch Management Details :</h1></div>" +
                "<div>"+format+"</div>" +
                "<script>printformtable.removeAttribute('style')</script>" +
                "</body></html>");
           setTimeout(function () {newwindow.print(); newwindow.close();},100);
         }

        function loadForm() {
            batch = new Object();
            oldbatch = null;

                // fill data into combo box
             fillCombo(cmbItem,"Select Item",items,"itemname","");
             fillCombo(cmbBatchStatus,"Select Batch status",batchstatuses,"name","");
             fillCombo(cmbSupplier,"Select Supplier",suppliers,"companyname","");

            // not default value
            txtSalesprice.value = "";
            txtPurchaseprice.value = "";
            txtAvailableQty.value = "";
            txtReturnQty.value = "";
            txtTotalQty.value = "";
            dteExpiredDate.value = "";
            dteManufacturedDate.value = "";
            txtDiscount.value = 0.00;

             setStyle(initial);

             disableButtons(false, true, true);
        }

        function setStyle(style) {

            txtBatchCode.style.border = style;
            cmbItem.style.border = style;
            txtSalesprice.style.border = style;
            txtPurchaseprice.style.border = style;
            txtAvailableQty.style.border = style;
            txtReturnQty.style.border = style;
            txtTotalQty.style.border = style;
            dteExpiredDate.style.border = style;
            dteManufacturedDate.style.border = style;
            cmbBatchStatus.style.border = style;
            cmbSupplier.style.border = style;
            txtDiscount.style.border = style;


        }

        function disableButtons(add, upd, del) {


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
            for(index in batches){
                if(batches[index].batchstatus_id.name =="Deleted"){
                    tblBatch.children[1].children[index].style.color = "#f00";
                    tblBatch.children[1].children[index].style.border = "2px solid red";
                    tblBatch.children[1].children[index].lastChild.children[1].disabled = true;
                    tblBatch.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

                }
            }

        }

        function getErrors() {

            var errors = "";
            addvalue = "";

            if (batch.salesprice == null)
                errors = errors + "\n" + "Salesprice not Entered";
            else  addvalue = 1;

            if (batch.purchaseprice == null)
                errors = errors + "\n" + "Purchase price not Entered";
            else  addvalue = 1;

            if (batch.avaqty == null)
                errors = errors + "\n" + "Available Quantity not Entered";
            else  addvalue = 1;

            if (batch.avaqty == null)
                errors = errors + "\n" + "Available Quantity not Entered";
            else  addvalue = 1;

            if (batch.returnqty == null)
                errors = errors + "\n" + "Return Quantity not Entered";
            else  addvalue = 1;

            if (batch.totalqty == null)
                errors = errors + "\n" + "Total Quantity not Entered";
            else  addvalue = 1;

            if (batch.expdate == null)
                errors = errors + "\n" + "Expired Date not Entered";
            else  addvalue = 1;

            if (batch.mfgdate == null)
                errors = errors + "\n" + "Manufactured Date not Entered";
            else  addvalue = 1;

            if (batch.batchstatus_id == null)
                errors = errors + "\n" + "Batch Status Not Selected";
            else  addvalue = 1;



            return errors;

        }

        function btnClearMC() {
            //Get Cofirmation from the User window.confirm();
            checkerr = getErrors();

            if(oldbatch == null && addvalue == ""){
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

        function fillForm(batc,rowno){
            activerowno = rowno;

            if (oldbatch==null) {
                filldata(batc);
            } else {
                swal({
                    title: "Form has some values, updates values... Are you sure to discard the form ?",
                    text: "\n" ,
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        filldata(batc);
                    }

                });
            }

        }

        function filldata(batc) {
            clearSelection(tblBatch);
            selectRow(tblBatch,activerowno,active);

            batch = JSON.parse(JSON.stringify(batc));
            oldbatch = JSON.parse(JSON.stringify(batc));

            txtBatchCode.value = batch.batchcode;
            txtSalesprice.value = batch.salesprice;
            txtPurchaseprice.value = batch.purchaseprice;
            txtAvailableQty.value = batch.avaqty;
            txtReturnQty.value = batch.returnqty;
            txtTotalQty.value = batch.totalqty;
            dteExpiredDate.value = batch.expdate;
            dteManufacturedDate.value = batch.mfgdate;
            txtDiscount.value = batch.disount;

            fillCombo(cmbItem,"Select Item",items,"itemname",batch.item_id.itemname);
            fillCombo(cmbBatchStatus,"Select Batch Status",batchstatuses,"name",batch.batchstatus_id.name);
            fillCombo(cmbSupplier,"Select Supplier",suppliers,"companyname",batch.supplier_id.companyname);

            disableButtons(true, false, false);
            setStyle(valid);
            changeTab('form');

        }

        function getUpdates() {

            var updates = "";

            if(batch != null && oldbatch != null) {


                if (batch.salesprice != oldbatch.salesprice)
                    updates = updates + "\nbatch Name is Changed";

                if (batch.purchaseprice != oldbatch.purchaseprice)
                    updates = updates + "\nPurchase Price is Changed";

                if (batch.item_id.itemname != oldbatch.item_id.itemname)
                    updates = updates + "\nItem is Changed";

                if (batch.avaqty != oldbatch.avaqty)
                    updates = updates + "\nAvailable Quantity is Changed";

                if (batch.totalqty != oldbatch.totalqty)
                    updates = updates + "\nTotal Quantity is Changed";

                if (batch.returnqty != oldbatch.returnqty)
                    updates = updates + "\nReturn Quantity is Changed";

                if (batch.expdate != oldbatch.expdate)
                    updates = updates + "\nExpired Date is Changed";

                if (batch.mfgdate != oldbatch.mfgdate)
                    updates = updates + "\nManufactured date is Changed";

                if (batch.discount != oldbatch.discount)
                    updates = updates + "\nDiscount is Changed";

                if (batch.batchstatus_id.name != oldbatch.batchstatus_id.name)
                    updates = updates + "\nBatch status is Changed";

                if (batch.supplier_id.companyname != oldbatch.supplier_id.companyname)
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
                        title: "Are you sure to update following Batch details...?",
                        text: "\n"+ getUpdates(),
                        icon: "warning", buttons: true, dangerMode: true,
                    })
                        .then((willDelete) => {
                        if (willDelete) {
                            var response = httpRequest("/batch", "PUT", batch);
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
                            else swal({
                                title: 'Failed to Update as ',icon: "error",
                                text: '\n '+response,
                                button: true});
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

        function btnDeleteMC(batc) {
            batch = JSON.parse(JSON.stringify(batc));

            swal({
                title: "Are you sure to delete following Batch...?",
                text: "\n Batch Code : " + batch.batchcode +
                "\n Batch Status : " + batch.batchstatus_id.name,
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete)=> {
                if (willDelete) {
                    var responce = httpRequest("/batch","DELETE",batch);
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

       function btnPrintTableMC(batch) {
            //
            var newwindow = window.open();
            formattab = tblBatch.outerHTML;

           newwindow.document.write("" +
                "<html>" +
                "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
                "<link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
                "<body><div style='margin-top: 50px; '> <h1>Batch Details : </h1></div>" +
                "<div>"+ formattab+"</div>"+
               "</body>" +
                "</html>");
           setTimeout(function () {newwindow.print(); newwindow.close();},100) ;
        }

        function sortTable(cind) {
            cindex = cind;

         var cprop = tblBatch.firstChild.firstChild.children[cindex].getAttribute('property');

           if(cprop.indexOf('.') == -1) {
               batches.sort(
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
               batches.sort(
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
            fillTable('tblBatch',batches,fillForm,btnDeleteMC,viewbatch);
            clearSelection(tblBatch);
            loadForm();

            if(activerowno!="")selectRow(tblBatch,activerowno,active);

        }