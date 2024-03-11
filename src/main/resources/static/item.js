
        window.addEventListener("load", initialize);

        //Initializing Functions

        function initialize() {

            $('[data-toggle="tooltip"]').tooltip();

            btnAdd.addEventListener("click",btnAddMC);
            btnClear.addEventListener("click",btnClearMC);
            btnUpdate.addEventListener("click",btnUpdateMC);

            txtSearchName.addEventListener("keyup",btnSearchMC);
            cmbCategory.addEventListener("change",cmbCategoryCH);
            cmbUnittype.addEventListener("change",cmbUnittypeCH);
            cmbBrand.addEventListener("change",cmbUnittypeCH);
            cmbSubcategory.addEventListener("change",cmbUnittypeCH);

            //privilage object for item module
            privilages = httpRequest("../privilage?module=ITEM","GET");

            // get data arrays for fill combobox
            categories = httpRequest("../category/list","GET");
            subcategories = httpRequest("../subcategory/list","GET");
            units = httpRequest("../unit/list","GET");
            unittypes = httpRequest("../unittype/list","GET");
            brands = httpRequest("../brand/list","GET");
            employees = httpRequest("../employee/list","GET");
            itemstatuses = httpRequest("../itemstatus/list","GET");


            //Colors Define Karala Thiyenne methana
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
            items = new Array();
          var data = httpRequest("/item/findAll?page="+page+"&size="+size+query,"GET");
            if(data.content!= undefined) items = data.content;
            createPagination('pagination',data.totalPages, data.number+1,paginate);

            fillTable('tblItem',items,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblItem);

            if(activerowno!="")selectRow(tblItem,activerowno,active);

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

        function viewitem(itm,rowno) {

            printitem = JSON.parse(JSON.stringify(itm));

            tdICode.innerHTML = printitem.printitemcode;
            tdIName.innerHTML = printitem.printitemname;
            tdICategory.innerHTML = printitem.subcategory_id.category_id.name;
            tdIBrand.innerHTML = printitem.brand_id.name;
            tdIRop.innerHTML = printitem.rop;
            tdIRoq.innerHTML = printitem.roq;
            tdIAdate.innerHTML = printitem.addeddate;
            if(printitem.description != null)
              tdIDesc.innerHTML = printitem.description; else  tdIDesc.innerHTML = "";
           /* if(employee.photo==null)
                tdphoto.src= 'resourse/image/noimage.png';
             else
            tdphoto.src = atob(employee.photo);*/

            tdIStatus.innerHTML = printitem.itemstatus_id.name;

            fillInnerTable("tblCategory",categories,innerModify, innerDeleteMC,false);
            fillInnerTable("tblBrand",brands,innerBrandModify, innerBrandDeleteMC,false);
            fillInnerTable("tblSubcategory",subcategories,innerSubcategoryModify,innerSubcategoryDeleteMC,false);
            fillInnerTable("tblUnit",units,innerUnitModify,innerUnitDeleteMC,false);

            var format = printformtable.outerHTML;

            var newwindow=window.open();
            newwindow.document.write("<html>" +
                "<head><link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
                "<body><div style='margin-top: 50px'><h1>Item Details </h1></div>" +
                "<div>"+format+"</div>" +
                "<script>printformtable.removeAttribute('style')</script>" +
                "</body></html>");
           setTimeout(function () {newwindow.print(); newwindow.close();},100);
         }


         //Category Model Add - start
        function refrehInnerCategoryForm() {

            category = new Object();
            oldcategory = null;

            categories = httpRequest("../category/list","GET");
            // for refresh inner table
            fillInnerTable("tblCategory", categories,innerModify, innerDeleteMC,false);
        }

        function innerModify(innerob , ind){

        }

        function innerDeleteMC(innerob,ind){
            category = innerob;
            swal({
                title: "Are you sure to delete following Category...?",
                text: "\n Category Name : " + category.name ,
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete)=> {
                if (willDelete) {
                    categories.splice(ind,1);
                    swal({
                        title: "Removed Successfully....!",
                        text: "\n\n",
                        icon: "success", button: false, timer: 1200,
                    });
                    refrehInnerCategoryForm();

                }
            });

        }

        function getDuplicate() {
            var extbc = false;
            for (var index in categories){
                if(categories[index].name == txtCategory.value){
                    extbc = true;
                    break;
                }
            }

            return extbc;
        }

        function btnInnerCategoryAddMC() {
            if(getDuplicate()){
                swal({
                    title: "Already Exist....!",
                    text: "\n\n",
                    icon: "warning", button: false, timer: 1200,
                });
            }else {


                var responce = httpRequest("../category","POST",category);
                if(responce == "0"){
                    swal({
                        title: "Added Successfully....!",
                        text: "\n\n",
                        icon: "success", button: false, timer: 1200,
                    });
                    refrehInnerCategoryForm();
                    fillCombo(cmbCategory,"Select Category",categories,"name","");
                }else {
                    swal({
                        title: "Faild To Add....!",
                        text: "\n\n"  + responce,
                        icon: "error", button: false, timer: 1200,
                    });
                }


            }

        }

        //Category Model Add - end

        //Brand Model Add - start
        function refrehInnerBrandForm() {

            brand = new Object();
            oldbrand = null;

            txtBrand.value = "";
            txtBrand.style.border = initial;
            fillCombo(cmbModelCategory,"Select Category",categories,"name","");
            // for refresh inner table
            fillInnerTable("tblBrand",brands,innerBrandModify, innerBrandDeleteMC,false);
        }

        function innerBrandModify(innerob , ind){

        }

        function innerBrandDeleteMC(innerob,ind){
            brand = innerob;
            swal({
                title: "Are you sure to delete following Brand...?",
                text: "\n Brand Name : " + brand.name ,
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete)=> {
                if (willDelete) {
                    categories.splice(ind,1);
                    swal({
                        title: "Removed Successfully....!",
                        text: "\n\n",
                        icon: "success", button: false, timer: 1200,
                    });
                    refrehInnerBrandForm();

                }
            });

        }

        function getBrandDuplicate() {
            var extbc = false;
            for (var index in brands){
                if(brands[index].name == txtBrand.value){
                    extbc = true;
                    break;
                }
            }

            return extbc;
        }

        function btnInnerBrandAddMC() {
            if(getBrandDuplicate()){
                swal({
                    title: "Already Exist....!",
                    text: "\n\n",
                    icon: "warning", button: false, timer: 1200,
                });
            }else {
                swal({
                    title: "Added Successfully....!",
                    text: "\n\n",
                    icon: "success", button: false, timer: 1200,
                });
                brands.push(brand);
                refrehInnerBrandForm();

            }

        }

        //Brand Model Add - end

        //Subcategory Model Add - start
        function refrehInnerSubcategoryForm() {

             subcategory = new Object();
            oldsubcategory = null;

            txtSubcategory.value = "";
            txtSubcategory.style.border = initial;
            fillCombo(cmbSubcategoryModelCategory,"Select Category",categories,"name","");
            // for refresh inner table
            fillInnerTable("tblSubcategory",subcategories,innerSubcategoryModify, innerSubcategoryDeleteMC,false);
        }

        function innerSubcategoryModify(innerob , ind){

        }

        function innerSubcategoryDeleteMC(innerob,ind){
            subcategory = innerob;
            swal({
                title: "Are you sure to delete following Subcategory...?",
                text: "\n Sub Category  : " + subcategory.name ,
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete)=> {
                if (willDelete) {
                    subcategories.splice(ind,1);
                    swal({
                        title: "Removed Successfully....!",
                        text: "\n\n",
                        icon: "success", button: false, timer: 1200,
                    });
                    refrehInnerSubcategoryForm();

                }
            });

        }

        function getSubcategoryDuplicate() {
            var extbc = false;
            for (var index in subcategories){
                if(subcategories[index].name == txtSubcategory.value){
                    extbc = true;
                    break;
                }
            }

            return extbc;
        }

        function btnSubcategoryInnerAddMC() {
            if(getSubcategoryDuplicate()){
                swal({
                    title: "Already Exist....!",
                    text: "\n\n",
                    icon: "warning", button: false, timer: 1200,
                });
            }else {
                swal({
                    title: "Added Successfully....!",
                    text: "\n\n",
                    icon: "success", button: false, timer: 1200,
                });
                subcategories.push(subcategory);
                refrehInnerSubcategoryForm();

            }

        }

        //Subcategory Model Add - end

        //Unittype Model Add - start
        function refrehInnerUnitForm() {

            unit = new Object();
            oldunit = null;

            txtUnit.value = "";
            txtUnit.style.border = initial;
            fillCombo(cmbModelUnitType,"Select Unit",unittypes,"name","");
            // for refresh inner table
            fillInnerTable("tblUnit",units,innerUnitModify, innerUnitDeleteMC,false);
        }

        function innerUnitModify(innerob , ind){

        }

        function innerUnitDeleteMC(innerob,ind){
            unit = innerob;
            swal({
                title: "Are you sure to delete following Unit...?",
                text: "\n Unit  : " + unit.name ,
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete)=> {
                if (willDelete) {
                    units.splice(ind,1);
                    swal({
                        title: "Removed Successfully....!",
                        text: "\n\n",
                        icon: "success", button: false, timer: 1200,
                    });
                    refrehInnerUnitForm();

                }
            });

        }

        function getUnitDuplicate() {
            var extbc = false;
            for (var index in units){
                if(units[index].name == txtUnit.value){
                    extbc = true;
                    break;
                }
            }

            return extbc;
        }

        function btnUnitInnerAddMC() {
            if(getUnitDuplicate()){
                swal({
                    title: "Already Exist....!",
                    text: "\n\n",
                    icon: "warning", button: false, timer: 1200,
                });
            }else {
                swal({
                    title: "Added Successfully....!",
                    text: "\n\n",
                    icon: "success", button: false, timer: 1200,
                });
                units.push(unit);
                refrehInnerUnitForm();

            }

        }

        //Unittype Model Add - end


        function loadForm() {

            item = new Object();
            olditem = null;

                // fill data into combo box
             fillCombo(cmbCategory,"Select Category",categories,"name","");
             fillCombo(cmbSubcategory,"Select Sub-Category",subcategories,"name","");
             fillCombo(cmbBrand,"Select Brand",[],"","");
             fillCombo3(cmbUnittype,"Select Unit Type",units,"name","unittype_id.name","");

             //Auto fill combo box and auto bind data into object
             fillCombo(cmbEmployee,"",employees,"callingname",session.getObject('activeuser').employeeId.callingname);
            cmbEmployee.disabled = true;

            item.employee_id = JSON.parse(cmbEmployee.value);
             fillCombo(cmbItemstatus,"",itemstatuses,"name","Available");
            cmbItemstatus.disabled = true;
            item.itemstatus_id = JSON.parse(cmbItemstatus.value);


            dteAddeddate.value  = getCurrentDateTime("date");
             item.addeddate = dteAddeddate.value;
            dteAddeddate.disabled = true;

            // not default value
            txtItemCode.value = "";
            txtItemName.value = "";
            txtROP.value = "";
            txtROQ.value = "";
            txtDescription.value = "";
            cmbBrand.disabled = true;
            cmbSubcategory.disabled = true;

             removeFile('flePhoto');

             setStyle(initial);

            cmbItemstatus.style.border = valid;
            cmbEmployee.style.border = valid;
            dteAddeddate.style.border = valid;

             disableButtons(false, true, true);
            refrehInnerCategoryForm();
            refrehInnerBrandForm();
            refrehInnerSubcategoryForm();
            refrehInnerUnitForm();
        }

        function cmbCategoryCH() {

            cmbBrand.disabled = false;
            txtItemName.value = "";

            fillCombo3(cmbUnittype,"Select Unit Type",units,"name","unittype_id.name","");

            brandlistbycategory = httpRequest("../brand/listbycategory?categoryid="+JSON.parse(cmbCategory.value).id,"GET");
            fillCombo(cmbBrand,"Select Brand",brandlistbycategory,"name","");

            /*Filter Subcategory according to category*/
            cmbSubcategory.disabled = false;
           subcategorylistbycategory = httpRequest("../subcategory/listbysubcategory?categoryid="+JSON.parse(cmbCategory.value).id,"GET");
            fillCombo(cmbSubcategory,"Select Subcategory",subcategorylistbycategory,"name","");

            if(olditem != null && olditem.subcategory_id.category_id.name != JSON.parse(cmbCategory.value).name)
            {
                cmbCategory.style.border = updated;
            }else {

                cmbCategory.style.border = valid;
            }

            cmbBrand.style.border = initial;
            cmbSubcategory.style.border = initial;
            cmbUnittype.style.border = initial;
            txtItemName.style.border = initial;

            item.itemname = null;
            item.subcategory_id = null;
            item.brand_id = null;
            item.unity_id = null;

        }

        function cmbUnittypeCH() {

            var name="";

            if(item.brand_id != null && item.subcategory_id != null && item.unity_id != null ){
           name = item.brand_id.name + "-" + item.subcategory_id.name + "-" + item.unity_id.name +  item.unity_id.unittype_id.name ;
         // alert(name);
           }

            txtItemName.value = name;
            txtItemName.style.border = valid;
            item.itemname = txtItemName.value;

            if(olditem != null && olditem.itemname !=  item.itemname)
            {
                txtItemName.style.border = updated;
            }else {

                txtItemName.style.border = valid;
            }


        }


        function setStyle(style) {

            txtDescription.style.border = style;
            txtItemCode.style.border = style;
            cmbCategory.style.border = style;
            cmbBrand.style.border = style;

            cmbSubcategory.style.border = style;
            cmbUnittype.style.border = style;
            txtItemName.style.border = style;

            txtROP.style.border = style;
            txtROQ.style.border = style;

            cmbEmployee.style.border = style;
            cmbItemstatus.style.border = style;
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
            for(index in items){
                if(items[index].itemstatus_id.name =="Deleted"){
                    tblItem.children[1].children[index].style.color = "#f00";
                    tblItem.children[1].children[index].style.border = "2px solid red";
                    tblItem.children[1].children[index].lastChild.children[1].disabled = true;
                    tblItem.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

                }
            }

        }

        function getErrors() {

            var errors = "";
            addvalue = "";

            if (cmbCategory.value == "")
                errors = errors + "\n" + "Item Category Not Selected";
            else  addvalue = 1;

            if (item.itemname == null)
                errors = errors + "\n" + "Item Name Not Enter";
            else  addvalue = 1;

            if (item.itemcode == null)
                errors = errors + "\n" + "Item Code Not Enter";
            else  addvalue = 1;

            if (item.brand_id == null)
                errors = errors + "\n" + "Brand Not Selected";
            else  addvalue = 1;

            if (item.subcategory_id == null)
                errors = errors + "\n" + "Subcategory Not Selected";
            else  addvalue = 1;

            if (item.unity_id == null)
                errors = errors + "\n" + "Unit Type Not Selected";
            else  addvalue = 1;

            if (item.rop == null)
                errors = errors + "\n" + "ROP Not Enter";
            else  addvalue = 1;

            if (item.roq == null)
                errors = errors + "\n" + "ROQ Not Enter";
            else  addvalue = 1;

            if (item.itemstatus_id == null)
                errors = errors + "\n" + "Item Status Not Selected";
            else  addvalue = 1;

            return errors;

        }

        function btnAddMC(){
            if(getErrors()==""){
                if(item.photo == null || txtDescription.value == ""){
                    swal({
                        title: "Are you sure to continue...?",
                        text: "Form has some optional empty fields.....",
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
                title: "Are you sure to add following Item...?" ,
                  text :  "\nItem Code : " + item.itemcode +
                    "\nItem Name : " + item.itemname +
                    "\nROP : " + item.rop +
                    "\nROQ : " + item.roq +
                    "\nAdded Date : " + item.addeddate +
                    "\nItem Status : " + item.itemstatus_id.name,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    var response = httpRequest("/item", "POST", item);
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

            if(olditem == null && addvalue == ""){
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

        function fillForm(itm,rowno){
            activerowno = rowno;

            if (olditem==null) {
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

        function filldata(itm) {

            clearSelection(tblItem);
            selectRow(tblItem,activerowno,active);

            item = JSON.parse(JSON.stringify(itm));
            olditem = JSON.parse(JSON.stringify(itm));

            txtItemCode.value = item.itemcode;
            txtItemName.value = item.itemname;
            txtROP.value = item.rop;
            txtROQ.value = item.roq;
            txtDescription.value = item.description;
            dteAddeddate.value  = item.addeddate;

            fillCombo(cmbCategory,"Select Category",categories,"name",item.subcategory_id.category_id.name);

            brandlistbycategory = httpRequest("../brand/listbycategory?categoryid="+JSON.parse(cmbCategory.value).id,"GET");
            fillCombo(cmbBrand,"Select Brand",brandlistbycategory,"name",item.brand_id.name);

            subcategorylistbycategory = httpRequest("../subcategory/listbysubcategory?categoryid="+JSON.parse(cmbCategory.value).id,"GET");
            fillCombo(cmbSubcategory,"Select Subcategory",subcategorylistbycategory,"name",item.subcategory_id.name);
            fillCombo3(cmbUnittype,"Select Unit Type",units,"name","unittype_id.name",item.unity_id.name);

            fillCombo(cmbEmployee,"",employees,"callingname",item.employee_id.callingname);
            cmbEmployee.disabled = true;
            fillCombo(cmbItemstatus,"",itemstatuses,"name",item.itemstatus_id.name);
            cmbItemstatus.disabled = false;


            setDefaultFile('flePhoto', item.photo);

            disableButtons(true, false, false);
            setStyle(valid);
            changeTab('form');

            if(item.description == null){
                txtDescription.style.border = initial;
            }

        }

        function getUpdates() {

            var updates = "";

            if(item != null && olditem != null) {

                if (JSON.parse(cmbCategory.value).name != olditem.subcategory_id.category_id.name)
                    updates = updates + "\nCategory is Changed";

                if (item.itemname != olditem.itemname)
                    updates = updates + "\nItem Name is Changed";

                if (item.itemcode != olditem.itemcode)
                    updates = updates + "\nItem Code is Changed";

                if (item.subcategory_id.name != olditem.subcategory_id.name)
                    updates = updates + "\nSubcategory is Changed";

                if (item.brand_id.name != olditem.brand_id.name)
                    updates = updates + "\nBrand is Changed";

                if (item.unity_id.name != olditem.unity_id.name)
                    updates = updates + "\nUnit Type is Changed";

                if (item.photo != olditem.photo)
                    updates = updates + "\nPhoto is Changed";

                if (item.roq != olditem.roq)
                    updates = updates + "\nROQ is Changed";


                if (item.rop != olditem.rop)
                    updates = updates + "\nROP is Changed";

                if (item.addeddate != olditem.addeddate)
                    updates = updates + "\nAdded Date is Changed";

                if (item.description != olditem.description)
                    updates = updates + "\nDescription is Changed";

                if (item.itemstatus_id.name != olditem.itemstatus_id.name)
                    updates = updates + "\nItemstatus is Changed";
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
                        title: "Are you sure to update following Item details...?",
                        text: "\n"+ getUpdates(),
                        icon: "warning", buttons: true, dangerMode: true,
                    })
                        .then((willDelete) => {
                        if (willDelete) {
                            var response = httpRequest("/item", "PUT", item);
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

        function btnDeleteMC(itm) {
            item = JSON.parse(JSON.stringify(itm));

            swal({
                title: "Are you sure to delete following Item...?",
                text: "\n Item Code : " + item.itemcode +
                "\n Item Name : " + item.itemname,
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete)=> {
                if (willDelete) {
                    var responce = httpRequest("/item","DELETE",item);
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
                else {

                    loadForm();
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

       function btnPrintTableMC(item) {
            //
            var newwindow = window.open();
            formattab = tblItem.outerHTML;

           newwindow.document.write("" +
                "<html>" +
                "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
                "<link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
                "<body><div style='margin-top: 50px; '> <h1>Items Details : </h1></div>" +
                "<div>"+ formattab+"</div>"+
               "</body>" +
                "</html>");
           setTimeout(function () {newwindow.print(); newwindow.close();},100) ;
        }

        function sortTable(cind) {
            cindex = cind;

         var cprop = tblItem.firstChild.firstChild.children[cindex].getAttribute('property');

           if(cprop.indexOf('.') == -1) {
               items.sort(
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
               items.sort(
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
            fillTable('tblItem',items,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblItem);
            loadForm();

            if(activerowno!="")selectRow(tblItem,activerowno,active);



        }