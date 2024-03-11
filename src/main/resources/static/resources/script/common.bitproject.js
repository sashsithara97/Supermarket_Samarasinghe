
function getCurrentDateTime(format) {


    var today = new Date();
    var month = today.getMonth()+1; // array [0-11]
    if(month<10) month = "0"+month;
    var date = today.getDate(); // range 1-31
    if(date<10) date = "0"+date;

    var hours = today.getHours(); // range 1-31
    if(hours<10) hours = "0"+hours;

    var minuts = today.getMinutes(); // range 1-31
    if(minuts<10) minuts = "0"+minuts;

    let currentdate = today.getFullYear()+"-"+month+"-"+date;
    let currentdatetime = today.getFullYear()+"-"+month+"-"+date+"T"+hours+":"+minuts;

    if(format == "date"){
        return currentdate;
    }

    if(format == "datetime"){
        return currentdatetime;
    }
}


function getRandomColorHex(size) {

    var colorlist = new Array();
    for(var j=0; j<size ; j++) {

        var hex = "0123456789ABCDEF",
            color = "#";

        for (var i = 1; i <= 6; i++) {
            color += hex[Math.floor(Math.random() * 16)];
        }

        colorlist.push(color);

    }

    return colorlist ;

}


function comboBox2Binder(field,pattern,obj,prop,oldobj){
    field.setAttribute('data-object',obj);
    field.setAttribute('data-oldobject',oldobj);
    var ob = window[field.getAttribute('data-object')];
    var oldob = window[field.getAttribute('data-oldobject')];

    ob[prop] = JSON.parse(field.value);

    if (oldob != null && oldob[prop].id != ob[prop].id){
        $('.select2-container').css('border', updated);
        //  field.parentNode.children[2].style.border = updated;
    }else {
        $('.select2-container').css('border', valid);
        // field.parentNode.children[2].style.border = valid;
    }
}

function comboBoxSelect2Binder(field,pattern,obj,prop,oldobj,selectparent){
    field.setAttribute('data-object',obj);
    field.setAttribute('data-oldobject',oldobj);
    var ob = window[field.getAttribute('data-object')];
    var oldob = window[field.getAttribute('data-oldobject')];

    ob[prop] = JSON.parse(field.value);

    if (oldob != null && oldob[prop].id != ob[prop].id){
        $("#"+selectparent).css('border',updated);

    }else {
        $("#"+selectparent).css('border',valid);

    }
}

function listCompera(list1,list2,atb1,atb2) {
    var props = ['id', 'name'];

    list1 = list1.filter(function(o1){
        // filter out (!) items in result2
        return !list2.some(function(o2){
            return o1.id === o2.id;          // assumes unique id
        });
    }).map(function(o){
        // use reduce to make objects with only the required properties
        // and map to apply this to the filtered array as a whole
        return props.reduce(function(newo, name){
            newo[name] = o[name];
            return newo;
        }, {});
    });

    return list1;
}

function toDecimal(value , point = 2) {
    return parseFloat(value).toFixed(2);
}


function getDatafromObjectList(ob,property){
    var get = function (model, path) {
        var parts = path.split('.');
        if (parts.length > 1 && typeof model[parts[0]] === 'object') {
            return get(model[parts[0]], parts.splice(1).join('.'));
        } else {
            return model[parts[0]];
        }
    }
    var data = get(ob,property);
    return data;
}

function changeTab(viewname) {
    if(viewname=='form'){
        tbForm.classList.add('active');
        tbTable.classList.remove('active');
        divFrom.style.display = "flex";
        divTable.style.display = "none";
    }
    if(viewname=='table'){
        tbForm.classList.remove('active');
        tbTable.classList.add('active');
        divFrom.style.display = "none";
        divTable.style.display = "contents";

    }

}

function getUpdatemsg(obj,list,oldobj) {

    var ob = window[obj];
    var oldob = window[oldobj];
    let updates ="";
    if(ob != null  && oldob != null){
        if(list.length != 0){
            for(index in list){
                if(list[index].property.indexOf(".") != -1){
                    if(getDatafromObjectList(ob, list[index].property) != getDatafromObjectList(oldob, list[index].property)){
                        updates = updates + list[index].msg + "\n";
                    }
                }else {
                    if(window[obj][list[index].property] != window[oldobj][list[index].property]){
                        updates = updates + list[index].msg + "\n";
                    }
                }
            }
            return updates;
        }
    }

    return updates;
}

function getErrormsg(obj,list,colorreq) {

    let errors ="";
    if(list.length != 0){
        for(index in list){
            if(window[obj][list[index].property] == null){
                errors = errors + list[index].msg + "\n";
                if (colorreq)
                    list[index].feildid.style.border = invalid;
            }
        }
        return errors;
    }
    return errors;
}

function doDecimal(value, dpoint=2) {
    return parseFloat(value).toFixed(dpoint);
}

function hiddenbody(icnid, divid) {
    if(divid.style.visibility == 'hidden'){
        icnid.classList.remove("fa-angle-double-right");
        icnid.classList.add("fa-angle-double-down");
        divid.style.visibility = 'visible';

        //hint.style.opacity = '1';
        divid.style.height = 'auto';
        divid.style.width = 'auto';
        divid.style.padding = '1em';
    } else {
        icnid.classList.remove("fa-angle-double-down");
        icnid.classList.add("fa-angle-double-right");
        divid.style.visibility = 'hidden';

        //hint.style.opacity = '0';
        divid.style.height = '0';
        divid.style.width = '0';
        divid.style.padding = '0';
    }
}

function isEqualtolist(list1,list2,attribute) {

    var equality = false;

    if (list1.length != list2.length)
        equality  = true;
    else {

        for (index in list2) {
            list1 = list1.filter(function (el) {
                return el[attribute] != list2[index][attribute];
            });
        }
        if (list1 != 0)
            equality  = true;
    }

    return equality ;

}

function isEqual(list1,list2,attribute) {

    var equality = false;

    if (list1.length != list2.length)
        equality  = true;
    else {

        for (index in list2) {
            list1 = list1.filter(function (el) {
                return el[attribute].id != list2[index][attribute].id;
            });
        }
        if (list1 != 0)
            equality  = true;
    }

    return equality ;

}

//Error Logging Function
function logError(location, target,  data) {
    h1 = document.createElement("h3");
    tx1 = document.createTextNode(location);
    h2 = document.createElement("h3");
    tx2 = document.createTextNode(target);
    h3 = document.createElement("h4");
    tx3 = document.createTextNode(data);
    h1.appendChild(tx1);
    h2.appendChild(tx2);
    h3.appendChild(tx3);
    err.appendChild(h1);
    err.appendChild(h2);
    err.appendChild(h3);

}

//AJAX Calls
function httpRequest(url,method,data){

    var ajax = new XMLHttpRequest();
    ajax.open(method, url, false);
    ajax.setRequestHeader("Content-type", "application/json");
    startWaiting("Plases Wait");
    ajax.send(JSON.stringify(data));
    stopWaiting();


    logError("AJAX Responce", url, ajax.responseText+"---"+ajax.status);

    if (ajax.status == 200) {
        if(method=="GET"&&ajax.responseText!="")
        return JSON.parse(ajax.responseText);
        else return ajax.responseText;
    }
    else if (ajax.status == 400 || ajax.status == 500 )
    {
       if(JSON.parse(ajax.responseText).errors!=undefined)
        return JSON.parse(ajax.responseText).errors[0].defaultMessage;
        else
        return JSON.parse(ajax.responseText).message;

}
}

//Loding Screen Lock
function startWaiting(msg='Loading'){
     var lockScreen = document.createElement('div');
    lockScreen.id='lockScreen';
    lockScreen.style.zIndex='20000';
    lockScreen.style.position='fixed';
    lockScreen.style.top='0px';
    lockScreen.style.bottom='0px';
    lockScreen.style.left='0px';
    lockScreen.style.right='0px';
    lockScreen.style.textAlign='center';
    lockScreen.style.background='rgba(0,0,0,0.7)';
    lockScreen.style.paddingTop='20%';
    var image = document.createElement('img');
    image.src='resources/image/loading.gif';
    image.style.width='50px';
    image.style.height='50px';
    lockScreen.appendChild(image);
    var p = document.createElement('div');
    p.id='waitingMsg';
    p.innerHTML = msg;
    p.style.color='white';
    p.style.fontSize='16px';
    p.style.marginTop='10px';
    lockScreen.appendChild(p);
    document.body.appendChild(lockScreen);
}

function setWaitingMsg(msg){
    document.getElementById('waitingMsg').innerHTML=msg;
}

function stopWaiting(){
    document.body.removeChild(document.getElementById('lockScreen'));
}

//SessionStorage Functions - Saving Data to be used by Client Scripts
var session = new Object();

session.setValue = function(name, value) {
    sessionStorage.setItem(name, value);
}

session.getValue = function(name) {
    return sessionStorage.getItem(name);
}

session.setObject = function(name, value) {
    sessionStorage.setItem(name, JSON.stringify(value));
}

session.getObject = function(name) {
    return JSON.parse( sessionStorage.getItem(name));
}

session.remove = function(name) {

}


//function for gererate gender and birthday
function generate(gennic,nicfield,gendercombo,dobfield) {
    var lblMsg = "";
    var gender = "";
    if(gennic.length == 10){
        gennic="19"+nicfield.value.substring(0,5)+"0"+nicfield.value.substring(5,9);
    }
    var year = gennic.substring(0,4);
    var noOfDays = gennic.substring(4,7);


    var d = new Date(year);

    if (noOfDays>=1 && noOfDays<=366){
        gender =  "Male";
    }else if(noOfDays>=501 && noOfDays<=866){
        noOfDays = noOfDays-500;
        gender =  "Female";
    }

    if(year%4!=0){
        if(noOfDays<=59){
            d.setDate(parseInt(noOfDays));
            dobfield.value = year+"-"+getmonthdate(d);
        }else if (noOfDays==60){
            dobfield.value = year+"-"+02+"-"+29;
        }else{
            d.setDate(parseInt(noOfDays)-1);
            dobfield.value = year+"-"+getmonthdate(d);
        }
    }else{
        d.setDate(parseInt(noOfDays));
        dobfield.value = year+"-"+getmonthdate(d);
    }
    return gender;

}


