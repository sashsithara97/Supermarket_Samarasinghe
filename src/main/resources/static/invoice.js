window.addEventListener("load", initialize);

//Initializing Functions

function initialize() {

    $('[data-toggle="tooltip"]').tooltip();
    $('.js-example-basic-single').select2();

    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    txtSearchName.addEventListener("keyup", btnSearchMC);
    txtSearchName.addEventListener("keyup", btnSearchMC);
    cmbCustomer.addEventListener("change", cmbCustomerCH);
    cmbItem.addEventListener("change", cmbItemCH);
    cmbBatch.addEventListener("change", cmbBatchCH);
    txtQuantity.addEventListener("keyup", txtQuantityKU);
    cmbCorder.addEventListener("change", cmbCorderCH);
    txtPaidAmount.addEventListener("keyup", txtPaidAmountKU);

    privilages = httpRequest("../privilage?module=INVOICE", "GET");

    // data list for main form combo box
    customers = httpRequest("../customer/list", "GET");
    allcorders = httpRequest("../corder/list", "GET");
    corders = httpRequest("../corder/listbycorderstatus", "GET");
    cuspaymethods = httpRequest("../cuspaymethod/list", "GET");
    invoicestatuses = httpRequest("../invoicestatus/list", "GET");
    employees = httpRequest("../employee/list", "GET");

    // data list for inner form combo box
    //list all items
    allitems = httpRequest("../item/list", "GET");

    //list all items by status
    items = httpRequest("../item/listbystatus", "GET");

    batches = httpRequest("../batch/list", "GET");


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
    invoices = new Array();
    var data = httpRequest("/invoice/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) invoices = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);
    fillTable('tblInvoice', invoices, null, null, viewitem);
    clearSelection(tblInvoice);

    if (activerowno != "") selectRow(tblInvoice, activerowno, active);

}

function paginate(page) {
    var paginate;
    if (oldinvoice == null) {
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

function viewitem(invo, rowno) {

    printinvoice = JSON.parse(JSON.stringify(invo));

    tdinvinvoiceno.innerHTML =  printinvoice.invoiceno;
    tdinvcreateddatetime.innerHTML = printinvoice.createddatetime;
    tdinvtotalamount.innerHTML = printinvoice.totalamount;
    tdinvdiscountratio.innerHTML = printinvoice.discountratio;
    tdinvnetamount.innerHTML = printinvoice.netamount;
    tdinvpaidamount.innerHTML = printinvoice.paidamount;
    tdinvbalanceamount.innerHTML = printinvoice.balanceamount;
    tdinvpaymethod.innerHTML = printinvoice.cuspaymethod_id.name;
    tdinvinvoicestatus.innerHTML = printinvoice.invoicestatus_id.name;

    // for refresh inner table
    fillInnerTable("tblInvoicePrintItem", printinvoice.invoiceItemList, innerModify, innerDelete, false);

    var format = printformtable.outerHTML;

    var newwindow=window.open();
    newwindow.document.write("<html>" +
        "<head><link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body>" + "<img src='resources/image/head.png'  style='text-align: center;width:100%; opacity: 0.75;'>"+
        "<div style='margin-top: 50px'><h1 class='text-center'>Invoice Details : Samarasinghe Super</h1></div>" +
        "<div>"+format+"</div>" +
        "<script>printformtable.removeAttribute('style')</script>" +
        "<img src='resources/image/foot.png'  style='text-align: center;width:100%;opacity: 0.75'>"+
        "</body></html>");

    setTimeout(function () {
       // newwindow.print();
      //  newwindow.close();
        },500);


}

function cmbCustomerCH() {

    if (cmbCustomer.value != "") {
        txtCustname.value = JSON.parse(cmbCustomer.value).contactname;
        invoice.cusname = txtCustname.value;
        txtCustmobile.value = JSON.parse(cmbCustomer.value).mobile;
        invoice.cusmobile = txtCustmobile.value;
        txtCustname.style.border = valid;
        txtCustmobile.style.border = valid;

        cmbCorder.disabled = false;
        corderbycustomer = httpRequest("../corder/listbycustomer?customerid=" + JSON.parse(cmbCustomer.value).id, "GET");
        fillCombo(cmbCorder, "Select Customer Order", corderbycustomer, "cordercode", "");
        cmbCorder.style.border = initial;

    } else {
        txtCustname.style.border = initial;
        txtCustmobile.style.border = initial;
        cmbCorder.style.border = initial;
        txtCustname.value = "";
        txtCustmobile.value = "";
        cmbCorder.disabled = true;
    }
}

function cmbCorderCH(){

    corderitem = httpRequest("../item/itemlistbycorder?corderid=" + JSON.parse(cmbCorder.value).id, "GET");
    fillCombo(cmbItem, "Select Item", corderitem, "itemname");
    invoiceItem.item_id = JSON.parse(cmbItem.value).itemname;
    cmbItem.style.border = valid;

}

/*
function clearInnerData(){

    cmbBatch.style.border = initial;
    txtQuantity.style.border = initial;
    txtLineTotal.style.border = initial;
    txtSalesPrice.style.border = initial;
    txtLastSalesPrice.style.border = initial;

    txtQuantity.value = "";
    txtLineTotal.value = "";
    txtSalesPrice.value = "";
    txtLastSalesPrice.value = "";

    batchlistbyitem = httpRequest("../batch/invoicebatchlistbyitem?itemid=" + JSON.parse(cmbItem.value).id, "GET");
    fillCombo3(cmbBatch, "Select Batch", batchlistbyitem, "batchcode", "salesprice");


}
*/

function cmbItemCH() {

    cmbBatch.disabled = false;
    batchlistbyitem = httpRequest("../batch/invoicebatchlistbyitem?itemid=" + JSON.parse(cmbItem.value).id, "GET");
    fillCombo3(cmbBatch, "Select Batch", batchlistbyitem, "batchcode", "salesprice");
    invoiceItem.batch_id = JSON.parse(cmbBatch.value).batchcode;
    cmbBatch.style.border = valid;

    cmbBatch.style.border = initial;
    txtQuantity.style.border = initial;
    txtLineTotal.style.border = initial;
    txtSalesPrice.style.border = initial;
    txtLastSalesPrice.style.border = initial;

    txtQuantity.value = "";
    txtLineTotal.value = "";
    txtSalesPrice.value = "";
    txtLastSalesPrice.value = "";

}

function txtPaidAmountKU() {

        paid = parseFloat(txtPaidAmount.value);
        nettotal = parseFloat(txtNetAmount.value);

    console.log(paid);
    console.log(nettotal);

        if(txtPaidAmount.value != 0) {

            if (paid < nettotal) {

                console.log('a');
                txtPaidAmount.style.border = invalid;
                txtBalance.style.border = initial;
                txtBalance.value = 0.00;


            } else if (paid >= nettotal){
                console.log('b');
                txtBalance.value = (paid - nettotal).toFixed(2);
                invoice.balanceamount = txtBalance.value;
                txtBalance.style.border = valid;

            }

        }else {
            console.log('c');
            txtPaidAmount.style.border = invalid;
            txtBalance.style.border = initial;
            txtBalance.value = 0.00;

        }

}

function cmbBatchCH() {

    txtSalesPrice.value = (JSON.parse(cmbBatch.value).salesprice).toFixed(2);
    txtSalesPrice.style.border = valid;
    invoiceItem.salesprice = txtSalesPrice.value
    txtSalesPrice.disabled = true;

    txtLastSalesPrice.value = (JSON.parse(cmbBatch.value).salesprice).toFixed(2);
    txtLastSalesPrice.style.border = valid;
    txtLastSalesPrice.value = parseFloat(txtSalesPrice.value) - (parseFloat(txtSalesPrice.value) * parseFloat(JSON.parse(cmbBatch.value).discount)/100);
    invoiceItem.lastsalesprice = txtLastSalesPrice.value
    txtLastSalesPrice.disabled = true;



}

function txtQuantityKU() {

    if (txtQuantity.value > 0) {
        txtLineTotal.value = (parseFloat(txtLastSalesPrice.value) * parseFloat(txtQuantity.value)).toFixed(2);
        invoiceItem.linetotal = txtLineTotal.value;
        txtLineTotal.style.border = valid;
    } else {
        txtQuantity.style.border = invalid;
        txtLineTotal.value = "";
        invoiceItem.linetotal = null;
        txtLineTotal.style.border = initial;
        swal({
            icon: "warning",
            text: '\n Quantity Cann\'t Be 0   ',
            button: false,
            timer: 1500,
        });
    }

}

function loadForm() {
    invoice  = new Object();
    oldinvoice = null;

    invoice.invoiceItemList = new Array();

    // Get Next Number Form Data Base
    var nextNumber = httpRequest("/invoice/nextnumber", "GET");
    txtInvoiceNumber.value = nextNumber.invoiceno;
    invoice.invoiceno = txtInvoiceNumber.value;
    txtInvoiceNumber.disabled = "disabled";

    fillCombo3(cmbCustomer, "Select Customer", customers, "contactname", "mobile");
    fillCombo(cmbInvoiceStatus, "Select Invoice Status", invoicestatuses, "name", "Created");
        cmbInvoiceStatus.disabled = true;
    invoice.invoicestatus_id = JSON.parse(cmbInvoiceStatus.value);
    fillCombo(cmbPayMethod, "Select Payment Method", cuspaymethods, "name", "Cash");
    invoice.cuspaymethod_id = JSON.parse(cmbPayMethod.value);
    //Auto fill combo box and auto bind data into object
    fillCombo(cmbEmployee, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);
    cmbEmployee.disabled = true;
    invoice.employee_id = JSON.parse(cmbEmployee.value);

    dteCreatedDate.value = getCurrentDateTime("datetime");
    invoice.createddatetime = dteCreatedDate.value;
    dteCreatedDate.disabled = true;

    txtTotalAmount.value = "0.00";
    txtCustmobile.value = "";
    txtCustname.value = "";
    txtDiscountratio.value = "0.00";
    invoice.discountratio = txtDiscountratio.value;
    txtNetAmount.value = "0.00";
    txtPaidAmount.value = "0.00";
    txtDescription.value = "";
    txtBalance.value = "0.00";

    setStyle(initial);

    cmbEmployee.style.border = valid;
    dteCreatedDate.style.border = valid;
    txtInvoiceNumber.style.border = valid;
    cmbInvoiceStatus.style.border = valid;
    txtTotalAmount.style.border = valid;
    txtNetAmount.style.border = valid;
    txtBalance.style.border = valid;
    cmbPayMethod.style.border = valid;
    txtDiscountratio.style.border = valid;

    cmbCorder.disabled = true;
    txtNetAmount.disabled = true;
    txtBalance.disabled = true;
    txtTotalAmount.disabled = true;

    disableButtons(false, true, true);

    refrehInnerForm();
}

function setStyle(style) {

    $("#selectCustomerParent .select2-container").css('border',style);

    txtInvoiceNumber.style.border = style;
    cmbCustomer.style.border = style;
    cmbCorder.style.border = style;
    txtTotalAmount.style.border = style;
    txtDiscountratio.style.border = style;
    txtNetAmount.style.border = style;
    txtPaidAmount.style.border = style;
    txtDescription.style.border = style;
    txtBalance.style.border = style;
    cmbEmployee.style.border = style;
    cmbPayMethod.style.border = style;
    cmbInvoiceStatus.style.border = style;
    dteCreatedDate.style.border = style;
    cmbItem.style.border = style;
    cmbBatch.style.border = style;
    txtSalesPrice.style.border = style;
    txtQuantity.style.border = style;
    txtLineTotal.style.border = style;
    txtCustmobile.style.border = style;
    txtCustname.style.border = style;

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
    for (index in invoices) {
        tblInvoice.children[1].children[index].lastChild.children[0].style.display = "none";
        tblInvoice.children[1].children[index].lastChild.children[1].style.display = "none";

    }


}

function refrehInnerForm() {

    invoiceItem = new Object();
    oldinvoiceItem = null;

    var totalamount = 0;

    fillCombo(cmbItem, "Select Item", items, "itemname", "");


    cmbItem.style.border = initial;
    cmbBatch.style.border = initial;
    txtQuantity.style.border = initial;
    txtLineTotal.style.border = initial;
    txtSalesPrice.style.border = initial;
    txtLastSalesPrice.style.border = initial;
    cmbBatch.disabled = true;

    txtQuantity.value = "";
    txtLineTotal.value = "";
    txtSalesPrice.value = "";
    txtLastSalesPrice.value = "";

    // for refresh inner table
    fillInnerTable("tblInvoiceItem", invoice.invoiceItemList, innerModify, innerDelete, false);

    //calculate total Amount and net amount
    if (invoice.invoiceItemList.length != 0) {
        for (var index in invoice.invoiceItemList) {

            totalamount = (parseFloat(totalamount) + parseFloat(invoice.invoiceItemList[index].linetotal)).toFixed(2);
        }

        txtTotalAmount.value = totalamount;
        invoice.totalamount = txtTotalAmount.value;
        if (oldinvoice != null && invoice.totalamount != oldinvoice.totalamount) {
            txtTotalAmount.style.border = updated;
        } else {
            txtTotalAmount.style.border = valid;
        }
    }

    let total = parseFloat( txtTotalAmount.value);

    txtNetAmount.value = (parseFloat(txtTotalAmount.value) - (parseFloat(txtTotalAmount.value) * parseFloat(txtDiscountratio.value) / 100)).toFixed(2);
    invoice.netamount = txtNetAmount.value;

   /* //Discount Calculation according to Invoice amount
    if (total <= 1000) {
            txtDiscountratio.value = 2;
            invoice.discountratio = txtDiscountratio.value;

        } else if (total <= 5000) {
            txtDiscountratio.value = 5;
            invoice.discountratio = txtDiscountratio.value;

        } else if (total <= 10000) {

            txtDiscountratio.value = 10;
            invoice.discountratio = txtDiscountratio.value;
        }*/



}

function btnInnerAddMC() {

    var extbc = false;
    for (var index in invoice.invoiceItemList) {
        if (invoice.invoiceItemList[index].item_id.itemname == invoiceItem.item_id.itemname) {
            extbc = true;
            break;
        }
    }

    if (extbc) {
        swal({
            title: "All ready Exist....!",
            text: "\n\n",
            icon: "waring", button: false, timer: 1200,
        });
    } else {
        swal({
            title: "Added Successfully....!",
            text: "\n\n",
            icon: "success", button: false, timer: 1200,
        });
        invoice.invoiceItemList.push(invoiceItem);

        refrehInnerForm();

    }

}

function innerModify() {
}

function innerDelete(innerob, ind) {
    invoiceItem = innerob;
    swal({
        title: "Are you sure to delete following Invoice Item..?",
        text: "\n Item Name : " + invoiceItem.item_id.itemname +
            "\n Sales Price : " + invoiceItem.salesprice +
            "\n Quantity : " + invoiceItem.qty,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            invoice.invoiceItemList.splice(ind, 1);
            swal({
                title: "Removed Successfully....!",
                text: "\n\n",
                icon: "success", button: false, timer: 1200,
            });
            refrehInnerForm();

        }
    });

}

function innerView() {
}

function getErrors() {

    var errors = "";
    addvalue = "";

    if (invoice.totalamount == null)
        errors = errors + "\n" + "Enter Total Amount";
    else addvalue = 1;

    if (invoice.discountratio == null)
        errors = errors + "\n" + "Discout Ratio";
    else addvalue = 1;

    if (invoice.netamount == null)
        errors = errors + "\n" + "Net Amount";
    else addvalue = 1;

    if (invoice.paidamount == null)
        errors = errors + "\n" + "Paid Amount";
    else addvalue = 1;

    if (invoice.balanceamount == null)
        errors = errors + "\n" + "Balance Amount";
    else addvalue = 1;

    if (invoice.invoicestatus_id == null)
        errors = errors + "\n" + "Invoice Status not Selected";
    else addvalue = 1;

    if (invoice.cuspaymethod_id == null)
        errors = errors + "\n" + "Payment Method not Selected";
    else addvalue = 1;

    return errors;

}

function btnAddMC() {
    if (getErrors() == "") {
        if (txtDescription.value == "" || cmbCustomer.value == "" || cmbCorder.value == "" || txtCustname.value == ""
            || txtCustmobile.value == "") {
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
        title: "Are you sure to add following Invoice...?",
        text: "\nInvoice Number : " + invoice.invoiceno +
            "\nDiscount Ratio : " + invoice.discountratio +
            "\nCreated Date : " + invoice.createddatetime +
            "\nTotal Amount : " + invoice.totalamount +
            "\nNet Amount : " + invoice.netamount +
            "\nBalance Amount : " + invoice.balanceamount +
            "\nInvoice Status : " + invoice.invoicestatus_id.name,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/invoice", "POST", invoice);
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
                viewitem(invoice);
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

    if (oldinvoice == null && addvalue == "") {
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

function btnPrintTableMC(invoice) {

    var newwindow = window.open();
    formattab = tblInvoice.outerHTML;

    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='../plugin/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 150px; '> <h1>Invoice Details : </h1></div>" +
        "<div>" + formattab + "</div>" +
        "</body>" +
        "</html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 100);
}

function sortTable(cind) {
    cindex = cind;

    var cprop = tblInvoice.firstChild.firstChild.children[cindex].getAttribute('property');

    if (cprop.indexOf('.') == -1) {
        invoices.sort(
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
        invoices.sort(
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
    fillTable('tblInvoice', invoices, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblInvoice);
    loadForm();

    if (activerowno != "") selectRow(tblInvoice, activerowno, active);


}