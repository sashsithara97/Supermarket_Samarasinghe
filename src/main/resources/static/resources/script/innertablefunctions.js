
//#################################################################################//
// Table - Inner Form
//#################################################################################//
function tableForInnerForm(parentId, id, metadata, hasBtn = true) {
    var parent = document.getElementById(parentId);
    var table = createElement('table', id);
    table.classList.add('table');
    table.classList.add('table-hover');
    table.classList.add('table-striped');
    table.classList.add('table-sm');
    table.classList.add('text-center');
    table.classList.add('mb-3');
    var thead = createElement('thead');
    thead.classList.add('bg-secondary');
    thead.classList.add('text-white');
    var tbody = createElement('tbody');
    var row1 = createElement('tr');

    var th = createElement('th');
    th.innerHTML = "Index";
    row1.appendChild(th);

    for (var i = 1; i <= metadata.length; i++) {
        var th = createElement('th');
        th.setAttribute('datatype', metadata[i - 1]['datatype']);
        if (typeof metadata[i - 1]['property'] == 'function') {
            th.setAttribute('property', metadata[i - 1]['property'].name);
            th.setAttribute('propertytype', 'function');
        } else {
            th.setAttribute('property', metadata[i - 1]['property']);
            th.setAttribute('propertytype', 'attribute');
        }
        th.innerHTML = metadata[i - 1]['name'];
        row1.appendChild(th);
    }

    if (hasBtn) {
        var th = createElement('th');
        row1.appendChild(th);
        table.setAttribute('hasButton', '1');
    } else {
        table.setAttribute('hasButton', '0');
    }
    thead.appendChild(row1);
    table.appendChild(thead);
    table.appendChild(tbody);
    parent.appendChild(table);
}

//#################################################################################//
// Fill Data To Table - Inner Form
//#################################################################################//
function fillInnerTable(tableId, obs, modifyFunction = null, deleteFunction = null, editbuttonvis = true ) {
    var table = document.getElementById(tableId);
    var hasButton = table.getAttribute('hasButton') == '1';
    var thead = table.children[0];
    var tbody = table.children[1];
    tbody.innerHTML = '';
    var headingCells = thead.children[0].children;
    var searchCells = thead.children[0].children;
    for (var i = 1; i < searchCells.length; i++) {
        var searchCell = searchCells[i];
        if (searchCell.children.length != 0) {
            searchCell.children[0].value = '';
        }
    }

    for (var i = 0; i < obs.length; i++) {
        var ob = obs[i];
        var row = createElement("tr");
        var td = createElement("td");
        td.innerHTML = (i + 1);
        row.appendChild(td);
        if (hasButton) {
            var e = headingCells.length - 1;
        } else {
            var e = headingCells.length;
        }

        for (j = 1; j < e; j++) {
            var td = createElement("td");
            var headingCell = headingCells[j];
            var type = headingCell.getAttribute('datatype');
            var property = headingCell.getAttribute('property');
            var propertytype = headingCell.getAttribute('propertytype');

            if (propertytype == 'attribute') {
                var get = function (model, path) {
                    var parts = path.split('.');
                    if (parts.length > 1 && typeof model[parts[0]] === 'object') {
                        return get(model[parts[0]], parts.splice(1).join('.'));
                    } else {
                        return model[parts[0]];
                    }
                }
                var data = get(ob, property);
            } else {
                var data = window[property](ob);
            }

            if (type == 'text') {
                if (data == null) {
                    data = '-';
                }
                td.innerHTML = data;
            }
            if (type == 'amount') {
                if (data == null) {
                    data = '-';
                }
                td.innerHTML = parseFloat(data).toFixed(2);
            }
            row.appendChild(td);
        }

        if (hasButton) {
            var td = createElement("td");

            // Inner Table Update Button
            var buttonInnerUpdate = createElement('button');
            buttonInnerUpdate.setAttribute('type', 'button');
            buttonInnerUpdate.classList.add('btn');
            buttonInnerUpdate.classList.add('btn-sm');
            buttonInnerUpdate.classList.add('btn-outline-warning');
            buttonInnerUpdate.innerHTML = '<i class="fa fa-edit"></i> ';
            buttonInnerUpdate.onclick = function () {
                idx = window.parseInt(this.parentNode.parentNode.firstChild.innerHTML);
                modifyFunction(obs[idx - 1], idx-1);
            };

            // Inner Table Delete Button
            var buttonInnerDelete = createElement('button');
            buttonInnerDelete.setAttribute('type', 'button');
            buttonInnerDelete.classList.add('btn');
            buttonInnerDelete.classList.add('ml-1');
            buttonInnerDelete.classList.add('btn-sm');
            buttonInnerDelete.classList.add('btn-outline-danger');
            buttonInnerDelete.innerHTML = '<i class="fa fa-trash-alt"></i> ';
            buttonInnerDelete.onclick = function () {
                idx = window.parseInt(this.parentNode.parentNode.firstChild.innerHTML);
                deleteFunction(obs[idx - 1], idx-1);
            };
            if(editbuttonvis)
                td.appendChild(buttonInnerUpdate);

            td.appendChild(buttonInnerDelete);
            row.appendChild(td);
        }
        tbody.appendChild(row);
    }
}