//function for get month and date into "MM-DD" format
function getmonthdate(monthdate) {
    var month = monthdate.getMonth()+1;
    var date = monthdate.getDate();
    if(month<10) month = "0"+month;
    if(date<10) date = "0"+date;

    return month+"-"+date;
}

//UI-Commons

function createElement(name,id=null){
    var ele = document.createElement(name);
    if(id!=null){
        ele.id = id;
    }
    return ele;
}


//Table Functions
function table(parentid,id,metadata, hasBtn=true){
    var parent = document.getElementById(parentid);
    var table = createElement('table',id);
    table.border = 2;
    table.classList.add('table');
    table.classList.add('table-bordered');
    table.classList.add('table-hover');
    var thead = createElement('thead');
    thead.classList.add('thead-dark');
    var tbody = createElement('tbody');
    var row1 = createElement('tr');
    var th = createElement('th');
    th.innerHTML="Index";
    th.style.width='75px';
    row1.appendChild(th);

    var row2 = createElement('tr');
    var th = createElement('th');
    row2.appendChild(th);
    for(var i=1; i<=metadata.length; i++){
        var th = createElement('th');
        th.setAttribute('datatype',metadata[i-1]['datatype']);
        if(typeof metadata[i-1]['property']=='function'){
            th.setAttribute('property',metadata[i-1]['property'].name);
            th.setAttribute('propertytype','function');
            th.setAttribute('cindex',i);
            th.onclick = function () {
                sortTable(this.getAttribute('cindex'));
            }

        }else{
            th.setAttribute('property',metadata[i-1]['property']);
            th.setAttribute('propertytype','attribute');
            th.setAttribute('cindex',i);
            th.onclick = function () {
                sortTable(this.getAttribute('cindex'));
            }
        }

        th.innerHTML = metadata[i-1]['name'] + "   " + '<i class="fa fa-sort isort" aria-hidden="true"></i>';
        row1.appendChild(th);
        var th = createElement('th');
        if(metadata[i-1]['search']){
            var input = createElement('input');
            input.setAttribute('type','text');
            input.setAttribute('placeholder','Search By '+metadata[i-1]['name']);
            input.setAttribute('onkeyup','filterTable(this)');
            input.setAttribute('index',i);
            input.classList.add('form-control');
            input.classList.add('input-sm');
            th.appendChild(input);
        }
        row2.appendChild(th);
    }

    if(hasBtn){
        var th = createElement('th');
        th.classList.add('modifybutton');
        th.style.width='180px'
        th.innerHTML="Modify";
        row1.appendChild(th);
        var th = createElement('th');
        row2.appendChild(th);
        table.setAttribute('hasButton','1');
    }else{
        table.setAttribute('hasButton','0');
    }
    thead.appendChild(row1);
    thead.appendChild(row2);
    table.appendChild(thead);
    table.appendChild(tbody);
    parent.appendChild(table);

}



function filterTable(field) {
    var searchRow =field.parentNode.parentNode;
    var searchRowTh =searchRow.children;
    var dataRows = searchRow.parentNode.parentNode.children[1].children;

    var searchFields = [];

    for (var i=1; i<searchRowTh.length; i++){
        var searchCell = searchRowTh[i];
        if(searchCell.children.length==1){
            searchFields.push(searchCell.children[0]);
        }
    }

    for(var i=0; i<dataRows.length; i++){
        var row = dataRows[i];
        var valid=true;
        for(var j=0; j<searchFields.length; j++){
            var searchField = searchFields[j];
            var searchText = searchField.value.trim().toLowerCase();
            var index = searchField.getAttribute('index');
            var cell = row.children[index];
            var text = cell.innerHTML.toLowerCase();
            if(text.indexOf(searchText)==-1){
                valid = false;
                break;
            }
        }
        if(valid){
            row.style.display='table-row';
        }else{
            row.style.display='none';
        }
    }

}

function fillTable(tableid,obs,modifyFunction=null,deletefunction=null,printfunction=null){
    var table = document.getElementById(tableid);
    var hasButton = table.getAttribute('hasButton')=='1';
    var thead = table.children[0];
    var tbody = table.children[1];
    tbody.innerHTML='';
    var headingCells = thead.children[0].children;
    var searchCells = thead.children[1].children;
    for(var i=1; i<searchCells.length; i++){
        var searchCell = searchCells[i];
        if(searchCell.children.length!=0){
            searchCell.children[0].value='';
        }
    }
    for(var i=0; i<obs.length; i++){
        var ob = obs[i];
        var row = createElement("tr");
        var td = createElement("td");
        td.innerHTML=(i+1);
        row.appendChild(td);
        if(hasButton){
            var e = headingCells.length-1;
        }else{
            var e = headingCells.length;
        }

        for(j=1; j<e; j++){
            var td = createElement("td");
            var headingCell = headingCells[j];
            var type = headingCell.getAttribute('datatype');
            var property = headingCell.getAttribute('property');
            var propertytype = headingCell.getAttribute('propertytype');

            if(propertytype=='attribute'){
                var get = function (model, path) {
                    var parts = path.split('.');
                    if (parts.length > 1 && typeof model[parts[0]] === 'object') {
                        return get(model[parts[0]], parts.splice(1).join('.'));
                    } else {
                        return model[parts[0]];
                    }
                }
                var data = get(ob,property);
            }else{
                var data = window[property](ob);
            }

            if(type=='text'){
                if(data==null){
                    data = '-';
                }
                td.innerHTML = data;
            }else if(type=='amount'){
                td.innerHTML = toDecimal(data);
            }else if(type=='photo'){
                var img = createElement("img");
                img.style.width='50px';
                img.style.height='50px';
                if(data==null){
                    img.src = "../resourse/image/noimage.png";
                }else{
                    img.src=atob(data);
                }
                td.appendChild(img);
            }
            row.appendChild(td);
        }



        if(hasButton){
            var td = createElement("td");
            td.classList.add('modifybutton');
            var buttonup = createElement('button');
            var buttondel = createElement('button');
            var buttonvie = createElement('button');
            buttonup.setAttribute('type','button');
            buttonup.classList.add('btn');
            buttonup.classList.add('btn-warning');
            buttonup.classList.add('buttonup');
            buttonup.innerHTML = '<i class="fa fa-cogs"> </i>';
            buttonup.onclick=function(){
                idx = window.parseInt(this.parentNode.parentNode.firstChild.innerHTML);
                modifyFunction( obs[idx - 1],idx);
            };

            buttondel.setAttribute('type','button');
            buttondel.classList.add('btn');
            buttondel.classList.add('btn-danger');
            buttondel.classList.add('buttondel');
            buttondel.classList.add('ml-2');
            buttondel.classList.add('mr-2');
            buttondel.innerHTML = '<i class="fa fa-trash"></i>';
            buttondel.onclick=function(){
                idx = window.parseInt(this.parentNode.parentNode.firstChild.innerHTML);
                deletefunction(obs[idx - 1]);
            };

            buttonvie.setAttribute('type','button');
            buttonvie.classList.add('btn');
            buttonvie.classList.add('btn-primary');
            buttonvie.classList.add('buttonvie');
            buttonvie.innerHTML = '<i class="fa fa-print"></i>';
            buttonvie.onclick=function(){
                idx = window.parseInt(this.parentNode.parentNode.firstChild.innerHTML);
                printfunction(obs[idx - 1]);
            };

            td.appendChild(buttonup);
            td.appendChild(buttondel);
            td.appendChild(buttonvie);
            row.appendChild(td);
        }
        tbody.appendChild(row);
    }
}

function clearSelection(tableid){
    // var table = document.getElementById(tableid);
    var rows = tableid.children[1].children;
    for(var i=0; i<rows.length; i++){
        rows[i].style.background='';
    }
}

function selectRow(tableid,rowno,active){
    var rows = tableid.children[1].children;
    rows[rowno-1].style.background=active;
}

function createPagination(paginationid,pagecount,activepage, paginatefunction){
    var pagination = document.getElementById(paginationid);
    pagination.innerHTML="";

    var lipre = document.createElement('li');
    lipre.classList.add('page-item');
    lipre.classList.add('previous');
    var apre = document.createElement('a');
    apre.classList.add('page-link');
    apre.innerHTML = "Previous";
    apre.onclick = function(){
        paginatefunction(parseInt(activepage)-1);
    }


    lipre.appendChild(apre);
    pagination.appendChild(lipre);

    for(i=1;i<=pagecount;i++) {
        var li = document.createElement('li');
        li.classList.add('page-item');
        var a = document.createElement('a');
        a.classList.add('page-link');
        a.innerHTML = i;
        if(i!=activepage) {
            a.href = "#";
            a.addEventListener("click", function () {
                paginatefunction(this.innerHTML);

            });
        }else {
            a.style.background="#1E90FF";
            a.style.color="#FFFFFF";
        }
        li.appendChild(a);
        pagination.appendChild(li);
    }




    var linext = document.createElement('li');
    linext.classList.add('page-item');
    linext.classList.add('next');
    var anext = document.createElement('a');
    anext.classList.add('page-link');
    anext.innerHTML = "Next";
    anext.onclick = function(){
        paginatefunction(parseInt(activepage)+1);
    }

    linext.appendChild(anext);
    pagination.appendChild(linext);

    if(pagecount == 1 && activepage == 1){
        anext.disabled = true;
        anext.style.cursor ="not-allowed";
        apre.disabled = true;
        apre.style.cursor ="not-allowed";
    }else if(activepage == 1){
        apre.disabled = true;
        apre.style.cursor ="not-allowed";
        anext.disabled = false;
        anext.style.cursor = "pointer";
    }else if(pagecount == activepage){
        apre.disabled = false;
        apre.style.cursor = "pointer";
        anext.disabled = true;
        anext.style.cursor ="not-allowed";
    }

}


function fillCombo(combo, message, list, attribute, selectedvalue) {
    combo.innerHTML = "";
    if (message != "") {
        var prompt = document.createElement("option");
        prompt.value = "";
        prompt.selected = "selected";
        prompt.disabled = "disabled";
        var prompttext = document.createTextNode(message);
        prompt.appendChild(prompttext);
        combo.appendChild(prompt);
    }

    for (index in list) {
        var option = document.createElement("option");
        option.value = JSON.stringify(list[index]);
        var text = document.createTextNode(list[index][attribute]);

        if (list[index][attribute] == selectedvalue) {
            option.selected = "selected";
            combo.style.border = "2px solid green";
        }
        option.appendChild(text);
        combo.appendChild(option);
    }


}

