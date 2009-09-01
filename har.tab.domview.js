/* See license.txt for terms of usage */

HAR.ns(function() { with (Domplate) { with (HAR.Lib) {

//-----------------------------------------------------------------------------

/**
 * DomView tab implementation. This object is intended to display JSON data as
 * an expandable tree.  
 */
HAR.Tab.DomView = domplate(
{
    render: function(inputData, parentNode)
    {
        HAR.log("har; Render DOM tab.");

        var table = this.tag.replace({object: inputData}, parentNode);
        if (table.firstChild.firstChild)
            this.toggleRow(table.firstChild.firstChild);
    },

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
                DIV({"class": "memberLabel $member.type\\Label"}, "$member.name")
            ),
            TD({"class": "memberValueCell"},
                TAG("$member.tag", {object: "$member.value"})
            )
        ),

    loop:
        FOR("member", "$members", 
            TAG("$member|getRowTag", {member: "$member"})),

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

    onClick: function(event)
    {
        var e = HAR.eventFix(event || window.event);
        if (!isLeftClick(event))
            return;

        var row = getAncestorByClass(e.target, "memberRow");
        var label = getAncestorByClass(e.target, "memberLabel");
        if (label && hasClass(row, "hasChildren"))
            this.toggleRow(row);
    },

    toggleRow: function(row)
    {
        var level = parseInt(row.getAttribute("level"));

        if (hasClass(row, "opened"))
        {
            removeClass(row, "opened");

            var tbody = row.parentNode;
            for (var firstRow = row.nextSibling; firstRow; firstRow = row.nextSibling) {
                if (parseInt(firstRow.getAttribute("level")) <= level)
                    break;

                tbody.removeChild(firstRow);
            }
        }
        else
        {
            setClass(row, "opened");

            var repObject = row.repObject;
            if (repObject) {
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
        for (var p in object) {
            var propObj = object[p];
            if (typeof(propObj) != "function"/* && typeof(propObj) != "number"*/)
            {
                members.push(this.createMember("dom", p, propObj, level));
            }
        }

        return members;
    },

    createMember: function(type, name, value, level)
    {
        var rep = HAR.Rep.Obj;
        var tag = rep.shortTag ? rep.shortTag : rep.tag;
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
            tag: tag
        };
    },

    hasProperties: function(ob)
    {
        try {
            for (var name in ob)
                return true;
        } catch (exc) {}
        return false;
    }
});

//-----------------------------------------------------------------------------
}}});
