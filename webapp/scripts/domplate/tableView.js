/* See license.txt for terms of usage */

/**
 * @module domplate/tableView
 */
define("domplate/tableView", [
    "domplate/domplate",
    "core/lib",
    "i18n!nls/tableView",
    "domplate/domTree", //xxxHonza: hack, registered reps should be a separate module
    "core/trace"
],

function(Domplate, Lib, Strings, DomTree, Trace) {

var domplate = Domplate.domplate;
var DIV = Domplate.DIV;
var FOR = Domplate.FOR;
var TABLE = Domplate.TABLE;
var TAG = Domplate.TAG;
var TBODY = Domplate.TBODY;
var TD = Domplate.TD;
var TH = Domplate.TH;
var THEAD = Domplate.THEAD;
var TR = Domplate.TR;

// ********************************************************************************************* //

var TableView = domplate(
{
    className: "table",

    tag:
        DIV({"class": "dataTableSizer", "tabindex": "-1" },
            TABLE({"class": "dataTable", cellspacing: 0, cellpadding: 0, width: "100%",
                "role": "grid"},
                THEAD({"class": "dataTableThead", "role": "presentation"},
                    TR({"class": "headerRow focusRow dataTableRow subFocusRow", "role": "row",
                        onclick: "$onClickHeader"},
                        FOR("column", "$object.columns",
                            TH({"class": "headerCell a11yFocus", "role": "columnheader",
                                $alphaValue: "$column.alphaValue"},
                                DIV({"class": "headerCellBox"},
                                    "$column.label"
                                )
                            )
                        )
                    )
                ),
                TBODY({"class": "dataTableTbody", "role": "presentation"},
                    FOR("row", "$object.data|getRows",
                        TR({"class": "focusRow dataTableRow subFocusRow", "role": "row"},
                            FOR("column", "$row|getColumns",
                                TD({"class": "a11yFocus dataTableCell", "role": "gridcell"},
                                    TAG("$column|getValueTag", {object: "$column"})
                                )
                            )
                        )
                    )
                )
            )
        ),

    getValueTag: function(object)
    {
        var type = typeof(object);

        // Display embedded tree for object in table-cells
        if (type === "object")
            return DomTree.Reps.Tree.tag;

        var rep = DomTree.Reps.getRep(object);
        return rep.shortTag || rep.tag;
    },

    getRows: function(data)
    {
        var props = this.getProps(data);
        if (!props.length)
            return [];
        return props;
    },

    getColumns: function(row)
    {
        if (typeof(row) !== "object")
            return [row];

        var cols = [];
        for (var i=0; i<this.columns.length; i++)
        {
            var prop = this.columns[i].property;
            var value;

            if (!prop)
            {
                value = row;
            }
            else if (typeof row[prop] === "undefined")
            {
                var props = (typeof(prop) === "string") ? prop.split(".") : [prop];

                value = row;
                for (var p in props)
                    value = (value && value[props[p]]) || undefined;
            }
            else
            {
                value = row[prop];
            }

            cols.push(value);
        }
        return cols;
    },

    getProps: function(obj)
    {
        if (typeof(obj) !== "object")
            return [obj];

        if (obj.length)
            return Lib.cloneArray(obj);

        var arr = [];
        for (var p in obj)
        {
            var value = obj[p];
            if (this.domFilter(value, p))
                arr.push(value);
        }
        return arr;
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Sorting

    onClickHeader: function(event)
    {
        var table = Lib.getAncestorByClass(event.target, "dataTable");
        var header = Lib.getAncestorByClass(event.target, "headerCell");
        if (!header)
            return;

        var numerical = !Lib.hasClass(header, "alphaValue");

        var colIndex = 0;
        for (header = header.previousSibling; header; header = header.previousSibling)
            ++colIndex;

        this.sort(table, colIndex, numerical);
    },

    sort: function(table, colIndex, numerical)
    {
        var tbody = Lib.getChildByClass(table, "dataTableTbody");
        var thead = Lib.getChildByClass(table, "dataTableThead");

        var values = [];
        for (var row = tbody.childNodes[0]; row; row = row.nextSibling)
        {
            var cell = row.childNodes[colIndex];
            var value = numerical ? parseFloat(cell.textContent) : cell.textContent;
            values.push({row: row, value: value});
        }

        values.sort(function(a, b) {
            return a.value < b.value ? -1 : 1;
        });

        var headerRow = thead.firstChild;
        var headerSorted = Lib.getChildByClass(headerRow, "headerSorted");
        Lib.removeClass(headerSorted, "headerSorted");
        if (headerSorted)
            headerSorted.removeAttribute('aria-sort');

        var header = headerRow.childNodes[colIndex];
        Lib.setClass(header, "headerSorted");

        if (!header.sorted || header.sorted === 1)
        {
            Lib.removeClass(header, "sortedDescending");
            Lib.setClass(header, "sortedAscending");
            header.setAttribute("aria-sort", "ascending");

            header.sorted = -1;

            for (var i = 0; i < values.length; ++i)
                tbody.appendChild(values[i].row);
        }
        else
        {
            Lib.removeClass(header, "sortedAscending");
            Lib.setClass(header, "sortedDescending");
            header.setAttribute("aria-sort", "descending");

            header.sorted = 1;

            for (var j = values.length-1; j >= 0; --j)
                tbody.appendChild(values[j].row);
        }
    },

    /**
     * Analyse data and return dynamically created list of columns.
     * @param {Object} data
     */
    getHeaderColumns: function(data)
    {
        // Get the first row in the object.
        var firstRow;
        for (var k in data)
        {
            firstRow = data[k];
            break;
        }

        if (typeof(firstRow) !== "object")
            return [{label: Strings.objectProperties}];

        // Put together a column property, label and type (type for default sorting logic).
        var header = [];
        for (var p in firstRow)
        {
            var value = firstRow[p];
            if (!this.domFilter(value, p))
                continue;

            header.push({
                property: p,
                label: p,
                alphaValue: (typeof(value) !== "number")
            });
        }

        return header;
    },

    /**
     * Filtering based on options set in the DOM panel.
     * @param {Object} value - a property value under inspection.
     * @param {String} name - name of the property.
     * @returns true if the value should be displayed, otherwise false.
     */
    domFilter: function(object, name)
    {
        return true;
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Public

    render: function(parentNode, data, cols)
    {
        // No arguments passed into console.table method, bail out for now,
        // but some error message could be displayed in the future.
        if (!data)
            return;

        // Get header info from passed argument (can be null).
        var columns = [];
        for (var i=0; cols && i<cols.length; i++)
        {
            var col = cols[i];
            var prop = (typeof(col.property) !== "undefined") ? col.property : col;
            var label = (typeof(col.label) !== "undefined") ? col.label : prop;

            columns.push({
                property: prop,
                label: label,
                alphaValue: true
            });
        }

        // Generate header info from the data dynamically.
        if (!columns.length)
            columns = this.getHeaderColumns(data);

        try
        {
            this.columns = columns;
            var object = {data: data, columns: columns};
            var element = this.tag.append({object: object, columns: columns}, parentNode);

            // Set vertical height for scroll bar.
            var tBody = Lib.getElementByClass(element, "dataTableTbody");
            var maxHeight = 200; // xxxHonza: a pref?
            if (maxHeight > 0 && tBody.clientHeight > maxHeight)
                tBody.style.height = maxHeight + "px";
        }
        catch (err)
        {
            Trace.exception("tableView.render; EXCEPTION " + err, err);
        }
        finally
        {
            delete this.columns;
        }
    }
});

// ********************************************************************************************* //

return TableView;

// ********************************************************************************************* //
});