function fillCombo2(combo, message, list, attribute, selectedvalue) {
    combo.innerHTML = "";
    if (message != "") {
        var prompt = document.createElement("option");
        prompt.value = "";
        prompt.selected = "selected";
        prompt.disabled = "disabled";
        var prompttext = document.createTextNode(message);
        prompt.appendChild(prompttext);
        combo.appendChild(prompt);
    }

    for (index in list) {
        var option = document.createElement("option");
        option.value = JSON.stringify(list[index]);
        var text = document.createTextNode(list[index][attribute]);
        for (ind in selectedvalue){
            if (list[index][attribute] == selectedvalue[ind][attribute]) {
                option.selected = "selected";
                combo.style.border = "2px solid green";
            }
        }
        option.appendChild(text);
        combo.appendChild(option);
    }
}

function fillCombo3(combo, message, list, attribute,attribute2, selectedvalue) {
    combo.innerHTML = "";
    if (message != "") {
        var prompt = document.createElement("option");
        prompt.value = "";
        prompt.selected = "selected";
        prompt.disabled = "disabled";
        var prompttext = document.createTextNode(message);
        prompt.appendChild(prompttext);
        combo.appendChild(prompt);
    }

    for (index in list) {
        var option = document.createElement("option");
        option.value = JSON.stringify(list[index]);
        var text = document.createTextNode(list[index][attribute] + " " + getDatafromObjectList(list[index],attribute2));
        for (ind in selectedvalue){
            if (list[index][attribute] == selectedvalue) {
                option.selected = "selected";
                combo.style.border = "2px solid green";
            }
        }
        option.appendChild(text);
        combo.appendChild(option);
    }
}

function textFieldBinder(field,pattern,obj,prop,oldobj){
    field.setAttribute('data-pattern',pattern);
    field.setAttribute('data-object',obj);
    field.setAttribute('data-oldobject',oldobj);

    var ob = window[field.getAttribute('data-object')];
    var oldob = window[field.getAttribute('data-oldobject')];
    var regpattern = new RegExp(field.getAttribute('data-pattern'));

    var val = field.value.trim();
    if(val != ""){
        if (regpattern.test(val)) {
            // object.property = val;
            ob[prop] = val;
            if (oldob != null && oldob[prop] != ob[prop]){
                field.style.border = updated;
            }else{
                field.style.border = valid;
            }
        }
        else {
            field.style.border = invalid;
            ob[prop] = null;
        }
    }else {
        if(field.required){
            field.style.border = invalid;
            ob[prop] = null;
        }else {
            field.style.border = initial;
            ob[prop] = null;
        }
    }


}

function passwordFieldBinder(field1, field2, pattern, obj, prop, oldObj) {
    field1.setAttribute('data-pattern', pattern);
    field2.setAttribute('data-object', obj);
    field2.setAttribute('data-oldobject', oldObj);

    var ob = window[field2.getAttribute('data-object')];
    var oldOb = window[field2.getAttribute('data-oldobject')];

    var regexPattern = new RegExp(field1.getAttribute('data-pattern'));

    var field1Val = field1.value.trim();
    var field2Val = field2.value.trim();

    if (regexPattern.test(field1Val)) {
        field1.style.border = valid;
    } else {
        field1.style.border = invalid;
    }

    if (field2Val == field1Val && field2Val != '' && regexPattern.test(field2Val)) {
        ob[prop] = field2Val;
        if (oldOb != null && oldOb[prop] != ob[prop]) {
            field1.style.border = updated;
            field2.style.border = updated;
        } else {
            field2.style.border = valid;
        }
    } else {
        field2.style.border = invalid;
        ob[prop] = null;
    }
}


function CheckBoxBinder(field,pattern,obj,prop,oldobj){
    field.setAttribute('data-object',obj);
    field.setAttribute('data-oldobject',oldobj);
    var ob = window[field.getAttribute('data-object')];
    var oldob = window[field.getAttribute('data-oldobject')];

    if (field.checked) {
        ob[prop] = 1;
        if (oldob != null && oldob[prop] != ob[prop]){
            field.parentNode.style.border = updated;
        }else{
            field.parentNode.style.border = valid;
        }
    }
    else {
        ob[prop] = 0;
        if (oldob != null && oldob[prop] != ob[prop]){
            field.parentNode.style.border = updated;
        }else{
            field.parentNode.style.border = initial;
        }

    }

}

function comboBoxBinder(field,pattern,obj,prop,oldobj){
    field.setAttribute('data-object',obj);
    field.setAttribute('data-oldobject',oldobj);
    var ob = window[field.getAttribute('data-object')];
    var oldob = window[field.getAttribute('data-oldobject')];

    ob[prop] = JSON.parse(field.value);

    if (oldob != null && oldob[prop].id != ob[prop].id){
        field.style.border = updated;
    }else {
        field.style.border = valid;
    }
}

function comboBox2Binder(field,pattern,obj,prop,oldobj){
    field.setAttribute('data-object',obj);
    field.setAttribute('data-oldobject',oldobj);
    var ob = window[field.getAttribute('data-object')];
    var oldob = window[field.getAttribute('data-oldobject')];

    ob[prop] = JSON.parse(field.value);

    if (oldob != null && oldob[prop].id != ob[prop].id){
        $('.select2-container').css('border', updated);
      //  field.parentNode.children[2].style.border = updated;
    }else {
        $('.select2-container').css('border', valid);
       // field.parentNode.children[2].style.border = valid;
    }
}

//File Chooser Functions

function fileChooser(parent,id,lblText,labelWidth,extenstions,maxsize,required,ob,prop,oldob){
    var parent = document.getElementById(parent);
    var formGroup = createElement('div',id+'FormGroup');
    var label = createElement('label',id+'Label');
    formGroup.classList.add('fileField');
    label.innerHTML = lblText + " (200*100)";
    label.for = id;
    label.classList.add('control-label');
    label.classList.add('font-weight-bold');
    // label.classList.add('col-md-'+labelWidth);
    var fieldArea = createElement('div');
    fieldArea.classList.add('row');
    var buttonArea = createElement('div');
    buttonArea.classList.add('col-md-6');
    var field = createElement('input',id);
    field.style.width = "275px"
    field.style.height = "100px"
    field.type = 'file';
    field.accept = extenstions.toString();
    field.style.display='none';
    field.setAttribute('data-object',ob);
    field.setAttribute('data-oldobject',oldob);
    field.setAttribute('data-property',prop);
    field.setAttribute('data-maxsize',maxsize);
    field.setAttribute('data-required',required);
    field.classList.add('form-control');
    field.setAttribute('onchange','drawFile(this)');
    fieldArea.appendChild(field);

    fieldButton = createElement('fieldButton');
    fieldButton.type='button';
    fieldButton.style.border = "1.5px solid #d6d6c2";
    fieldButton.classList.add('btn');
    fieldButton.classList.add('btn-block');
    fieldButton.classList.add('btn-primary');

    fieldButton.innerHTML = 'Select a '+lblText;

    fieldButton.setAttribute('onclick','document.getElementById(\''+id+'\').click()');

    buttonArea.appendChild(fieldButton);

    fieldButtonC = createElement('fieldButton');
    fieldButtonC.type='button';
    fieldButtonC.style.border = "1.5px solid #d6d6c2";
    fieldButtonC.style.marginTop = "0";
    fieldButtonC.classList.add('btn');
    fieldButtonC.classList.add('btn-block');
    fieldButtonC.classList.add('btn-info');
    fieldButtonC.classList.add('ml-2');
    fieldButtonC.classList.add('float-right');
    fieldButtonC.innerHTML = 'Clear '+lblText;

    fieldButtonC.onclick=function(){
        window[ob][prop]=null;
        var fileBoxes = formGroup.getElementsByClassName('file-box');
        for(var i=0; i<fileBoxes.length; i++){
            var box = fileBoxes[i];
            box.parentNode.removeChild(box);
        }
    }

    buttonArea.appendChild(fieldButtonC);
    fieldArea.appendChild(buttonArea);

    formGroup.classList.add('form-group');
    formGroup.appendChild(label);
    formGroup.appendChild(fieldArea);
    parent.appendChild(formGroup);

}

