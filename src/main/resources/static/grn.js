window.addEventListener("load", initialize);

//Initializing Functions

function initialize() {

    $('[data-toggle="tooltip"]').tooltip();

    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);
    txtReceivedQty.addEventListener("keyup", ReceivedQtyKU);
    txtReceivedQty.addEventListener("keyup", calculateTotalKU);
    txtFreeQty.addEventListener("keyup", calculateTotalKU);
    txtReturnQty.addEventListener("keyup", calculateTotalKU);
    txtSearchName.addEventListener("keyup", btnSearchMC);
    txtBatch.addEventListener("keyup", txtBatchKU);

    cmbGType.addEventListener("change", cmbGTypeCH);
    cmbSupplier.addEventListener("change", cmbSupplierCH);
    cmbPorder.addEventListener("change", cmbPorderCH);
    cmbSupplierReturn.addEventListener("change",cmbSupplierReturnCH);
    txtDiscountRatio.addEventListener("keyup", txtDiscountRatioKU);

    privilages = httpRequest("../privilage?module=GRN", "GET");

    // data list for main form combo box
    // data list for New and Regular Suppliers list
    suppliers = httpRequest("../supplier/listbysupplierstatus", "GET");

    allsuppliers = httpRequest("../supplier/list", "GET");

    grntypes = httpRequest("../grntype/list", "GET");
    porders = httpRequest("../porder/list", "GET");
    supplierreturns = httpRequest("../supplierreturn/list", "GET");
    grnstatuses = httpRequest("../grnstatus/list", "GET");
    employees = httpRequest("../employee/list", "GET");

    //Inner Form
    items = httpRequest("../item/list", "GET");
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
    grns = new Array();
    var data = httpRequest("/grn/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) grns = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);
    fillTable('tblGRN', grns, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblGRN);

    if (activerowno != "") selectRow(tblGRN, activerowno, active);

}

