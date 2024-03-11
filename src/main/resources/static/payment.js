window.addEventListener("load", initialize);

//Initializing Functions

function initialize() {
    $('[data-toggle="tooltip"]').tooltip();

    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);

    cmbPaymethod.addEventListener("change", cmbPaymethodCH);
    cmbSupplier.addEventListener("change", cmbSupplierCH);
    cmbGrn.addEventListener("change", cmbGrnCH);
    txtPaidAmount.addEventListener("keyup", txtPaidAmountKU);
    txtSearchName.addEventListener("keyup", btnSearchMC);

    privilages = httpRequest("../privilage?module=PAYMENT", "GET");

    // data list for main form combo box
    allsuppliers = httpRequest("../supplier/list", "GET");

    //List all new and regular suppliers
    suppliers = httpRequest("../supplier/listbysupplierstatus", "GET");
    //All grn Codes
  //  grns = httpRequest("../grn/list", "GET");
    paymentmethods = httpRequest("../paymentmethod/list", "GET");
    paymentStatuses = httpRequest("../paymentstatus/list", "GET");
    employees = httpRequest("../employee/list", "GET");

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
    txtSearchName.value = "";
    txtSearchName.style.background = "";

    //Table Area
    activerowno = "";
    activepage = 1;
    var query = "&searchtext=";
    loadTable(1, cmbPageSize.value, query);
}