function drawFile(field){
    var files = field.files;
    var fieldParent = field.parentNode;
    var formGroup = fieldParent.parentNode;
    var ob = window[field.getAttribute('data-object')];
    var oldob = window[field.getAttribute('data-oldobject')];
    var property = field.getAttribute('data-property');
    var extenstions = field.getAttribute('accept').split(",");
    var fileBoxes = fieldParent.getElementsByClassName('file-box');
    var maxsize = field.getAttribute('data-maxsize')*1000000;
    var required = field.getAttribute('data-required');
    ob[property] = null;
    for(var i=0; i<fileBoxes.length; i++){
        var box = fileBoxes[i];
        var defult = box.getAttribute('default');
        if(defult==null || defult=='false'){
            box.parentNode.removeChild(box);
        }else{
            box.style.display='block';
        }
    }
    if(files.length!=0){
        var file = files[0];
        var filename = file.name;
        var type = file.type.toLowerCase();
        var size =file.size;
        var fileextention = filename.substr(filename.lastIndexOf(".")).toLowerCase();
        if(size>maxsize){
            alert("File size too Large");
        }else{
            var match = false;
            if(extenstions.length==0){
                match = true;
            }else{
                for(var i=0; i<extenstions.length; i++){
                    var ext = extenstions[i].toLowerCase();
                    if(ext.indexOf(".")==-1){
                        ext = ext.replace("/*", "");
                        if(type.indexOf(ext)!=-1){
                            match = true;
                            break;
                        }
                    }else{
                        if(ext==fileextention){
                            match = true;
                            break;
                        }
                    }
                }
            }
            if(match){
                var reader = new FileReader();
                reader.onload = function(e) {
                    ob[property] = btoa(e.target.result);
                    for(var i=0; i<fileBoxes.length; i++){
                        var box = fileBoxes[i];
                        box.style.display='none';
                    }
                    var fileBox = createElement('div');
                  //  fileBox.style.display = "flex";
                    fileBox.style.height = "120px";
                    fileBox.style.width = "100px";
                    fileBox.classList.add('col-md-6');
                    fileBox.classList.add('file-box');
                    var image = createElement('img');
                    image.style.width = "100px";
                    image.style.height = "100px";
                    image.style.borderRadius = "50px";
                    if(type.indexOf("image")!=-1){
                        image.src = e.target.result;
                    }else{
                        var icon = new Icon();
                        if(fileextention=='.pdf'){
                            image.src = icon.pdf;
                        }else if(fileextention=='.zip'){
                            image.src = icon.zip;
                        }else if(fileextention=='.psd'){
                            image.src = icon.ps;
                        }else if(fileextention=='.doc' || fileextention=='.docx'){
                            image.src = icon.doc;
                        }else if(fileextention=='.xls' || fileextention=='.xlsx'){
                            image.src = icon.xls;
                        }else{
                            image.src = icon.file;
                        }
                    }
                    var ul = createElement('ul');
                    ul.style.width = "100px";
                    ul.classList.add('float-right');
                    var li = createElement('li');
                    li.innerHTML = filename;
                    ul.appendChild(li);
                    var li = createElement('li');
                    li.innerHTML = bytesToSize(size);
                    ul.appendChild(li);
                    fileBox.appendChild(image);
                    fileBox.appendChild(ul);
                    field.parentNode.appendChild(fileBox);
                    if(oldob!=null && ob[property]!=oldob[property]){
                        formGroup.classList.add('updated');
                        formGroup.classList.remove('valid');
                        formGroup.classList.remove('invalid');
                    }else{
                        formGroup.classList.remove('updated');
                        formGroup.classList.add('valid');
                        formGroup.classList.remove('invalid');
                    }
                }
                reader.readAsDataURL(file);
                return;
            }else{
                alert("This file type is not valid");
            }
        }

    }
    if(required=='true'){
        formGroup.classList.remove('valid');
        formGroup.classList.remove('updated');
        formGroup.classList.add('invalid');
    }else{
        if(oldob!=null&&oldob[property]!=ob[property]){
            formGroup.classList.remove('valid');
            formGroup.classList.add('updated');
            formGroup.classList.remove('invalid');
        }else{
            formGroup.classList.add('valid');
            formGroup.classList.remove('updated');
            formGroup.classList.remove('invalid');
        }
    }
}

function setDefaultFile(id,file,type='image',name='',size='',static=false){
    var field = document.getElementById(id);
    var formGroup = field.parentNode.parentNode;
    removeFile(id);
    var fileBox = createElement('div');
    if(static) {
        fileBox.setAttribute("default","true");
    }
    fileBox.classList.add('file-box');
    fileBox.classList.add('col-md-6');
    var image = createElement('img');
    if(type=='image'){
        if(file==null){
            image.src = 'resources/image/noimage.png';
        }else{
            image.src = atob(file);
        }
    }else{
        var icon = new Icon();
        if(type=='.pdf'){
            image.src = icon.pdf;
        }else if(type=='.zip'){
            image.src = icon.zip;
        }else if(type=='.psd'){
            image.src = icon.ps;
        }else if(type=='.doc' || type=='.docx'){
            image.src = icon.doc;
        }else if(type=='.xls' || type=='.xlsx'){
            image.src = icon.xls;
        }else{
            image.src = icon.file;
        }
    }
    var ul = createElement('ul');
    var li = createElement('li');
    li.innerHTML = name;
    ul.appendChild(li);
    var li = createElement('li');
    if(size!='') {
        li.innerHTML = bytesToSize(size);
    }
    ul.appendChild(li);
    fileBox.appendChild(image);
    fileBox.appendChild(ul);
    field.parentNode.appendChild(fileBox);
}

function removeFile(id){
    var field = document.getElementById(id);
    var fileBoxes = field.parentNode.getElementsByClassName('file-box');
    for(var i=0; i<fileBoxes.length; i++){
        field.parentNode.removeChild(fileBoxes[i]);
    }
}

function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

