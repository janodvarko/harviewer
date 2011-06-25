/* See license.txt for terms of usage */

require.def("domplate/domTree", [
    "domplate/domplate",
    "core/lib"
],

function(Domplate, Lib) { with (Domplate) {

//*************************************************************************************************

function DomTree(input)
{
    this.input = input;
}

/**
 * @domplate Represents a tree of properties/objects
 */
DomTree.prototype = domplate(
{
    tag:
        TABLE({"class": "domTable", cellpadding: 0, cellspacing: 0, onclick: "$onClick"},
            TBODY(
                FOR("member", "$object|memberIterator", 
                    TAG("$member|getRowTag", {member: "$member"}))
            )
        ),

    rowTag:
        TR({"class": "memberRow $member.open $member.type\\Row $member|hasChildren", 
            $hasChildren: "$member|hasChildren",
            _repObject: "$member", level: "$member.level"},
            TD({"class": "memberLabelCell", style: "padding-left: $member.indent\\px"},
                SPAN({"class": "memberLabel $member.type\\Label"}, "$member.name")
            ),
            TD({"class": "memberValueCell"},
                TAG("$member.tag", {object: "$member.value"})
            )
        ),

    valueTag:
        SPAN({"class": "objectTitle"}, "$object|getTitle"),

    loop:
        FOR("member", "$members", 
            TAG("$member|getRowTag", {member: "$member"})),

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

    hasChildren: function(object)
    {
        return object.hasChildren ? "hasChildren" : "";
    },

    memberIterator: function(object)
    {
        return this.getMembers(object);
    },

    getRowTag: function(member)
    {
        return this.rowTag;
    },

    getTitle: function(object)
    {
        if (jQuery.isArray(object))
            return "Array";

        var label = safeToString(object);

        var re = /\[object (.*?)\]/;
        var m = re.exec(label);
        return m ? m[1] : label;
    },

    onClick: function(event)
    {
        var e = $.event.fix(event || window.event);
        if (!Lib.isLeftClick(e))
            return;

        var row = Lib.getAncestorByClass(e.target, "memberRow");
        var label = Lib.getAncestorByClass(e.target, "memberLabel");
        if (label && Lib.hasClass(row, "hasChildren"))
            this.toggleRow(row);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

    toggleRow: function(row, forceOpen)
    {
        var level = parseInt(row.getAttribute("level"));

        if (forceOpen && Lib.hasClass(row, "opened"))
            return;

        if (Lib.hasClass(row, "opened"))
        {
            Lib.removeClass(row, "opened");

            var tbody = row.parentNode;
            for (var firstRow = row.nextSibling; firstRow; firstRow = row.nextSibling)
            {
                if (parseInt(firstRow.getAttribute("level")) <= level)
                    break;
                tbody.removeChild(firstRow);
            }
        }
        else
        {
            Lib.setClass(row, "opened");

            var repObject = row.repObject;
            if (repObject)
            {
                var members = this.getMembers(repObject.value, level+1);
                if (members)
                    this.loop.insertRows({members: members}, row);
            }
        }
    },

    getMembers: function(object, level)
    {
        if (!level)
            level = 0;

        var members = [];
        for (var p in object)
        {
            var propObj = object[p];
            if (typeof(propObj) != "function"/* && typeof(propObj) != "number"*/)
                members.push(this.createMember("dom", p, propObj, level));
        }

        return members;
    },

    createMember: function(type, name, value, level)
    {
        var valueType = typeof(value);
        var hasChildren = this.hasProperties(value) && (valueType == "object");

        return {
            name: name,
            value: value,
            type: type,
            rowClass: "memberRow-" + type,
            open: "",
            level: level,
            indent: level*16,
            hasChildren: hasChildren,
            tag: this.valueTag
        };
    },

    hasProperties: function(ob)
    {
        try {
            for (var name in ob)
                return true;
        } catch (exc) {}
        return false;
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Public

    append: function(parentNode)
    {
        this.element = this.tag.append({object: this.input}, parentNode);
        this.element.repObject = this;

        // Expand the first node (root) by default.
        if (this.element.firstChild.firstChild)
            this.toggleRow(this.element.firstChild.firstChild);
    },

    expandRow: function(object)
    {
        // If not rendered yet, bail out.
        if (!this.element)
            return;

        // Iterate all existing rows and expand the one associated with specified object.
        // The repObject is a "member" object created in createMember method.
        var rows = this.element.querySelectorAll(".memberRow");
        for (var i=0; i<rows.length; i++)
        {
            var row = rows[i];
            if (row.repObject.value == object)
            {
                this.toggleRow(row, true);
                return row;
            }
        }

        return null;
    }
});

function safeToString(ob)
{
    try
    {
        return ob.toString();
    }
    catch (exc)
    {
        return "";
    }
}

// ************************************************************************************************

return DomTree;

// ************************************************************************************************
}});