function loadTable(page, size, query) {
    page = page - 1;
    payments = new Array();
    var data = httpRequest("/payment/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) payments = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);
    fillTable('tblPayment', payments, fillForm, '', viewitem);
    clearSelection(tblPayment);

    if (activerowno != "") selectRow(tblPayment, activerowno, active);

}

function paginate(page) {
    var paginate;
    if (oldpayment == null) {
        paginate = true;
    } else {
        if (getErrors() == '' && getUpdates() == '') {
            paginate = true;
        } else {
            paginate = window.confirm("Form has Some Errors or Update Values. " +
                "Are you sure to discard that changes ?");
        }
    }
    if (paginate) {
        activepage = page;
        activerowno = ""
        loadForm();
        loadSearchedTable();
    }

}

function viewitem(pay, rowno) {

    printpayment = JSON.parse(JSON.stringify(pay));

    tdpaybillno.setAttribute('value', printpayment.billno);
    tdpaysupplier.innerHTML = printpayment.supplier_id.companyname;
    tdpayariaseamount.innerHTML = printpayment.ariaseamount;
    tdpaygrn.innerHTML = printpayment.grn_id.grncode;
    tdpaygrnamount.innerHTML = printpayment.grnamount;
    tdpaytotalamount.innerHTML = printpayment.totalamount;
    tdpaypaidamount.innerHTML = printpayment.paidamount;
    tdpaybalanceamount.innerHTML = printpayment.balanceamount;
    tdpaypaymentstatus.innerHTML = printpayment.paymentstatus_id.name;
    tdpaypaymentmethod.innerHTML = printpayment.paymentmethod_id.name;

    var format = printformtable.outerHTML;

    var newwindow=window.open();
    newwindow.document.write("<html>" +
        "<head><link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 50px'><h1>Supplier Payment Details :</h1></div>" +
        "<div>"+format+"</div>" +
        "<script>printformtable.removeAttribute('style')</script>" +
        "</body></html>");
    setTimeout(function () {newwindow.print(); newwindow.close();},100);
}

function txtPaidAmountKU() {

    if (txtPaidAmount.value.length > 2) {

        let creditlimit = parseFloat(JSON.parse(cmbSupplier.value).creditlimit);
        let total = parseFloat(txtTotalAmount.value);
        let paid = parseFloat(txtPaidAmount.value);

        if (paid <= total) {

            if (creditlimit != 0) {
                creditlimitckeck = total - creditlimit;

                if (paid < creditlimitckeck) {
                    txtPaidAmount.style.border = invalid;
                    swal({
                        position: 'center',
                        icon: 'warning',
                        title: 'Credit Limit Exceeded -> Credit limit : ' + creditlimit,
                        text: '\n',
                        button: false,
                        timer: 3000
                    });

                } else {

                    txtBalanceAmount.value = (total - paid).toFixed(2);
                    payment.balanceamount = txtBalanceAmount.value;

                }


            } else {
                txtBalanceAmount.value = (total - paid).toFixed(2);
                payment.balanceamount = txtBalanceAmount.value;

            }


        } else {
            txtPaidAmount.style.border = invalid;
            txtBalanceAmount.style.border = initial;
            txtBalanceAmount.value = 0.00;

            swal({
                position: 'center',
                icon: 'warning',
                title: 'Paid amount must be less than or equal to total Amount!',
                text: '\n',
                button: false,
                timer: 3000
            });

        }


    } else {

        txtPaidAmount.style.border = invalid;
        txtBalanceAmount.style.border = initial;
        txtBalanceAmount.value = 0.00;

    }


}

function cmbGrnCH() {

    txtGrnAmount.value = parseFloat(JSON.parse(cmbGrn.value).nettotal).toFixed(2);
    payment.grnamount = txtGrnAmount.value;

    txtTotalAmount.value = (parseFloat(txtAriase.value) + parseFloat(txtGrnAmount.value)).toFixed(2);


}

function cmbPaymethodCH() {

    var paymethodtype = JSON.parse(cmbPaymethod.value).name;
    if (paymethodtype == "Cash") {
        $('#chequemodel').modal('hide');
        $('#depositmodel').modal('hide');
        $('#onlinetransfermodel').modal('hide');

    }

    if (paymethodtype == "Cheque") {
        $('#chequemodel').modal('show');
        $('#depositmodel').modal('hide');
        $('#onlinetransfermodel').modal('hide');

    }

    if (paymethodtype == "Bank Deposit") {
        $('#chequemodel').modal('hide');
        $('#depositmodel').modal('show');
        $('#onlinetransfermodel').modal('hide');

    }
    if (paymethodtype == "Online Transfer") {
        $('#chequemodel').modal('hide');
        $('#depositmodel').modal('hide');
        $('#onlinetransfermodel').modal('show');

    }
}

function cmbSupplierCH() {

    grnbysuplier = httpRequest("../grn/grnlistbysupplier?supplierid=" + JSON.parse(cmbSupplier.value).id, "GET");
    fillCombo(cmbGrn, "Select GRN", grnbysuplier, "grncode", "");

    if(parseFloat(JSON.parse(cmbSupplier.value).ariasamount) != 0){

    }
    txtAriase.value = parseFloat(JSON.parse(cmbSupplier.value).ariasamount).toFixed(2);
    payment.ariaseamount = txtAriase.value;
    txtAriase.style.border = valid;

    txtTotalAmount.value = parseFloat(txtAriase.value);

    if (txtAriase.value != "") {
        //To decimal return karanne string ekak
        txtTotalAmount.value = txtAriase.value;
        payment.totalamount = txtTotalAmount.value;

    } else {

        txtTotalAmount.value = 0.00;
        payment.totalamount = 0.00;

    }

}

function loadForm() {

    payment = new Object();
    oldpayment = null;

    // Get Next Number Form Data Base
    var nextNumber = httpRequest("/payment/nextnumber", "GET");
    txtBillno.value = nextNumber.billno;
    payment.billno = txtBillno.value;
    txtBillno.disabled = "disabled";

    fillCombo(cmbSupplier, "Select Supplier", suppliers, "companyname", "");
    fillCombo(cmbPaymethod, "Select Payment Mehtode", paymentmethods, "name", "Cash");
    payment.paymentmethod_id = JSON.parse(cmbPaymethod.value);
    fillCombo(cmbPayStatus, "Select Payment Status", paymentStatuses, "name", "Paid");
    payment.paymentstatus_id = JSON.parse(cmbPayStatus.value);

    // fillCombo(cmbGrn, "Select GRN Code", grns, "grncode", "");
    //Auto fill combo box and auto bind data into object
    fillCombo(cmbEmployee, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);
    cmbEmployee.disabled = true;
    payment.employee_id = JSON.parse(cmbEmployee.value);

    dtePaidDate.value = getCurrentDateTime("datetime");
    payment.paiddatetime = dtePaidDate.value;
    dtePaidDate.disabled = true;

    dteDepositDate.value = getCurrentDateTime("datetime");
    payment.depositedatetime = dteDepositDate.value;
    dteDepositDate.disabled = true;

    dteOnlineDepositDate.value = getCurrentDateTime("datetime");
    payment.depositedatetime = dteOnlineDepositDate.value;
    dteOnlineDepositDate.disabled = true;

    dteChequeDate.min = getCurrentDateTime("datetime");
    payment.chequedate = dteChequeDate.value;

    txtAriase.disabled = true;
    txtAriase.value = 0.00;

    txtAriase.value = 0.00;
    txtGrnAmount.value = 0.00;
    txtTotalAmount.value = 0.00;
    txtPaidAmount.value = "";
    txtChequeNumber.value = "";
    txtBankName.value = "";
    txtAccountName.value = "";
    txtAccountNumber.value = "";
    txtOnlineTransferId.value = "";
    txtBalanceAmount.value = 0.00;

    setStyle(initial);
    cmbEmployee.style.border = valid;
    dtePaidDate.style.border = valid;
    txtBillno.style.border = valid;
    txtTotalAmount.style.border = valid;
    cmbPaymethod.style.border = valid;
    txtGrnAmount.style.border = valid;
    cmbPayStatus.style.border = valid;
    dteOnlineDepositDate.style.border = valid;
    txtBalanceAmount.style.border = valid;
    txtBalanceAmount.disabled = true;
    dteDepositDate.style.border = valid;

    cmbPayStatus.disabled = true;
    txtGrnAmount.disabled = true;
    txtTotalAmount.disabled = true;

    disableButtons(false, true, true);

    //refrehInnerForm();
}

function setStyle(style) {

    txtBillno.style.border = style;
    cmbSupplier.style.border = style;
    txtAriase.style.border = style;
    cmbGrn.style.border = style;
    txtGrnAmount.style.border = style;
    txtTotalAmount.style.border = style;
    cmbPaymethod.style.border = style;
    cmbPayStatus.style.border = style;
    cmbEmployee.style.border = style;
    dtePaidDate.style.border = style;
    txtPaidAmount.style.border = style;
    txtBalanceAmount.style.border = style;

    txtChequeNumber.style.border = style;
    dteChequeDate.style.border = style;

    txtBankName.style.border = style;
    txtAccountName.style.border = style;
    txtAccountNumber.style.border = style;
    dteDepositDate.style.border = style;

    txtOnlineTransferId.style.border = style;
    dteOnlineDepositDate.style.border = style;

}

function disableButtons(add, upd, del) {

    if (add || !privilages.add) {
        btnAdd.setAttribute("disabled", "disabled");
        $('#btnAdd').css('cursor', 'not-allowed');
    } else {
        btnAdd.removeAttribute("disabled");
        $('#btnAdd').css('cursor', 'pointer')
    }

    if (upd || !privilages.update) {
        btnUpdate.setAttribute("disabled", "disabled");
        $('#btnUpdate').css('cursor', 'not-allowed');
    } else {
        btnUpdate.removeAttribute("disabled");
        $('#btnUpdate').css('cursor', 'pointer');
    }

    if (!privilages.update) {
        $(".buttonup").prop('disabled', true);
        $(".buttonup").css('cursor', 'not-allowed');
    } else {
        $(".buttonup").removeAttr("disabled");
        $(".buttonup").css('cursor', 'pointer');
    }

    if (!privilages.delete) {
        $(".buttondel").prop('disabled', true);
        $(".buttondel").css('cursor', 'not-allowed');
    } else {
        $(".buttondel").removeAttr("disabled");
        $(".buttondel").css('cursor', 'pointer');
    }

    // select deleted data row
    for (index in payments) {
        tblPayment.children[1].children[index].lastChild.children[0].style.display = "none";
        tblPayment.children[1].children[index].lastChild.children[1].style.display = "none";

        if (payments[index].paymentstatus_id.name == "Deleted") {
            tblPayment.children[1].children[index].style.color = "#f00";
            tblPayment.children[1].children[index].style.border = "2px solid red";
            tblPayment.children[1].children[index].lastChild.children[1].disabled = true;
            tblPayment.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

        }
    }

}

function getErrors() {

    var errors = "";
    addvalue = "";

    if (payment.supplier_id == null)
        errors = errors + "\n" + "Enter Supplier";
    else addvalue = 1;

    if (payment.ariaseamount == null)
        errors = errors + "\n" + "Enter Ariase Amount";
    else addvalue = 1;

    if (payment.grnamount == null)
        errors = errors + "\n" + "Enter GRN Amount";
    else addvalue = 1;

    if (payment.totalamount == null)
        errors = errors + "\n" + "Enter Total Amount";
    else addvalue = 1;

    if (payment.paidamount == null)
        errors = errors + "\n" + "Enter Paid Amount";
    else addvalue = 1;

    if (payment.paymentstatus_id == null)
        errors = errors + "\n" + "Payment Status not Selected";
    else addvalue = 1;

    if (payment.balanceamount == null)
        errors = errors + "\n" + "Enter Balance Amount";
    else addvalue = 1;

    if (payment.paymentmethod_id == null)
        errors = errors + "\n" + "Payment Method not Selected";
    else addvalue = 1;

    if (payment.paiddatetime == null)
        errors = errors + "\n" + "Enter Paid Date";
    else addvalue = 1;


    return errors;

}

function btnAddMC() {
    if (getErrors() == "") {
        if (txtDescription.value == "" || cmbGrn.value == "" || txtChequeNumber.value == "" ||
            dteChequeDate.value == "" || txtBankName.value == "" || txtAccountName.value == ""
            || txtAccountNumber.value == "" || dteDepositDate.value == "" || txtOnlineBankName.value == "" ||
            txtOnlineAccountName.value == "" || txtOnlineAccountNumber.value == "" || txtOnlineAccountNumber.value == "") {
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

        } else {
            savedata();
        }
    } else {
        swal({
            title: "You have following errors",
            text: "\n" + getErrors(),
            icon: "error",
            button: true,
        });

    }
}

function savedata() {

    swal({
        title: "Are you sure to add following Payment Details...?",
        text: "\nBill Number : " + payment.billno +
            "\nPaid Date : " + payment.paiddatetime +
            "\nSupplier : " + payment.supplier_id.companyname +
            "\nAriase Amount : " + payment.ariaseamount +
            "\nGRN Amount : " + payment.grnamount +
            "\nTotal Amount : " + payment.totalamount +
            "\nPaid Amount : " + payment.paidamount +
            "\nBalance Amount : " + payment.balanceamount +
            "\nBalance Amount : " + payment.balanceamount +
            "\nPayment Method : " + payment.paymentmethod_id.name +
            "\nPayment Status : " + payment.paymentstatus_id.name +
            "\nPayment Status : " + payment.paymentstatus_id.name,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/payment", "POST", payment);
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
            } else swal({
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

    if (oldpayment == null && addvalue == "") {
        loadForm();
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                loadForm();
            }

        });
    }

}

function fillForm(po, rowno) {
    activerowno = rowno;

    if (oldpayment == null) {
        filldata(po);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(po);
            }

        });
    }

}