function Icon(){
    this.pdf='data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTguMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDU2IDU2IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1NiA1NjsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI1MTJweCIgaGVpZ2h0PSI1MTJweCI+CjxnPgoJPHBhdGggc3R5bGU9ImZpbGw6I0U5RTlFMDsiIGQ9Ik0zNi45ODUsMEg3Ljk2M0M3LjE1NSwwLDYuNSwwLjY1NSw2LjUsMS45MjZWNTVjMCwwLjM0NSwwLjY1NSwxLDEuNDYzLDFoNDAuMDc0ICAgYzAuODA4LDAsMS40NjMtMC42NTUsMS40NjMtMVYxMi45NzhjMC0wLjY5Ni0wLjA5My0wLjkyLTAuMjU3LTEuMDg1TDM3LjYwNywwLjI1N0MzNy40NDIsMC4wOTMsMzcuMjE4LDAsMzYuOTg1LDB6Ii8+Cgk8cG9seWdvbiBzdHlsZT0iZmlsbDojRDlEN0NBOyIgcG9pbnRzPSIzNy41LDAuMTUxIDM3LjUsMTIgNDkuMzQ5LDEyICAiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiNDQzRCNEM7IiBkPSJNMTkuNTE0LDMzLjMyNEwxOS41MTQsMzMuMzI0Yy0wLjM0OCwwLTAuNjgyLTAuMTEzLTAuOTY3LTAuMzI2ICAgYy0xLjA0MS0wLjc4MS0xLjE4MS0xLjY1LTEuMTE1LTIuMjQyYzAuMTgyLTEuNjI4LDIuMTk1LTMuMzMyLDUuOTg1LTUuMDY4YzEuNTA0LTMuMjk2LDIuOTM1LTcuMzU3LDMuNzg4LTEwLjc1ICAgYy0wLjk5OC0yLjE3Mi0xLjk2OC00Ljk5LTEuMjYxLTYuNjQzYzAuMjQ4LTAuNTc5LDAuNTU3LTEuMDIzLDEuMTM0LTEuMjE1YzAuMjI4LTAuMDc2LDAuODA0LTAuMTcyLDEuMDE2LTAuMTcyICAgYzAuNTA0LDAsMC45NDcsMC42NDksMS4yNjEsMS4wNDljMC4yOTUsMC4zNzYsMC45NjQsMS4xNzMtMC4zNzMsNi44MDJjMS4zNDgsMi43ODQsMy4yNTgsNS42Miw1LjA4OCw3LjU2MiAgIGMxLjMxMS0wLjIzNywyLjQzOS0wLjM1OCwzLjM1OC0wLjM1OGMxLjU2NiwwLDIuNTE1LDAuMzY1LDIuOTAyLDEuMTE3YzAuMzIsMC42MjIsMC4xODksMS4zNDktMC4zOSwyLjE2ICAgYy0wLjU1NywwLjc3OS0xLjMyNSwxLjE5MS0yLjIyLDEuMTkxYy0xLjIxNiwwLTIuNjMyLTAuNzY4LTQuMjExLTIuMjg1Yy0yLjgzNywwLjU5My02LjE1LDEuNjUxLTguODI4LDIuODIyICAgYy0wLjgzNiwxLjc3NC0xLjYzNywzLjIwMy0yLjM4Myw0LjI1MUMyMS4yNzMsMzIuNjU0LDIwLjM4OSwzMy4zMjQsMTkuNTE0LDMzLjMyNHogTTIyLjE3NiwyOC4xOTggICBjLTIuMTM3LDEuMjAxLTMuMDA4LDIuMTg4LTMuMDcxLDIuNzQ0Yy0wLjAxLDAuMDkyLTAuMDM3LDAuMzM0LDAuNDMxLDAuNjkyQzE5LjY4NSwzMS41ODcsMjAuNTU1LDMxLjE5LDIyLjE3NiwyOC4xOTh6ICAgIE0zNS44MTMsMjMuNzU2YzAuODE1LDAuNjI3LDEuMDE0LDAuOTQ0LDEuNTQ3LDAuOTQ0YzAuMjM0LDAsMC45MDEtMC4wMSwxLjIxLTAuNDQxYzAuMTQ5LTAuMjA5LDAuMjA3LTAuMzQzLDAuMjMtMC40MTUgICBjLTAuMTIzLTAuMDY1LTAuMjg2LTAuMTk3LTEuMTc1LTAuMTk3QzM3LjEyLDIzLjY0OCwzNi40ODUsMjMuNjcsMzUuODEzLDIzLjc1NnogTTI4LjM0MywxNy4xNzQgICBjLTAuNzE1LDIuNDc0LTEuNjU5LDUuMTQ1LTIuNjc0LDcuNTY0YzIuMDktMC44MTEsNC4zNjItMS41MTksNi40OTYtMi4wMkMzMC44MTUsMjEuMTUsMjkuNDY2LDE5LjE5MiwyOC4zNDMsMTcuMTc0eiAgICBNMjcuNzM2LDguNzEyYy0wLjA5OCwwLjAzMy0xLjMzLDEuNzU3LDAuMDk2LDMuMjE2QzI4Ljc4MSw5LjgxMywyNy43NzksOC42OTgsMjcuNzM2LDguNzEyeiIvPgoJPHBhdGggc3R5bGU9ImZpbGw6I0NDNEI0QzsiIGQ9Ik00OC4wMzcsNTZINy45NjNDNy4xNTUsNTYsNi41LDU1LjM0NSw2LjUsNTQuNTM3VjM5aDQzdjE1LjUzN0M0OS41LDU1LjM0NSw0OC44NDUsNTYsNDguMDM3LDU2eiIvPgoJPGc+CgkJPHBhdGggc3R5bGU9ImZpbGw6I0ZGRkZGRjsiIGQ9Ik0xNy4zODUsNTNoLTEuNjQxVjQyLjkyNGgyLjg5OGMwLjQyOCwwLDAuODUyLDAuMDY4LDEuMjcxLDAuMjA1ICAgIGMwLjQxOSwwLjEzNywwLjc5NSwwLjM0MiwxLjEyOCwwLjYxNWMwLjMzMywwLjI3MywwLjYwMiwwLjYwNCwwLjgwNywwLjk5MXMwLjMwOCwwLjgyMiwwLjMwOCwxLjMwNiAgICBjMCwwLjUxMS0wLjA4NywwLjk3My0wLjI2LDEuMzg4Yy0wLjE3MywwLjQxNS0wLjQxNSwwLjc2NC0wLjcyNSwxLjA0NmMtMC4zMSwwLjI4Mi0wLjY4NCwwLjUwMS0xLjEyMSwwLjY1NiAgICBzLTAuOTIxLDAuMjMyLTEuNDQ5LDAuMjMyaC0xLjIxN1Y1M3ogTTE3LjM4NSw0NC4xNjh2My45OTJoMS41MDRjMC4yLDAsMC4zOTgtMC4wMzQsMC41OTUtMC4xMDMgICAgYzAuMTk2LTAuMDY4LDAuMzc2LTAuMTgsMC41NC0wLjMzNWMwLjE2NC0wLjE1NSwwLjI5Ni0wLjM3MSwwLjM5Ni0wLjY0OWMwLjEtMC4yNzgsMC4xNS0wLjYyMiwwLjE1LTEuMDMyICAgIGMwLTAuMTY0LTAuMDIzLTAuMzU0LTAuMDY4LTAuNTY3Yy0wLjA0Ni0wLjIxNC0wLjEzOS0wLjQxOS0wLjI4LTAuNjE1Yy0wLjE0Mi0wLjE5Ni0wLjM0LTAuMzYtMC41OTUtMC40OTIgICAgYy0wLjI1NS0wLjEzMi0wLjU5My0wLjE5OC0xLjAxMi0wLjE5OEgxNy4zODV6Ii8+CgkJPHBhdGggc3R5bGU9ImZpbGw6I0ZGRkZGRjsiIGQ9Ik0zMi4yMTksNDcuNjgyYzAsMC44MjktMC4wODksMS41MzgtMC4yNjcsMi4xMjZzLTAuNDAzLDEuMDgtMC42NzcsMS40NzdzLTAuNTgxLDAuNzA5LTAuOTIzLDAuOTM3ICAgIHMtMC42NzIsMC4zOTgtMC45OTEsMC41MTNjLTAuMzE5LDAuMTE0LTAuNjExLDAuMTg3LTAuODc1LDAuMjE5QzI4LjIyMiw1Mi45ODQsMjguMDI2LDUzLDI3Ljg5OCw1M2gtMy44MTRWNDIuOTI0aDMuMDM1ICAgIGMwLjg0OCwwLDEuNTkzLDAuMTM1LDIuMjM1LDAuNDAzczEuMTc2LDAuNjI3LDEuNiwxLjA3M3MwLjc0LDAuOTU1LDAuOTUsMS41MjRDMzIuMTE0LDQ2LjQ5NCwzMi4yMTksNDcuMDgsMzIuMjE5LDQ3LjY4MnogICAgIE0yNy4zNTIsNTEuNzk3YzEuMTEyLDAsMS45MTQtMC4zNTUsMi40MDYtMS4wNjZzMC43MzgtMS43NDEsMC43MzgtMy4wOWMwLTAuNDE5LTAuMDUtMC44MzQtMC4xNS0xLjI0NCAgICBjLTAuMTAxLTAuNDEtMC4yOTQtMC43ODEtMC41ODEtMS4xMTRzLTAuNjc3LTAuNjAyLTEuMTY5LTAuODA3cy0xLjEzLTAuMzA4LTEuOTE0LTAuMzA4aC0wLjk1N3Y3LjYyOUgyNy4zNTJ6Ii8+CgkJPHBhdGggc3R5bGU9ImZpbGw6I0ZGRkZGRjsiIGQ9Ik0zNi4yNjYsNDQuMTY4djMuMTcyaDQuMjExdjEuMTIxaC00LjIxMVY1M2gtMS42NjhWNDIuOTI0SDQwLjl2MS4yNDRIMzYuMjY2eiIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=';this.ps='data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTguMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUyIDUyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MiA1MjsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI1MTJweCIgaGVpZ2h0PSI1MTJweCI+CjxnPgoJPHBhdGggc3R5bGU9ImZpbGw6IzM5MzY4NzsiIGQ9Ik00MC44MjQsNTJIMTEuMTc2QzUuMDAzLDUyLDAsNDYuOTk3LDAsNDAuODI0VjExLjE3NkMwLDUuMDAzLDUuMDAzLDAsMTEuMTc2LDBoMjkuNjQ5ICAgQzQ2Ljk5NywwLDUyLDUuMDAzLDUyLDExLjE3NnYyOS42NDlDNTIsNDYuOTk3LDQ2Ljk5Nyw1Miw0MC44MjQsNTJ6Ii8+Cgk8Zz4KCQk8cGF0aCBzdHlsZT0iZmlsbDojODlEM0ZGOyIgZD0iTTEyLjE2LDM5SDkuMjhWMTFoOS42NGMyLjYxMywwLDQuNTUzLDAuODEzLDUuODIsMi40NGMxLjI2NiwxLjYyNiwxLjksMy43NiwxLjksNi4zOTkgICAgYzAsMC45MzQtMC4wMjcsMS43NC0wLjA4LDIuNDJjLTAuMDU0LDAuNjgxLTAuMjIsMS41MzQtMC41LDIuNTYxYy0wLjI4LDEuMDI2LTAuNjYsMS44NjYtMS4xNCwyLjUyICAgIGMtMC40OCwwLjY1NC0xLjIxMywxLjIyNy0yLjIsMS43MmMtMC45ODcsMC40OTQtMi4xNiwwLjc0LTMuNTIsMC43NGgtNy4wNFYzOXogTTEyLjE2LDI3aDYuNjhjMC45NiwwLDEuNzczLTAuMTg3LDIuNDQtMC41NiAgICBjMC42NjYtMC4zNzQsMS4xNTMtMC43NzMsMS40Ni0xLjJjMC4zMDYtMC40MjcsMC41NDYtMS4wNCwwLjcyLTEuODRjMC4xNzMtMC44MDEsMC4yNjctMS40LDAuMjgtMS44MDEgICAgYzAuMDEzLTAuMzk5LDAuMDItMC45NzMsMC4wMi0xLjcyYzAtNC4wNTMtMS42OTQtNi4wOC01LjA4LTYuMDhoLTYuNTJWMjd6Ii8+CgkJPHBhdGggc3R5bGU9ImZpbGw6Izg5RDNGRjsiIGQ9Ik0yOS40OCwzMy45MmwyLjgtMC4xMmMwLjEwNiwwLjk4NywwLjYsMS43NTQsMS40OCwyLjNjMC44OCwwLjU0NywxLjg5MywwLjgyLDMuMDQsMC44MiAgICBzMi4xNC0wLjI2LDIuOTgtMC43OGMwLjg0LTAuNTIsMS4yNi0xLjI2NiwxLjI2LTIuMjM5cy0wLjM2LTEuNzQ3LTEuMDgtMi4zMmMtMC43Mi0wLjU3My0xLjYtMS4wMjYtMi42NC0xLjM2ICAgIGMtMS4wNC0wLjMzMy0yLjA4Ni0wLjY4Ni0zLjE0LTEuMDZjLTEuMDU0LTAuMzczLTEuOTgtMC45Ni0yLjc4LTEuNzZjLTAuOTg3LTAuOTM0LTEuNDgtMi4wNzMtMS40OC0zLjQyczAuNTQtMi42MDEsMS42Mi0zLjc2MSAgICBzMi44MzMtMS43MzksNS4yNi0xLjczOWMwLjg1NCwwLDEuNjUzLDAuMSwyLjQsMC4zYzAuNzQ2LDAuMiwxLjI4LDAuMzk0LDEuNiwwLjU4bDAuNDgsMC4yNzlsLTAuOTIsMi41MjEgICAgYy0wLjg1NC0wLjY2Ni0xLjk3NC0xLTMuMzYtMWMtMS4zODcsMC0yLjQyLDAuMjYtMy4xLDAuNzhjLTAuNjgsMC41Mi0xLjAyLDEuMTgtMS4wMiwxLjk3OWMwLDAuODgsMC40MjYsMS41NzQsMS4yOCwyLjA4ICAgIGMwLjg1MywwLjUwNywxLjgxMywwLjkzNCwyLjg4LDEuMjhjMS4wNjYsMC4zNDcsMi4xMjYsMC43MzMsMy4xOCwxLjE2YzEuMDUzLDAuNDI3LDEuOTQ2LDEuMDk0LDIuNjgsMnMxLjEsMi4xMDYsMS4xLDMuNiAgICBjMCwxLjQ5NC0wLjYsMi43OTQtMS44LDMuOUM0MSwzOS4wNDYsMzkuMjQ2LDM5LjYsMzYuOTQsMzkuNmMtMi4zMDcsMC00LjExNC0wLjU0Ny01LjQyLTEuNjQgICAgQzMwLjIxMywzNi44NjcsMjkuNTMzLDM1LjUyLDI5LjQ4LDMzLjkyeiIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=';this.file='data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTguMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDU2IDU2IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1NiA1NjsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI1MTJweCIgaGVpZ2h0PSI1MTJweCI+CjxnPgoJPHBhdGggc3R5bGU9ImZpbGw6I0U5RTlFMDsiIGQ9Ik0zNi45ODUsMEg3Ljk2M0M3LjE1NSwwLDYuNSwwLjY1NSw2LjUsMS45MjZWNTVjMCwwLjM0NSwwLjY1NSwxLDEuNDYzLDFoNDAuMDc0ICAgYzAuODA4LDAsMS40NjMtMC42NTUsMS40NjMtMVYxMi45NzhjMC0wLjY5Ni0wLjA5My0wLjkyLTAuMjU3LTEuMDg1TDM3LjYwNywwLjI1N0MzNy40NDIsMC4wOTMsMzcuMjE4LDAsMzYuOTg1LDB6Ii8+Cgk8cG9seWdvbiBzdHlsZT0iZmlsbDojRDlEN0NBOyIgcG9pbnRzPSIzNy41LDAuMTUxIDM3LjUsMTIgNDkuMzQ5LDEyICAiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiNDOEJEQjg7IiBkPSJNNDguMDM3LDU2SDcuOTYzQzcuMTU1LDU2LDYuNSw1NS4zNDUsNi41LDU0LjUzN1YzOWg0M3YxNS41MzdDNDkuNSw1NS4zNDUsNDguODQ1LDU2LDQ4LjAzNyw1NnoiLz4KCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0ZGRkZGRjsiIGN4PSIxOC41IiBjeT0iNDciIHI9IjMiLz4KCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0ZGRkZGRjsiIGN4PSIyOC41IiBjeT0iNDciIHI9IjMiLz4KCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0ZGRkZGRjsiIGN4PSIzOC41IiBjeT0iNDciIHI9IjMiLz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K';this.xls='data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTguMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDU2IDU2IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1NiA1NjsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI1MTJweCIgaGVpZ2h0PSI1MTJweCI+CjxnPgoJPHBhdGggc3R5bGU9ImZpbGw6I0U5RTlFMDsiIGQ9Ik0zNi45ODUsMEg3Ljk2M0M3LjE1NSwwLDYuNSwwLjY1NSw2LjUsMS45MjZWNTVjMCwwLjM0NSwwLjY1NSwxLDEuNDYzLDFoNDAuMDc0ICAgYzAuODA4LDAsMS40NjMtMC42NTUsMS40NjMtMVYxMi45NzhjMC0wLjY5Ni0wLjA5My0wLjkyLTAuMjU3LTEuMDg1TDM3LjYwNywwLjI1N0MzNy40NDIsMC4wOTMsMzcuMjE4LDAsMzYuOTg1LDB6Ii8+Cgk8cG9seWdvbiBzdHlsZT0iZmlsbDojRDlEN0NBOyIgcG9pbnRzPSIzNy41LDAuMTUxIDM3LjUsMTIgNDkuMzQ5LDEyICAiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiM5MUNEQTA7IiBkPSJNNDguMDM3LDU2SDcuOTYzQzcuMTU1LDU2LDYuNSw1NS4zNDUsNi41LDU0LjUzN1YzOWg0M3YxNS41MzdDNDkuNSw1NS4zNDUsNDguODQ1LDU2LDQ4LjAzNyw1NnoiLz4KCTxnPgoJCTxwYXRoIHN0eWxlPSJmaWxsOiNGRkZGRkY7IiBkPSJNMjAuMzc5LDQ4LjEwNUwyMi45MzYsNTNoLTEuOWwtMS42LTMuODAxaC0wLjEzN0wxNy41NzYsNTNoLTEuOWwyLjU1Ny00Ljg5NWwtMi43MjEtNS4xODJoMS44NzMgICAgbDEuNzc3LDQuMTAyaDAuMTM3bDEuOTI4LTQuMTAySDIzLjFMMjAuMzc5LDQ4LjEwNXoiLz4KCQk8cGF0aCBzdHlsZT0iZmlsbDojRkZGRkZGOyIgZD0iTTI3LjAzNyw0Mi45MjR2OC44MzJoNC42MzVWNTNoLTYuMzAzVjQyLjkyNEgyNy4wMzd6Ii8+CgkJPHBhdGggc3R5bGU9ImZpbGw6I0ZGRkZGRjsiIGQ9Ik0zOS4wNDEsNTAuMjM4YzAsMC4zNjQtMC4wNzUsMC43MTgtMC4yMjYsMS4wNlMzOC40NTMsNTEuOTQsMzguMTgsNTIuMnMtMC42MTEsMC40NjctMS4wMTIsMC42MjIgICAgYy0wLjQwMSwwLjE1NS0wLjg1NywwLjIzMi0xLjM2NywwLjIzMmMtMC4yMTksMC0wLjQ0NC0wLjAxMi0wLjY3Ny0wLjAzNHMtMC40NjctMC4wNjItMC43MDQtMC4xMTYgICAgYy0wLjIzNy0wLjA1NS0wLjQ2My0wLjEzLTAuNjc3LTAuMjI2Yy0wLjIxNC0wLjA5Ni0wLjM5OS0wLjIxMi0wLjU1NC0wLjM0OWwwLjI4Ny0xLjE3NmMwLjEyNywwLjA3MywwLjI4OSwwLjE0NCwwLjQ4NSwwLjIxMiAgICBjMC4xOTYsMC4wNjgsMC4zOTgsMC4xMzIsMC42MDgsMC4xOTFjMC4yMDksMC4wNiwwLjQxOSwwLjEwNywwLjYyOSwwLjE0NGMwLjIwOSwwLjAzNiwwLjQwNSwwLjA1NSwwLjU4OCwwLjA1NSAgICBjMC41NTYsMCwwLjk4Mi0wLjEzLDEuMjc4LTAuMzljMC4yOTYtMC4yNiwwLjQ0NC0wLjY0NSwwLjQ0NC0xLjE1NWMwLTAuMzEtMC4xMDUtMC41NzQtMC4zMTQtMC43OTMgICAgYy0wLjIxLTAuMjE5LTAuNDcyLTAuNDE3LTAuNzg2LTAuNTk1cy0wLjY1NC0wLjM1NS0xLjAxOS0wLjUzM2MtMC4zNjUtMC4xNzgtMC43MDctMC4zODgtMS4wMjUtMC42MjkgICAgYy0wLjMxOS0wLjI0MS0wLjU4My0wLjUyNi0wLjc5My0wLjg1NGMtMC4yMS0wLjMyOC0wLjMxNC0wLjczOC0wLjMxNC0xLjIzYzAtMC40NDYsMC4wODItMC44NDMsMC4yNDYtMS4xODkgICAgczAuMzg1LTAuNjQxLDAuNjYzLTAuODgyYzAuMjc4LTAuMjQxLDAuNjAyLTAuNDI2LDAuOTcxLTAuNTU0czAuNzU5LTAuMTkxLDEuMTY5LTAuMTkxYzAuNDE5LDAsMC44NDMsMC4wMzksMS4yNzEsMC4xMTYgICAgYzAuNDI4LDAuMDc3LDAuNzc0LDAuMjAzLDEuMDM5LDAuMzc2Yy0wLjA1NSwwLjExOC0wLjExOSwwLjI0OC0wLjE5MSwwLjM5Yy0wLjA3MywwLjE0Mi0wLjE0MiwwLjI3My0wLjIwNSwwLjM5NiAgICBjLTAuMDY0LDAuMTIzLTAuMTE5LDAuMjI2LTAuMTY0LDAuMzA4Yy0wLjA0NiwwLjA4Mi0wLjA3MywwLjEyOC0wLjA4MiwwLjEzN2MtMC4wNTUtMC4wMjctMC4xMTYtMC4wNjMtMC4xODUtMC4xMDkgICAgcy0wLjE2Ny0wLjA5MS0wLjI5NC0wLjEzN2MtMC4xMjgtMC4wNDYtMC4yOTYtMC4wNzctMC41MDYtMC4wOTZjLTAuMjEtMC4wMTktMC40NzktMC4wMTQtMC44MDcsMC4wMTQgICAgYy0wLjE4MywwLjAxOS0wLjM1NSwwLjA3LTAuNTIsMC4xNTdzLTAuMzEsMC4xOTMtMC40MzgsMC4zMjFjLTAuMTI4LDAuMTI4LTAuMjI4LDAuMjcxLTAuMzAxLDAuNDMxICAgIGMtMC4wNzMsMC4xNTktMC4xMDksMC4zMTMtMC4xMDksMC40NThjMCwwLjM2NCwwLjEwNCwwLjY1OCwwLjMxNCwwLjg4MmMwLjIwOSwwLjIyNCwwLjQ2OSwwLjQxOSwwLjc3OSwwLjU4OCAgICBjMC4zMSwwLjE2OSwwLjY0NywwLjMzMywxLjAxMiwwLjQ5MmMwLjM2NCwwLjE1OSwwLjcwNCwwLjM1NCwxLjAxOSwwLjU4MXMwLjU3NiwwLjUxMywwLjc4NiwwLjg1NCAgICBDMzguOTM2LDQ5LjI2MSwzOS4wNDEsNDkuNywzOS4wNDEsNTAuMjM4eiIvPgoJPC9nPgoJPHBhdGggc3R5bGU9ImZpbGw6I0M4QkRCODsiIGQ9Ik0yMy41LDE2di00aC0xMnY0djJ2MnYydjJ2MnYydjJ2NGgxMGgyaDIxdi00di0ydi0ydi0ydi0ydi0ydi00SDIzLjV6IE0xMy41LDE0aDh2MmgtOFYxNHogICAgTTEzLjUsMThoOHYyaC04VjE4eiBNMTMuNSwyMmg4djJoLThWMjJ6IE0xMy41LDI2aDh2MmgtOFYyNnogTTIxLjUsMzJoLTh2LTJoOFYzMnogTTQyLjUsMzJoLTE5di0yaDE5VjMyeiBNNDIuNSwyOGgtMTl2LTJoMTlWMjggICB6IE00Mi41LDI0aC0xOXYtMmgxOVYyNHogTTIzLjUsMjB2LTJoMTl2MkgyMy41eiIvPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=';this.doc='data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTguMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDU2IDU2IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1NiA1NjsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI1MTJweCIgaGVpZ2h0PSI1MTJweCI+CjxnPgoJPHBhdGggc3R5bGU9ImZpbGw6I0U5RTlFMDsiIGQ9Ik0zNi45ODUsMEg3Ljk2M0M3LjE1NSwwLDYuNSwwLjY1NSw2LjUsMS45MjZWNTVjMCwwLjM0NSwwLjY1NSwxLDEuNDYzLDFoNDAuMDc0ICAgYzAuODA4LDAsMS40NjMtMC42NTUsMS40NjMtMVYxMi45NzhjMC0wLjY5Ni0wLjA5My0wLjkyLTAuMjU3LTEuMDg1TDM3LjYwNywwLjI1N0MzNy40NDIsMC4wOTMsMzcuMjE4LDAsMzYuOTg1LDB6Ii8+Cgk8cG9seWdvbiBzdHlsZT0iZmlsbDojRDlEN0NBOyIgcG9pbnRzPSIzNy41LDAuMTUxIDM3LjUsMTIgNDkuMzQ5LDEyICAiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiM4Njk3Q0I7IiBkPSJNMTguNSwxM2gtNmMtMC41NTIsMC0xLTAuNDQ4LTEtMXMwLjQ0OC0xLDEtMWg2YzAuNTUyLDAsMSwwLjQ0OCwxLDFTMTkuMDUyLDEzLDE4LjUsMTN6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojODY5N0NCOyIgZD0iTTIxLjUsMThoLTljLTAuNTUyLDAtMS0wLjQ0OC0xLTFzMC40NDgtMSwxLTFoOWMwLjU1MiwwLDEsMC40NDgsMSwxUzIyLjA1MiwxOCwyMS41LDE4eiIvPgoJPHBhdGggc3R5bGU9ImZpbGw6Izg2OTdDQjsiIGQ9Ik0yNS41LDE4Yy0wLjI2LDAtMC41Mi0wLjExLTAuNzEtMC4yOWMtMC4xOC0wLjE5LTAuMjktMC40NS0wLjI5LTAuNzFjMC0wLjI2LDAuMTEtMC41MiwwLjI5LTAuNzEgICBjMC4zNy0wLjM3LDEuMDUtMC4zNywxLjQyLDBjMC4xOCwwLjE5LDAuMjksMC40NSwwLjI5LDAuNzFjMCwwLjI2LTAuMTEsMC41Mi0wLjI5LDAuNzFDMjYuMDIsMTcuODksMjUuNzYsMTgsMjUuNSwxOHoiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiM4Njk3Q0I7IiBkPSJNMzcuNSwxOGgtOGMtMC41NTIsMC0xLTAuNDQ4LTEtMXMwLjQ0OC0xLDEtMWg4YzAuNTUyLDAsMSwwLjQ0OCwxLDFTMzguMDUyLDE4LDM3LjUsMTh6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojODY5N0NCOyIgZD0iTTEyLjUsMzNjLTAuMjYsMC0wLjUyLTAuMTEtMC43MS0wLjI5Yy0wLjE4LTAuMTktMC4yOS0wLjQ1LTAuMjktMC43MWMwLTAuMjYsMC4xMS0wLjUyLDAuMjktMC43MSAgIGMwLjM3LTAuMzcsMS4wNS0wLjM3LDEuNDIsMGMwLjE4LDAuMTksMC4yOSwwLjQ0LDAuMjksMC43MWMwLDAuMjYtMC4xMSwwLjUyLTAuMjksMC43MUMxMy4wMiwzMi44OSwxMi43NiwzMywxMi41LDMzeiIvPgoJPHBhdGggc3R5bGU9ImZpbGw6Izg2OTdDQjsiIGQ9Ik0yNC41LDMzaC04Yy0wLjU1MiwwLTEtMC40NDgtMS0xczAuNDQ4LTEsMS0xaDhjMC41NTIsMCwxLDAuNDQ4LDEsMVMyNS4wNTIsMzMsMjQuNSwzM3oiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiM4Njk3Q0I7IiBkPSJNNDMuNSwxOGgtMmMtMC41NTIsMC0xLTAuNDQ4LTEtMXMwLjQ0OC0xLDEtMWgyYzAuNTUyLDAsMSwwLjQ0OCwxLDFTNDQuMDUyLDE4LDQzLjUsMTh6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojODY5N0NCOyIgZD0iTTM0LjUsMjNoLTIyYy0wLjU1MiwwLTEtMC40NDgtMS0xczAuNDQ4LTEsMS0xaDIyYzAuNTUyLDAsMSwwLjQ0OCwxLDFTMzUuMDUyLDIzLDM0LjUsMjN6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojODY5N0NCOyIgZD0iTTQzLjUsMjNoLTZjLTAuNTUyLDAtMS0wLjQ0OC0xLTFzMC40NDgtMSwxLTFoNmMwLjU1MiwwLDEsMC40NDgsMSwxUzQ0LjA1MiwyMyw0My41LDIzeiIvPgoJPHBhdGggc3R5bGU9ImZpbGw6Izg2OTdDQjsiIGQ9Ik0xNi41LDI4aC00Yy0wLjU1MiwwLTEtMC40NDgtMS0xczAuNDQ4LTEsMS0xaDRjMC41NTIsMCwxLDAuNDQ4LDEsMVMxNy4wNTIsMjgsMTYuNSwyOHoiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiM4Njk3Q0I7IiBkPSJNMzAuNSwyOGgtMTBjLTAuNTUyLDAtMS0wLjQ0OC0xLTFzMC40NDgtMSwxLTFoMTBjMC41NTIsMCwxLDAuNDQ4LDEsMVMzMS4wNTIsMjgsMzAuNSwyOHoiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiM4Njk3Q0I7IiBkPSJNNDMuNSwyOGgtOWMtMC41NTIsMC0xLTAuNDQ4LTEtMXMwLjQ0OC0xLDEtMWg5YzAuNTUyLDAsMSwwLjQ0OCwxLDFTNDQuMDUyLDI4LDQzLjUsMjh6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojMDA5NkU2OyIgZD0iTTQ4LjAzNyw1Nkg3Ljk2M0M3LjE1NSw1Niw2LjUsNTUuMzQ1LDYuNSw1NC41MzdWMzloNDN2MTUuNTM3QzQ5LjUsNTUuMzQ1LDQ4Ljg0NSw1Niw0OC4wMzcsNTZ6Ii8+Cgk8Zz4KCQk8cGF0aCBzdHlsZT0iZmlsbDojRkZGRkZGOyIgZD0iTTIzLjUsNDcuNjgyYzAsMC44MjktMC4wODksMS41MzgtMC4yNjcsMi4xMjZzLTAuNDAzLDEuMDgtMC42NzcsMS40NzdzLTAuNTgxLDAuNzA5LTAuOTIzLDAuOTM3ICAgIHMtMC42NzIsMC4zOTgtMC45OTEsMC41MTNjLTAuMzE5LDAuMTE0LTAuNjExLDAuMTg3LTAuODc1LDAuMjE5QzE5LjUwMyw1Mi45ODQsMTkuMzA3LDUzLDE5LjE4LDUzaC0zLjgxNFY0Mi45MjRIMTguNCAgICBjMC44NDgsMCwxLjU5MywwLjEzNSwyLjIzNSwwLjQwM3MxLjE3NiwwLjYyNywxLjYsMS4wNzNzMC43NCwwLjk1NSwwLjk1LDEuNTI0QzIzLjM5NSw0Ni40OTQsMjMuNSw0Ny4wOCwyMy41LDQ3LjY4MnogICAgIE0xOC42MzMsNTEuNzk3YzEuMTEyLDAsMS45MTQtMC4zNTUsMi40MDYtMS4wNjZzMC43MzgtMS43NDEsMC43MzgtMy4wOWMwLTAuNDE5LTAuMDUtMC44MzQtMC4xNS0xLjI0NCAgICBjLTAuMTAxLTAuNDEtMC4yOTQtMC43ODEtMC41ODEtMS4xMTRzLTAuNjc3LTAuNjAyLTEuMTY5LTAuODA3cy0xLjEzLTAuMzA4LTEuOTE0LTAuMzA4aC0wLjk1N3Y3LjYyOUgxOC42MzN6Ii8+CgkJPHBhdGggc3R5bGU9ImZpbGw6I0ZGRkZGRjsiIGQ9Ik0zMy40NzUsNDcuOTE0YzAsMC44NDgtMC4xMDcsMS41OTUtMC4zMjEsMi4yNDJjLTAuMjE0LDAuNjQ3LTAuNTExLDEuMTg1LTAuODg5LDEuNjEzICAgIGMtMC4zNzgsMC40MjktMC44MiwwLjc1Mi0xLjMyNiwwLjk3MXMtMS4wNiwwLjMyOC0xLjY2MSwwLjMyOHMtMS4xNTUtMC4xMDktMS42NjEtMC4zMjhzLTAuOTQ4LTAuNTQyLTEuMzI2LTAuOTcxICAgIGMtMC4zNzgtMC40MjktMC42NzUtMC45NjYtMC44ODktMS42MTNjLTAuMjE0LTAuNjQ3LTAuMzIxLTEuMzk1LTAuMzIxLTIuMjQyczAuMTA3LTEuNTkzLDAuMzIxLTIuMjM1ICAgIGMwLjIxNC0wLjY0MywwLjUxLTEuMTc4LDAuODg5LTEuNjA2YzAuMzc4LTAuNDI5LDAuODItMC43NTQsMS4zMjYtMC45NzhzMS4wNi0wLjMzNSwxLjY2MS0wLjMzNXMxLjE1NSwwLjExMSwxLjY2MSwwLjMzNSAgICBzMC45NDgsMC41NDksMS4zMjYsMC45NzhjMC4zNzgsMC40MjksMC42NzQsMC45NjQsMC44ODksMS42MDZDMzMuMzY3LDQ2LjMyMSwzMy40NzUsNDcuMDY2LDMzLjQ3NSw0Ny45MTR6IE0yOS4yMzYsNTEuNzI5ICAgIGMwLjMzNywwLDAuNjU4LTAuMDY2LDAuOTY0LTAuMTk4YzAuMzA1LTAuMTMyLDAuNTc5LTAuMzQ5LDAuODItMC42NDljMC4yNDEtMC4zMDEsMC40MzEtMC42OTUsMC41NjctMS4xODMgICAgczAuMjA5LTEuMDgyLDAuMjE5LTEuNzg0Yy0wLjAwOS0wLjY4NC0wLjA4LTEuMjY1LTAuMjEyLTEuNzQzYy0wLjEzMi0wLjQ3OS0wLjMxNC0wLjg3My0wLjU0Ny0xLjE4M3MtMC40OTctMC41MzMtMC43OTMtMC42NyAgICBjLTAuMjk2LTAuMTM3LTAuNjA4LTAuMjA1LTAuOTM3LTAuMjA1Yy0wLjMzNywwLTAuNjU5LDAuMDYzLTAuOTY0LDAuMTkxYy0wLjMwNiwwLjEyOC0wLjU3OSwwLjM0NC0wLjgyLDAuNjQ5ICAgIGMtMC4yNDIsMC4zMDYtMC40MzEsMC42OTktMC41NjcsMS4xODNzLTAuMjEsMS4wNzUtMC4yMTksMS43NzdjMC4wMDksMC42ODQsMC4wOCwxLjI2NywwLjIxMiwxLjc1ICAgIGMwLjEzMiwwLjQ4MywwLjMxNCwwLjg3NywwLjU0NywxLjE4M3MwLjQ5NywwLjUyOCwwLjc5MywwLjY3QzI4LjU5Niw1MS42NTgsMjguOTA4LDUxLjcyOSwyOS4yMzYsNTEuNzI5eiIvPgoJCTxwYXRoIHN0eWxlPSJmaWxsOiNGRkZGRkY7IiBkPSJNNDIuNjA3LDUxLjk3NWMtMC4zNzQsMC4zNjQtMC43OTgsMC42MzgtMS4yNzEsMC44MmMtMC40NzQsMC4xODMtMC45ODQsMC4yNzMtMS41MzEsMC4yNzMgICAgYy0wLjYwMiwwLTEuMTU1LTAuMTA5LTEuNjYxLTAuMzI4cy0wLjk0OC0wLjU0Mi0xLjMyNi0wLjk3MWMtMC4zNzgtMC40MjktMC42NzUtMC45NjYtMC44ODktMS42MTMgICAgYy0wLjIxNC0wLjY0Ny0wLjMyMS0xLjM5NS0wLjMyMS0yLjI0MnMwLjEwNy0xLjU5MywwLjMyMS0yLjIzNWMwLjIxNC0wLjY0MywwLjUxLTEuMTc4LDAuODg5LTEuNjA2ICAgIGMwLjM3OC0wLjQyOSwwLjgyMi0wLjc1NCwxLjMzMy0wLjk3OGMwLjUxLTAuMjI0LDEuMDYyLTAuMzM1LDEuNjU0LTAuMzM1YzAuNTQ3LDAsMS4wNTcsMC4wOTEsMS41MzEsMC4yNzMgICAgYzAuNDc0LDAuMTgzLDAuODk3LDAuNDU2LDEuMjcxLDAuODJsLTEuMTM1LDEuMDEyYy0wLjIyOC0wLjI2NS0wLjQ4MS0wLjQ1Ni0wLjc1OS0wLjU3NGMtMC4yNzgtMC4xMTgtMC41NjctMC4xNzgtMC44NjgtMC4xNzggICAgYy0wLjMzNywwLTAuNjU5LDAuMDYzLTAuOTY0LDAuMTkxYy0wLjMwNiwwLjEyOC0wLjU3OSwwLjM0NC0wLjgyLDAuNjQ5Yy0wLjI0MiwwLjMwNi0wLjQzMSwwLjY5OS0wLjU2NywxLjE4MyAgICBzLTAuMjEsMS4wNzUtMC4yMTksMS43NzdjMC4wMDksMC42ODQsMC4wOCwxLjI2NywwLjIxMiwxLjc1YzAuMTMyLDAuNDgzLDAuMzE0LDAuODc3LDAuNTQ3LDEuMTgzczAuNDk3LDAuNTI4LDAuNzkzLDAuNjcgICAgYzAuMjk2LDAuMTQyLDAuNjA4LDAuMjEyLDAuOTM3LDAuMjEyczAuNjM2LTAuMDYsMC45MjMtMC4xNzhzMC41NDktMC4zMSwwLjc4Ni0wLjU3NEw0Mi42MDcsNTEuOTc1eiIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=';this.zip='data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTguMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDU2IDU2IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1NiA1NjsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI1MTJweCIgaGVpZ2h0PSI1MTJweCI+CjxnPgoJPHBhdGggc3R5bGU9ImZpbGw6I0U5RTlFMDsiIGQ9Ik0zNi45ODUsMEg3Ljk2M0M3LjE1NSwwLDYuNSwwLjY1NSw2LjUsMS45MjZWNTVjMCwwLjM0NSwwLjY1NSwxLDEuNDYzLDFoNDAuMDc0ICAgYzAuODA4LDAsMS40NjMtMC42NTUsMS40NjMtMVYxMi45NzhjMC0wLjY5Ni0wLjA5My0wLjkyLTAuMjU3LTEuMDg1TDM3LjYwNywwLjI1N0MzNy40NDIsMC4wOTMsMzcuMjE4LDAsMzYuOTg1LDB6Ii8+Cgk8cG9seWdvbiBzdHlsZT0iZmlsbDojRDlEN0NBOyIgcG9pbnRzPSIzNy41LDAuMTUxIDM3LjUsMTIgNDkuMzQ5LDEyICAiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiM1NTYwODA7IiBkPSJNNDguMDM3LDU2SDcuOTYzQzcuMTU1LDU2LDYuNSw1NS4zNDUsNi41LDU0LjUzN1YzOWg0M3YxNS41MzdDNDkuNSw1NS4zNDUsNDguODQ1LDU2LDQ4LjAzNyw1NnoiLz4KCTxnPgoJCTxwYXRoIHN0eWxlPSJmaWxsOiNGRkZGRkY7IiBkPSJNMjUuMjY2LDQyLjkyNHYxLjMyNmwtNC43OTksNy4yMDVsLTAuMjczLDAuMjE5aDUuMDcyVjUzaC02LjY5OXYtMS4zMjZsNC43OTktNy4yMDVsMC4yODctMC4yMTkgICAgaC01LjA4NnYtMS4zMjZIMjUuMjY2eiIvPgoJCTxwYXRoIHN0eWxlPSJmaWxsOiNGRkZGRkY7IiBkPSJNMjkuMjcxLDUzaC0xLjY2OFY0Mi45MjRoMS42NjhWNTN6Ii8+CgkJPHBhdGggc3R5bGU9ImZpbGw6I0ZGRkZGRjsiIGQ9Ik0zMy40MTQsNTNoLTEuNjQxVjQyLjkyNGgyLjg5OGMwLjQyOCwwLDAuODUyLDAuMDY4LDEuMjcxLDAuMjA1ICAgIGMwLjQxOSwwLjEzNywwLjc5NSwwLjM0MiwxLjEyOCwwLjYxNWMwLjMzMywwLjI3MywwLjYwMiwwLjYwNCwwLjgwNywwLjk5MXMwLjMwOCwwLjgyMiwwLjMwOCwxLjMwNiAgICBjMCwwLjUxMS0wLjA4NywwLjk3My0wLjI2LDEuMzg4Yy0wLjE3MywwLjQxNS0wLjQxNSwwLjc2NC0wLjcyNSwxLjA0NmMtMC4zMSwwLjI4Mi0wLjY4NCwwLjUwMS0xLjEyMSwwLjY1NiAgICBzLTAuOTIxLDAuMjMyLTEuNDQ5LDAuMjMyaC0xLjIxN1Y1M3ogTTMzLjQxNCw0NC4xNjh2My45OTJoMS41MDRjMC4yLDAsMC4zOTgtMC4wMzQsMC41OTUtMC4xMDMgICAgYzAuMTk2LTAuMDY4LDAuMzc2LTAuMTgsMC41NC0wLjMzNXMwLjI5Ni0wLjM3MSwwLjM5Ni0wLjY0OWMwLjEtMC4yNzgsMC4xNS0wLjYyMiwwLjE1LTEuMDMyYzAtMC4xNjQtMC4wMjMtMC4zNTQtMC4wNjgtMC41NjcgICAgYy0wLjA0Ni0wLjIxNC0wLjEzOS0wLjQxOS0wLjI4LTAuNjE1Yy0wLjE0Mi0wLjE5Ni0wLjM0LTAuMzYtMC41OTUtMC40OTJjLTAuMjU1LTAuMTMyLTAuNTkzLTAuMTk4LTEuMDEyLTAuMTk4SDMzLjQxNHoiLz4KCTwvZz4KCTxnPgoJCTxwYXRoIHN0eWxlPSJmaWxsOiNDOEJEQjg7IiBkPSJNMjguNSwyNHYtMmgydi0yaC0ydi0yaDJ2LTJoLTJ2LTJoMnYtMmgtMnYtMmgyVjhoLTJWNmgtMnYyaC0ydjJoMnYyaC0ydjJoMnYyaC0ydjJoMnYyaC0ydjJoMnYyICAgIGgtNHY1YzAsMi43NTcsMi4yNDMsNSw1LDVzNS0yLjI0Myw1LTV2LTVIMjguNXogTTMwLjUsMjljMCwxLjY1NC0xLjM0NiwzLTMsM3MtMy0xLjM0Ni0zLTN2LTNoNlYyOXoiLz4KCQk8cGF0aCBzdHlsZT0iZmlsbDojQzhCREI4OyIgZD0iTTI2LjUsMzBoMmMwLjU1MiwwLDEtMC40NDcsMS0xcy0wLjQ0OC0xLTEtMWgtMmMtMC41NTIsMC0xLDAuNDQ3LTEsMVMyNS45NDgsMzAsMjYuNSwzMHoiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K';}

