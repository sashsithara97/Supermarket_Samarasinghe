
        window.addEventListener("load", initialize);

        //Initializing Functions

        function initialize() {

            $('[data-toggle="tooltip"]').tooltip();

            txtSearchName.addEventListener("keyup",btnSearchMC);

            //privilage object for item module
            privilages = httpRequest("../privilage?module=ITEM","GET");

            batchstatuses = httpRequest("../batchstatus/list","GET");

            loadView();
            loadForm();

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
            iteminventories = new Array();

          var data = httpRequest("/batch/iteminventorylist?page="+page+"&size="+size+query,"GET");
            if(data.content!= undefined) iteminventories = data.content;

            for(let index in iteminventories ){
                if(iteminventories[index].item_id.rop < iteminventories[index].avaqty){
                    iteminventories[index].batchstatus_id = batchstatuses[0];

                }else if( iteminventories[index].avaqty == 0){
                    iteminventories[index].batchstatus_id = batchstatuses[1];

                }else if(iteminventories[index].avaqty <= iteminventories[index].item_id.rop){
                    iteminventories[index].batchstatus_id = batchstatuses[2];
                }

            }
            console.log(iteminventories)
            createPagination('pagination',data.totalPages, data.number+1,paginate);

            fillTable('tblInventory',iteminventories,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblInventory);

            if(activerowno!="")selectRow(tblInventory,activerowno,active);

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

        function viewitem(inv,rowno) {

            printinventory = JSON.parse(JSON.stringify(inv));
            
            tdIName.innerHTML = printinventory.item_id.itemname;
            tdIRop.innerHTML = printinventory.item_id.rop;
            tdIavaQty.innerHTML = printinventory.avaqty;
           tdItotal.innerHTML = printinventory.totalqty;
            tdIReturnQty.innerHTML = printinventory.returnqty;
            tdIStatus.innerHTML = printinventory.batchstatus_id.name;

            var format = printformtable.outerHTML;

            var newwindow=window.open();
            newwindow.document.write("<html>" +
                "<head><link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
                "<body><div style='margin-top: 50px'><h1>Inventory Details :</h1></div>" +
                "<div>"+format+"</div>" +
                "<script>printformtable.removeAttribute('style')</script>" +
                "</body></html>");
           setTimeout(function () {newwindow.print(); newwindow.close();},100);
         }

        function loadForm() {

            inventory = new Object();
            oldinventory = null;

            disableButtons(false, true, true);
        }

        function disableButtons(add, upd, del) {



            // select deleted data row
            for(let index in iteminventories ){

                tblInventory.children[1].children[index].lastChild.children[0].style.display = "none";
                tblInventory.children[1].children[index].lastChild.children[1].style.display = "none";

                if(iteminventories[index].batchstatus_id.name == "Not Availble" ){
                    tblInventory.children[1].children[index].style.color = "#f67b00";
                    tblInventory.children[1].children[index].style.border = "2px solid orange";
                    tblInventory.children[1].children[index].lastChild.children[1].disabled = true;
                    tblInventory.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

                }else if(iteminventories[index].batchstatus_id.name == "Available"){

                    tblInventory.children[1].children[index].style.color = "rgba(6,150,29,0.93)";
                    tblInventory.children[1].children[index].style.border = "2px solid green";
                    tblInventory.children[1].children[index].lastChild.children[1].disabled = true;
                    tblInventory.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

               }else if (iteminventories[index].batchstatus_id.name == "Low Inventory"){

                    tblInventory.children[1].children[index].style.color = "#f00";
                    tblInventory.children[1].children[index].style.border = "2px solid red";
                    tblInventory.children[1].children[index].lastChild.children[1].disabled = true;
                    tblInventory.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";


                }


            }

        }

        function fillForm(itm,rowno){


        }

        function btnDeleteMC(itm) {

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