function loadSearchedTable() {

    var searchtext = txtSearchName.value;

    var query = "&searchtext=";

    if (searchtext != "")
        query = "&searchtext=" + searchtext;
    //window.alert(query);
    loadTable(activepage, cmbPageSize.value, query);
    disableButtons(false, true, true);

}

function btnSearchMC() {
    activepage = 1;
    loadSearchedTable();
}

function btnSearchClearMC() {
    loadView();
}

function btnPrintTableMC(payment) {
    //
    var newwindow = window.open();
    formattab = tblPayment.outerHTML;

    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 50px; '> <h1>Supplier Payment Details : </h1></div>" +
        "<div>"+ formattab+"</div>"+
        "</body>" +
        "</html>");
    setTimeout(function () {newwindow.print(); newwindow.close();},100) ;
}

function sortTable(cind) {
    cindex = cind;

    var cprop = tblPayment.firstChild.firstChild.children[cindex].getAttribute('property');

    if (cprop.indexOf('.') == -1) {
        payments.sort(
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
    } else {
        payments.sort(
            function (a, b) {
                if (a[cprop.substring(0, cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.') + 1)] < b[cprop.substring(0, cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.') + 1)]) {
                    return -1;
                } else if (a[cprop.substring(0, cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.') + 1)] > b[cprop.substring(0, cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.') + 1)]) {
                    return 1;
                } else {
                    return 0;
                }
            }
        );
    }
    fillTable('tblPayment', payments, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblPayment);
    loadForm();

    if (activerowno != "") selectRow(tblPayment, activerowno, active);


}