//Get now date and Datetime
function nowDate(dateortime , givendatetime = null) {
    if(givendatetime != null)
        var today = new Date(givendatetime);
    else
        var today = new Date();

    var month = today.getMonth()+1;
    if(month<10) month = "0"+month;
    var date = today.getDate();
    if(date<10) date = "0"+date;
    var hour = today.getHours();
    if(hour<10) hour = "0"+hour;
    var minut = today.getMinutes();
    if(minut<10) minut = "0"+minut;
    var second = today.getSeconds();
    if(second<10) second = "0"+second;

    if(dateortime == "date"){
        nowdateortime = today.getFullYear()+"-"+month+"-"+date;
        return nowdateortime;
    }
    if(dateortime == "datetime"){
        nowdateortime = today.getFullYear()+"-"+month+"-"+date+"T"+hour+":"+minut+":"+second;
        return nowdateortime;
    }

    if(dateortime == "time"){
        nowdateortime = hour+":"+minut+":"+second;
        return nowdateortime;
    }
}


//report print or table print
function printDiv(feildid , title){
    var newwindow=window.open();
    formattab = feildid.outerHTML;

    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='../plugin/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 150px; '> <h1>"+title+"</h1></div>" +
        "<div>"+ formattab+"</div>"+
        "</body>" +
        "</html>");
    setTimeout(function () {newwindow.print(); newwindow.close();},100) ;

}