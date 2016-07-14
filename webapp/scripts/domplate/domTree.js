/* See license.txt for terms of usage */

/**
 * @module domplate/domTree
 */
define("domplate/domTree", [
    "domplate/domplate",
    "core/lib",
    "core/trace"
],

function(Domplate, Lib, Trace) {

var domplate = Domplate.domplate;
var DIV = Domplate.DIV;
var FOR = Domplate.FOR;
var SPAN = Domplate.SPAN;
var TABLE = Domplate.TABLE;
var TAG = Domplate.TAG;
var TBODY = Domplate.TBODY;
var TD = Domplate.TD;
var TR = Domplate.TR;

// ********************************************************************************************* //

function DomTree(input)
{
    this.input = input;
    this.view = $.isXMLDoc(input) ? new XmlView(input) : new PlainObjectView(input);
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
                TAG("$member.tag", {object: "$member|getValue"})
            )
        ),

    loop:
        FOR("member", "$members",
            TAG("$member|getRowTag", {member: "$member"})),

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

    hasChildren: function(object)
    {
        return object.hasChildren ? "hasChildren" : "";
    },

    memberIterator: function(object)
    {
        return this.view.getMembers(object);
    },

    getValue: function(member)
    {
        return member.value;
    },

    getRowTag: function(member)
    {
        return this.rowTag;
    },

    onClick: function(event)
    {
        var e = Lib.fixEvent(event);
        if (!Lib.isLeftClick(e))
            return;

        var row = Lib.getAncestorByClass(e.target, "memberRow");
        var label = Lib.getAncestorByClass(e.target, "memberLabel");
        if (label && Lib.hasClass(row, "hasChildren"))
            this.toggleRow(row);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

    toggleRow: function(row, forceOpen)
    {
        if (!row)
            return;

        var level = parseInt(row.getAttribute("level"), 10);
        if (forceOpen && Lib.hasClass(row, "opened"))
            return;

        if (Lib.hasClass(row, "opened"))
        {
            Lib.removeClass(row, "opened");

            var tbody = row.parentNode;
            for (var firstRow = row.nextSibling; firstRow; firstRow = row.nextSibling)
            {
                if (parseInt(firstRow.getAttribute("level"), 10) <= level)
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
                if (!repObject.hasChildren)
                    return;

                var members = this.view.getMembers(repObject.value, level+1);
                if (members)
                    this.loop.insertRows({members: members}, row);
            }
        }
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Public

    append: function(parentNode)
    {
        this.element = this.tag.append({object: this.input}, parentNode, this);
        this.element.repObject = this;

        // Expand the first node (root) by default
        // Do not expand if the root is an array with more than one element.
        var value = Lib.isArray(this.input) && this.input.length > 2;
        var firstRow = this.element.firstChild.firstChild;
        if (firstRow && !value)
            this.toggleRow(firstRow);
    },

    expandRow: function(object)
    {
        var row = this.getRow(object);
        this.toggleRow(row, true);
        return row;
    },

    getRow: function(object)
    {
        // If not rendered yet, bail out.
        if (!this.element)
            return;

        // Iterate all existing rows and expand the one associated with specified object.
        // The repObject is a "member" object created in createMember method.
        var rows = Lib.getElementsByClass(this.element, "memberRow");
        for (var i=0; i<rows.length; i++)
        {
            var row = rows[i];
            if (row.repObject.value === object)
                return row;
        }

        return null;
    }
});

DomTree.createMember = function(type, name, value, hasChildren, level) {
    var valueTag = DomTree.Reps.getRep(value);

    return {
        name: name,
        value: value,
        type: type,
        rowClass: "memberRow-" + type,
        open: "",
        level: level,
        indent: level*16,
        hasChildren: hasChildren,
        tag: valueTag.tag
    };
};

// ********************************************************************************************* //
// Value Templates

var OBJECTBOX =
    DIV({"class": "objectBox objectBox-$className"});

// ********************************************************************************************* //

function hasProperties(ob) {
    if (typeof(ob) === "string")
        return false;

    try {
        // eslint-disable-next-line no-unused-vars
        for (var name in ob)
            return true;
    } catch (exc) {}
    return false;
}

// ********************************************************************************************* //

function PlainObjectView(input) {
    this.input = input;
}

PlainObjectView.prototype.getMembers = function(object, level) {
    if (!level)
        level = 0;

    var members = [];

    for (var p in object) {
        var propObj = object[p];
        if (typeof(propObj) !== "function"/* && typeof(propObj) != "number"*/)
            members.push(DomTree.createMember("dom", p, propObj, this.hasChildren(propObj), level));
    }

    return members;
};

PlainObjectView.prototype.hasChildren = function(value) {
    return hasProperties(value) && (typeof value === "object");
};

// ********************************************************************************************* //

function XmlView(input) {
    this.input = input;
}

XmlView.prototype.getMembers = function(object, level) {
    if (!level)
        level = 0;

    var attrs = XmlView.nodeAttributes(object).map(function(attr) {
        return DomTree.createMember("dom", "@" + attr.name, attr.value, false, level);
    });

    var elements = XmlView.nodeChildElements(object).map(function(element) {
        var hasChildren = this.hasChildren(element);
        return DomTree.createMember("dom", element.tagName, hasChildren ? element : element.firstChild.nodeValue, hasChildren, level);
    }, this);

    var members = attrs;

    // If there are no child elements, then we add the element's firstChild content (if it exists).
    // This firstChild content could be text.
    if (elements.length === 0 && object.firstChild) {
        members.push(DomTree.createMember("dom", "value", object.firstChild.nodeValue, false, level));
    }

    return members.concat(elements);
};

XmlView.prototype.hasChildren = function(value) {
    return XmlView.hasChildren(value);
};

XmlView.hasChildren = function(node) {
    var attrs = XmlView.nodeAttributes(node);
    var elements = XmlView.nodeChildElements(node);
    return (attrs.length > 0 || elements.length > 0);
    /*
    if (!hasChildren) {
        if ("string" !== typeof value) {
            value = value.nodeValue ? value.nodeValue : value.firstChild.nodeValue;
        }
    }
    */
};

XmlView.nodeChildElements = function(node, limit) {
    limit = ("number" === limit) ? limit : null;

    var elements = [];
    var child = node.firstChild;
    while (child) {
        if (Node.ELEMENT_NODE === child.nodeType) {
            elements.push(child);
            if (null !== limit && elements.length >= limit) {
                return elements;
            }
        }
        child = child.nextSibling;
    }
    return elements;
};

XmlView.nodeAttributes = function(node, limit) {
    limit = ("number" === limit) ? limit : null;

    var attrs = [];
    if (!node.attributes) {
        return attrs;
    }
    for (var i = node.attributes.length; --i >= 0; ) {
        attrs.push(node.attributes[i]);
        if (null !== limit && attrs.length >= limit) {
            return attrs;
        }
    }
    return attrs;
};

// ********************************************************************************************* //

DomTree.Reps =
{
    reps: [],

    registerRep: function()
    {
        this.reps.push.apply(this.reps, arguments);
    },

    getRep: function(object)
    {
        var type = typeof(object);
        if (type === "object" && object instanceof String)
            type = "string";

        for (var i=0; i<this.reps.length; ++i)
        {
            var rep = this.reps[i];
            try
            {
                if (rep.supportsObject(object, type))
                    return rep;
            }
            catch (exc)
            {
                Trace.exception("domTree.getRep; ", exc);
            }
        }

        return DomTree.Rep;
    }
};

// ********************************************************************************************* //

function safeToString(ob) {
    try
    {
        return ob.toString();
    }
    catch (exc)
    {
        return "";
    }
}

function objectAsStringOrType(object) {
    var label = safeToString(object);
    var re = /\[object (.*?)\]/;
    var m = re.exec(label);
    return m ? m[1] : label;
}

DomTree.Rep = domplate(
{
    tag:
        OBJECTBOX("$object|getTitle"),

    className: "object",

    getTitle: function(object)
    {
        return objectAsStringOrType(object);
    },

    getTooltip: function(object)
    {
        return null;
    },

    supportsObject: function(object, type)
    {
        return false;
    }
});

// ********************************************************************************************* //

DomTree.Reps.Null = domplate(DomTree.Rep,
{
    tag:
        OBJECTBOX("null"),

    className: "null",

    supportsObject: function(object, type)
    {
        return object === null;
    }
});

// ********************************************************************************************* //

DomTree.Reps.Number = domplate(DomTree.Rep,
{
    tag:
        OBJECTBOX("$object"),

    className: "number",

    supportsObject: function(object, type)
    {
        return type === "boolean" || type === "number";
    }
});

// ********************************************************************************************* //

DomTree.Reps.String = domplate(DomTree.Rep,
{
    tag:
        //OBJECTBOX("&quot;$object&quot;"),
        OBJECTBOX("$object"),

    className: "string",

    supportsObject: function(object, type)
    {
        return type === "string";
    }
});

// ********************************************************************************************* //

DomTree.Reps.Arr = domplate(DomTree.Rep,
{
    tag:
        OBJECTBOX("$object|getTitle"),

    className: "array",

    supportsObject: function(object, type)
    {
        return Lib.isArray(object);
    },

    getTitle: function(object)
    {
        return "Array [" + object.length + "]";
    }
});

// ********************************************************************************************* //

//xxxHonza: Domplate inheritance doesn't work. Modifications are propagated
// into the base object (see: http://code.google.com/p/fbug/issues/detail?id=4425)
var Tree = domplate(DomTree.prototype,
{
    createMember: function(type, name, value, level)
    {
        var member = DomTree.createMember(type, name, value, false, level);
        if (level === 0)
        {
            member.name = "";
            member.type = "tableCell";
        }
        return member;
    }
});

DomTree.Reps.Tree = domplate(DomTree.Rep,
{
    tag:
        OBJECTBOX(
            TAG("$object|getTag", {object: "$object|getRoot"})
        ),

    className: "tree",

    getTag: function(object)
    {
        return Tree.tag;
    },

    getRoot: function(object)
    {
        // Create fake root for embedded object-tree.
        return [object];
    },

    supportsObject: function(object, type)
    {
        return type === "object";
    }
});

// ********************************************************************************************* //

// Registration
DomTree.Reps.registerRep(
    DomTree.Reps.Null,
    DomTree.Reps.Number,
    DomTree.Reps.String,
    DomTree.Reps.Arr
);

// ********************************************************************************************* //

return DomTree;

// ********************************************************************************************* //
});