function paginate(page) {
    var paginate;
    if (oldgrn == null) {
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

function viewitem(gr, rowno) {

    printgrn = JSON.parse(JSON.stringify(gr));

    tdgcode.setAttribute('value', printgrn.grncode);
    tdsupplier.innerHTML = printgrn.supplier_id.companyname;
    tdgtype.innerHTML = printgrn.grntype_id.name;
    tdgstatus.innerHTML = printgrn.grnstatus_id.name;
    tdgsupplierbillno.innerHTML = printgrn.supplierbillno;
    tdgreturnamount.innerHTML = printgrn.returnamount;
    tdgtotalamount.innerHTML = printgrn.totalamount;
    tdgnettotal.innerHTML = printgrn.nettotal;
    tdgdiscountratio.innerHTML = printgrn.discountratio;
    tdggrossamount.innerHTML = printgrn.grossamount;
    tdaddeddate.innerHTML = printgrn.addeddate;
    tdreceiveddate.innerHTML = printgrn.receiveddate;

    var format = printformtable.outerHTML;

    var newwindow=window.open();
    newwindow.document.write("<html>" +
        "<head><link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 50px'><h1>GRN Details :</h1></div>" +
        "<div>"+format+"</div>" +
        "<script>printformtable.removeAttribute('style')</script>" +
        "</body></html>");
    setTimeout(function () {newwindow.print(); newwindow.close();},100);
}

function cmbGTypeCH() {

    //id = 1 Porder Only
    //id = 2 Return Only
    //id = 3 Porder With Return Amount
    //id = 4 Porder with Return Item

    let gvalue = JSON.parse(cmbGType.value).id;


    if (gvalue == 1) {

        cmbSupplierReturn.disabled = true;
        supplierreturnspan.style.display = "none";
        cmbPorder.disabled = false;
        porderspan.style.display = "contents";

    } else if (gvalue == 2) {

        cmbSupplierReturn.disabled = false;
        supplierreturnspan.style.display = "contents";
        cmbPorder.disabled = true;
        cmbPorder.style.border = initial;
        porderspan.style.display = "none";


    } else {

        cmbSupplierReturn.disabled = false;
        cmbPorder.disabled = false;
        supplierreturnspan.style.display = "contents";
        porderspan.style.display = "contents";

    }

   refrehInnerForm();
    fillCombo(cmbPorder, "Select Porder",[], "pordercode", "");
    fillCombo(cmbSupplierReturn, "Select Supplier Return",[], "supplierreturnno", "");
    fillCombo(cmbSupplier, "Select Supplier", suppliers, "companyname", "");


}

function txtDiscountRatioKU(){

    if(txtDiscountRatio.value == ""){
        txtGrossAmount.style.border = initial;
        txtGrossAmount.value = "";

        swal({
            title: "Discount ratio cannot be empty....!",
            text: "\n\n",
            icon: "warning", button: false, timer: 1200,
        });

    }else {

        discount = parseFloat(txtDiscountRatio.value);
        grosstotal = parseFloat(txtNetTotal.value) -  (parseFloat(txtNetTotal.value) * (discount/100));
        txtGrossAmount.value = grosstotal;
        grn.grossamount = txtGrossAmount.value;

    }
}

function cmbSupplierReturnCH(){

 if(cmbPorder.value != null && cmbSupplierReturn.value!=null){

     if(JSON.parse(cmbGType.value).id == 3){

         txtReturn.value = JSON.parse(cmbSupplierReturn.value).returntotalamount;
         grn.returnamount =  txtReturn.value;

     }
     else if(JSON.parse(cmbGType.value).id == 4){

         itemsbyporderandsupplierreturn = httpRequest("../item/listbyporderandsupplierreturn?porderid="+JSON.parse(cmbPorder.value).id +"&supplierreturnid="+ JSON.parse(cmbSupplierReturn.value).id,"GET");
         fillCombo3(cmbItem,"Select Item",itemsbyporderandsupplierreturn,"itemname",'itemcode','');
         cmbItem.disabled = false;
         txtReturn.value = 0;

     }

 }


}

function cmbSupplierCH() {

    porderbysupplierlist = httpRequest("../porder/porderlistbysupplier?supplierid=" + JSON.parse(cmbSupplier.value).id, "GET");
    fillCombo(cmbPorder, "Select Porder", porderbysupplierlist, "pordercode", "");

    supplierreturnbysupplierlist = httpRequest("../supplierreturn/supplierreturnlistbysupplier?supplierid=" + JSON.parse(cmbSupplier.value).id, "GET");
    fillCombo(cmbSupplierReturn, "Select Supplier Return Code", supplierreturnbysupplierlist, "supplierreturnno", "");
    cmbSupplier.style.border = valid;

  }

function cmbPorderCH() {
    itemlistbyporder = httpRequest("../item/listbyporder?porderid=" + JSON.parse(cmbPorder.value).id, "GET");
    fillCombo3(cmbItem, "Select Item",itemlistbyporder, "itemcode", "itemname");
    cmbItem.disabled = false;

    console.log(itemlistbyporder);

}

function loadForm() {
    grn = new Object();
    oldgrn = null;

    grn.grnBatchList = new Array();

    // Get Next Number Form Data Base
    var nextNumber = httpRequest("/grn/nextnumber", "GET");
    txtGrnCode.value = nextNumber.grncode;
    grn.grncode = txtGrnCode.value;
    txtGrnCode.disabled = "disabled";

    fillCombo(cmbSupplier, "Select Supplier", suppliers, "companyname", "");
    fillCombo(cmbGType, "Select GRN Type", grntypes, "name", "");
    fillCombo(cmbPorder, "Select Porder", porders, "pordercode", "");

    fillCombo(cmbSupplierReturn, "Select Porder Status", supplierreturns, "supplierreturnno", "");
    fillCombo(cmbGRNStatus, "Select Porder Status", grnstatuses, "name", "Pending");
    grn.grnstatus_id = JSON.parse(cmbGRNStatus.value);
    cmbGRNStatus.disabled = true;

    //Auto fill combo box and auto bind data into object
    fillCombo(cmbEmployee, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);
    cmbEmployee.disabled = true;
    grn.employee_id = JSON.parse(cmbEmployee.value);

    dteAddedDate.value = getCurrentDateTime("date");
    grn.addeddate = dteAddedDate.value;
    dteAddedDate.disabled = true;

    dteReceivedDate.min = getCurrentDateTime("date");
    let mindate = new Date();
    mindate.setDate(mindate.getDate() - 3);
    dteReceivedDate.min = mindate.getFullYear() + "-" + getmonthdate(mindate);
    dteReceivedDate.max = getCurrentDateTime("date");
    grn.receiveddate = dteReceivedDate.value;

    txtSupBill.value = "";
    txtDescription.value = "";
    txtReturn.value = 0;
    txtTotal.value = 0;
    txtNetTotal.value = 0;
    txtDiscountRatio.value = 0;
    txtGrossAmount.value = 0;


    //object binding
    grn.returnamount = txtReturn.value;
    grn.totalamount = txtTotal.value;
    grn.nettotal = txtNetTotal.value;
    grn.discountratio = txtDiscountRatio.value;
    grn.grossamount = txtGrossAmount.value;

    setStyle(initial);
    cmbEmployee.style.border = valid;
    dteAddedDate.style.border = valid;
    txtGrnCode.style.border = valid;
    cmbGRNStatus.style.border = valid;

    txtReturn.disabled = true;
    txtTotal.disabled = true;
    txtNetTotal.disabled = true;
    txtGrossAmount.disabled = true;
    cmbPorder.disabled = true;
    cmbSupplierReturn.disabled = true;

    txtReturn.style.border = valid;
    txtTotal.style.border = valid;
    txtNetTotal.style.border = valid;
    txtGrossAmount.style.border = valid;

    //innerform eke item combo disable karala
    cmbItem.disabled = true;
    disableButtons(false, true, true);
    refrehInnerForm();
}

function txtBatchKU(){

    batchbyitemandbatch = httpRequest("../batch/batchlistbybatch?itemid="+JSON.parse(cmbItem.value).id + "&batchcode=" + txtBatch.value,"GET");

    //me object eke ena eka not equal to empty kiyanne ehema ekak thiyenwa kiyana eka
    if(batchbyitemandbatch != ""){

        txtPurchasePrice.value = batchbyitemandbatch.purchaseprice;
        txtSalesPrice.value = batchbyitemandbatch.salesprice;
        dteManufacturedDate.value = batchbyitemandbatch.mfgdate;
        dteExpiredDate.value = batchbyitemandbatch.expdate;

        batch.batchcode = txtBatch.value;
        batch.purchaseprice = txtPurchasePrice.value;
        batch.salesprice = txtSalesPrice.value;
        batch.mfgdate = dteManufacturedDate.value;
        batch.expdate = dteExpiredDate.value;

        txtPurchasePrice.style.border = valid;
        txtSalesPrice.style.border = valid;
        dteManufacturedDate.style.border = valid;
        dteExpiredDate.style.border = valid;

    }else{
        txtPurchasePrice.value = 0;
        txtSalesPrice.value = 0;
        txtPurchasePrice.style.border = initial;
        txtSalesPrice.style.border = initial;
    }

}


function setStyle(style) {

    txtGrnCode.style.border = style;
    cmbSupplier.style.border = style;
    cmbGType.style.border = style;
    txtSupBill.style.border = style;
    cmbPorder.style.border = style;
    cmbSupplierReturn.style.border = style;
    txtDescription.style.border = style;
    txtReturn.style.border = style;
    txtTotal.style.border = style;
    txtNetTotal.style.border = style;
    txtDiscountRatio.style.border = style;
    txtGrossAmount.style.border = style;
    cmbGRNStatus.style.border = style;
    dteAddedDate.style.border = style;
    dteReceivedDate.style.border = style;
    cmbEmployee.style.border = style;

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
    for (index in grns) {
        tblGRN.children[1].children[index].lastChild.children[0].style.display = "none";
        tblGRN.children[1].children[index].lastChild.children[1].style.display = "none";

        if (grns[index].grnstatus_id.name == "Deleted") {
            tblGRN.children[1].children[index].style.color = "#f00";
            tblGRN.children[1].children[index].style.border = "2px solid red";
            tblGRN.children[1].children[index].lastChild.children[1].disabled = true;
            tblGRN.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

        }
    }

}

function calculateTotalKU(){

    txtTotalReceivedQty.value = parseFloat(txtReceivedQty.value) + parseFloat(txtFreeQty.value) + parseFloat(txtReturnQty.value);
    grnBatch.totalrqty =  txtTotalReceivedQty.value;
    txtTotalReceivedQty.style.border = valid;
   }

function ReceivedQtyKU() {

    if(txtReceivedQty.value != 0 ){

        var purchase = parseFloat(txtPurchasePrice.value);
        var received = parseFloat(txtReceivedQty.value);
        var discountbatch = parseFloat(txtDiscount.value);

        txtLineTotal.value = ((purchase * received) - (((purchase * received) * discountbatch)/100)).toFixed(2) ;
        grnBatch.linetotal = txtLineTotal.value;
        txtLineTotal.style.border=valid;

    }else {

        txtReceivedQty.style.border = invalid;
        txtLineTotal.value = "";
        grnBatch.linetotal = null;
        txtLineTotal.style.border = initial;
        swal({
            icon: "warning",
            text: '\n Quantity Cann\'t Be 0   ',
            button: false,
            timer: 1500,});
    }

}

function refrehInnerForm() {

    grnBatch = new Object();
    oldgrnBatch = null;

    batch = new Object();
    oldbatch = null;
    batch.discount = 0.00;
    var totalamount = 0;

    // porder ekak thiyenwanm witharai filtering call wenne
   if( cmbPorder.value != ""){
       cmbPorderCH();
   }else{
       fillCombo(cmbItem, "Select Item",[], "itemcode", "");
   }

    txtBatch.style.border = initial;
    cmbItem.style.border = initial;
    txtPurchasePrice.style.border = initial;
    txtSalesPrice.style.border = initial;
    txtLineTotal.style.border = initial;
    dteManufacturedDate.style.border = initial;
    dteExpiredDate.style.border = initial;
    txtDiscount.style.border = initial;

    txtPurchasePrice.value = "";
    txtBatch.value = "";
    txtSalesPrice.value = "";
    txtReceivedQty.value = 0;
    txtFreeQty.value = 0;
    txtReturnQty.value = 0;
    txtTotalReceivedQty.value = 0;
    txtTotalReceivedQty.disabled = true;
    dteManufacturedDate.value = "";
    dteExpiredDate.value = "";
    txtDiscount.value = 0.00;
    txtLineTotal.value = "";
    txtLineTotal.disabled = true;

    grnBatch.receivedqty = txtReceivedQty.value;
     grnBatch.freeqty = txtFreeQty.value;
     grnBatch.returnqty = txtReturnQty.value;
     batch.returnqty = txtReturnQty.value;
     grnBatch.totalrqty = txtTotalReceivedQty.value;
     grnBatch.discount = txtDiscount.value;

    txtReceivedQty.style.border = valid;
    txtFreeQty.style.border = valid;
    txtReturnQty.style.border = valid;
    txtTotalReceivedQty.style.border = valid;

    cmbItem.disabled=true;
    // for refresh inner table
    fillInnerTable("tblGrnBatch", grn.grnBatchList, innerModify, innerDelete, false);


    if(grn.grnBatchList.length != 0){

   for(var index in grn.grnBatchList){

                totalamount = (parseFloat(totalamount) + parseFloat(grn.grnBatchList[index].linetotal)).toFixed(2);
                grnBatch.linetotal = totalamount;
            }

            txtTotal.value = totalamount;
            grn.totalamount = txtTotal.value;

            if(oldgrn != null && grn.totalamount != oldgrn.totalamount){
                txtTotal.style.border = updated;
            }else {
                txtTotal.style.border = valid;
            }

        txtNetTotal.value = (parseFloat(txtTotal.value) - parseFloat(txtReturn.value)).toFixed(2);
        grn.nettotal =  txtNetTotal.value;

        }

    dteExpiredDate.min = getCurrentDateTime("date");
    batch.expdate = dteExpiredDate.value;

    dteManufacturedDate.max = getCurrentDateTime("date");
    batch.mfgdate = dteManufacturedDate.value;

    txtDiscountRatioKU();

}

function btnInnerAddMC() {

    //Grn has batch kiyana table eketh purchase price thiyee...ethkota batch ekatai grnhasbatch dekatama purchase price set wenna
    //oni
    grnBatch.purchaseprice = batch.purchaseprice;
    grnBatch.returnqty = batch.returnqty;
    grnBatch.batch_id = batch;
    grnBatch.discount = discount;

    var extbc = false;
    for (var index in grn.grnBatchList) {
        if (grn.grnBatchList[index].batch_id.batchcode == grnBatch.batch_id.batchcode && grn.grnBatchList[index].batch_id.item_id.id == grnBatch.batch_id.item_id.id) {
            extbc = true;
            break;
        }
    }

    if (extbc) {
        swal({
            title: "All ready Exist....!",
            text: "\n\n",
            icon: "warning", button: false, timer: 1200,
        });
    } else {
        swal({
            title: "Added Successfully....!",
            text: "\n\n",
            icon: "success", button: false, timer: 1200,
        });
        grn.grnBatchList.push(grnBatch);
        refrehInnerForm();

    }

}

function innerModify() {
}

function btnInnerClearMC(){
    swal({
        title: " Are you sure to discard the form ?",
        text: "\n",
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            refrehInnerForm();
        }

    });

}

function innerDelete(innerob, ind) {
    grnBatch = innerob;
    swal({
        title: "Are you sure to delete following GRN Batch..?",
        text: "\n Batch Code: " + grnBatch.batch_id.batchcode +
            "\n Purchase Price : " + grnBatch.purchaseprice +
            "\n Line Total : " + grnBatch.linetotal,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            porder.porderItemList.splice(ind, 1);
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

    if (grn.supplier_id == null)
        errors = errors + "\n" + "Supplier not Selected";
    else addvalue = 1;

    if (grn.grntype_id == null)
        errors = errors + "\n" + "GRN Type not Selected";
    else addvalue = 1;

    if (grn.supplierbillno == null)
        errors = errors + "\n" + "Enter Supplier Bill number";
    else addvalue = 1;

    if (grn.returnamount == null)
        errors = errors + "\n" + "Enter Return Amount";
    else addvalue = 1;

    if (grn.totalamount == null)
        errors = errors + "\n" + "Enter Total Amount";
    else addvalue = 1;

    if (grn.nettotal == null)
        errors = errors + "\n" + "Enter Net Total";
    else addvalue = 1;

    if (grn.discountratio == null)
        errors = errors + "\n" + "Enter Discount Ratio";
    else addvalue = 1;

    if (grn.grossamount == null)
        errors = errors + "\n" + "Enter Gross Amount";
    else addvalue = 1;

    if (grn.grnstatus_id == null)
        errors = errors + "\n" + "GRN Status not Selected";
    else addvalue = 1;

    if (grn.receiveddate == null)
        errors = errors + "\n" + "Enter received date";
    else addvalue = 1;

    return errors;

}

function btnAddMC() {
    if (getErrors() == "") {
        if (txtDescription.value == "") {
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
        title: "Are you sure to add following grn...?",
        text: "\nGrn Code : " + grn.grncode +
            "\nAdded Date : " + grn.supplier_id.companyname +
            "\nRequired Date : " + grn.grntype_id.name +
            "\nPorder Code : " + grn.porder_id.pordercode +
            "\nReturn Amount : " + grn.returnamount +
            "\nTotal Amount : " + grn.totalamount +
            "\nNet Total : " + grn.nettotal +
            "\nDiscount Ratio : " + grn.discountratio +
            "\nGross Amount : " + grn.grossamount +
            "\nStatus : " + grn.grnstatus_id.name +
            "\nAdded Employee : " + grn.employee_id.callingname +
            "\nReceived Date : " + grn.receiveddate,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/grn", "POST", grn);
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

    if (oldgrn == null && addvalue == "") {
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

function fillForm(gr, rowno) {
    activerowno = rowno;

    if (oldgrn == null) {
        filldata(gr);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(gr);
            }

        });
    }

}

function filldata(gr) {

    clearSelection(tblGRN);
    selectRow(tblGRN, activerowno, active);

    grn = JSON.parse(JSON.stringify(gr));
    oldgrn = JSON.parse(JSON.stringify(gr));

    txtGrnCode.value = grn.grncode;
    txtGrnCode.disabled = "disabled";

    txtSupBill.value = grn.supplierbillno;
    txtDescription.value = grn.description;
    txtReturn.value = grn.returnamount;
    txtTotal.value = grn.totalamount;
    txtNetTotal.value = grn.nettotal;
    txtDiscountRatio.value = grn.discountratio;
    txtGrossAmount.value = grn.grossamount;
    dteAddedDate.value = grn.addeddate;
    dteReceivedDate.value = grn.receiveddate;

    suppliers = httpRequest("../supplier/list", "GET");
    grntypes = httpRequest("../grntype/list", "GET");
    porders = httpRequest("../porder/list", "GET");
    supplierreturns = httpRequest("../supplierreturn/list", "GET");
    grnstatuses = httpRequest("../grnstatus/list", "GET");
    employees = httpRequest("../employee/list", "GET");

    fillCombo(cmbSupplier, "Select Supplier", suppliers, "companyname", grn.supplier_id.companyname);
    fillCombo(cmbGType, "Select GRN type", grntypes, "name", grn.grntype_id.name);
    fillCombo(cmbPorder, "Select Porder Code", porders, "pordercode", grn.porder_id.pordercode);
    fillCombo(cmbSupplierReturn, "Select Supplier Return Code", supplierreturns, "supplierreturnno", grn.supplierreturn_id.supplierreturnno);
    fillCombo(cmbGRNStatus, "Select GRN Status", grnstatuses, "name", grn.grnstatus_id.name);
    fillCombo(cmbEmployee, "Select Employee", employees, "callingname", grn.employee_id.callingname);

    cmbEmployee.disabled = true;

    disableButtons(true, false, false);
    setStyle(valid);
    changeTab('form');
}

function getUpdates() {

    var updates = "";

    if (grn != null && oldgrn != null) {


        if (grn.grncode != oldgrn.grncode)
            updates = updates + "\nGrn Code is Changed";

        if (grn.grntype_id.name != oldgrn.grntype_id.name)
            updates = updates + "\nGRN Typpe is Changed";

        if (grn.supplierbillno != oldgrn.supplierbillno)
            updates = updates + "\Supplier Bill Number is Changed";

        if (grn.porder_id.pordercode != oldgrn.porder_id.pordercode)
            updates = updates + "\nPorder Code is Changed";

        if (grn.supplierreturn_id.supplierreturnno != oldgrn.supplierreturn_id.supplierreturnno)
            updates = updates + "\nSupplier Return Code is Changed";

        if (grn.description != oldgrn.description)
            updates = updates + "\nDescription is Changed";

        if (grn.returnamount != oldgrn.returnamount)
            updates = updates + "\Return Amount is Changed";

        if (grn.returnamount != oldgrn.totalamount)
            updates = updates + "\nTotal Amount is Changed";

        if (grn.nettotal != oldgrn.nettotal)
            updates = updates + "\nNet Total is Changed";

        if (grn.discountratio != oldgrn.discountratio)
            updates = updates + "\nDiscount ratio  is Changed";

        if (grn.grossamount != oldgrn.grossamount)
            updates = updates + "\nGross Amount is Changed";

        if (grn.grnstatus_id.name != oldgrn.grnstatus_id.name)
            updates = updates + "\n Grn Status is Changed";

        if (grn.receiveddate != oldgrn.receiveddate)
            updates = updates + "\nReceived Date is Changed";

    }

    return updates;

}

function btnUpdateMC() {
    var errors = getErrors();
    if (errors == "") {
        var updates = getUpdates();
        if (updates == "")
            swal({
                title: 'Nothing Updated..!', icon: "warning",
                text: '\n',
                button: false,
                timer: 1200
            });
        else {
            swal({
                title: "Are you sure to update following porder details...?",
                text: "\n" + getUpdates(),
                icon: "warning", buttons: true, dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        var response = httpRequest("/grn", "PUT", grn);
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

                        } else window.alert("Failed to Update as \n\n" + response);
                    }
                });
        }
    } else
        swal({
            title: 'You have following errors in your form', icon: "error",
            text: '\n ' + getErrors(),
            button: true
        });

}

function btnDeleteMC(gr) {
    grn = JSON.parse(JSON.stringify(gr));

    swal({
        title: "Are you sure to delete following grn...?",
        text: "\n GRN Code : " + grn.grncode,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/grn", "DELETE", grn);
            if (responce == 0) {
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
        } else {
            loadForm();
        }

    });

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

function btnPrintTableMC(grn) {
    //
    var newwindow = window.open();
    formattab = tblGRN.outerHTML;

    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 50px; '> <h1>GRN Details : </h1></div>" +
        "<div>"+ formattab+"</div>"+
        "</body>" +
        "</html>");
    setTimeout(function () {newwindow.print(); newwindow.close();},100) ;
}

function sortTable(cind) {
    cindex = cind;

    var cprop = tblGRN.firstChild.firstChild.children[cindex].getAttribute('property');

    if (cprop.indexOf('.') == -1) {
        grns.sort(
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
        grns.sort(
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
    fillTable('tblGRN', grns, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblGRN);
    loadForm();

    if (activerowno != "") selectRow(tblGRN, activerowno, active);


}