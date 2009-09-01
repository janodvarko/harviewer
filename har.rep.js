/* See license.txt for terms of usage */

HAR.ns(function() { with (Domplate) {

//-----------------------------------------------------------------------------

/**
 * Basic object for templates.
 */
HAR.Rep = domplate(
{
    className: "",
    inspectable: true,

    supportsObject: function(object, type)
    {
        return false;
    },

    inspectObject: function(object, context)
    {
        context.chrome.select(object);
    },

    browseObject: function(object, context)
    {
    },

    persistObject: function(object, context)
    {
    },

    getRealObject: function(object, context)
    {
        return object;
    },

    getTitle: function(object)
    {
        var label = safeToString(object);

        var re = /\[object (.*?)\]/;
        var m = re.exec(label);
        return m ? m[1] : label;
    },

    getTooltip: function(object)
    {
        return null;
    },

    getContextMenuItems: function(object, target, context)
    {
        return [];
    },

    // Convenience for domplates
    STR: function(name)
    {
        return $STR(name);
    },

    cropString: function(text)
    {
        return cropString(text);
    },

    toLowerCase: function(text)
    {
        return text ? text.toLowerCase() : "";
    },

    plural: function(n)
    {
        return n == 1 ? "" : "s";
    }
});

var OBJECTLINK = 
    A({
        "class": "objectLink objectLink-$className",
        _repObject: "$object"
    });

var AttrTag =
    SPAN({"class": "nodeAttr editGroup"},
        "&nbsp;", SPAN({"class": "nodeName editable"}, "$attr.nodeName"), "=&quot;",
        SPAN({"class": "nodeValue editable"}, "$attr.nodeValue"), "&quot;"
    );

HAR.Rep.Nada = domplate(HAR.Rep,
{
    tag: SPAN(""),

    className: "nada"
});

HAR.Rep.Obj = domplate(HAR.Rep,
{
    tag:
        OBJECTLINK(
            SPAN({"class": "objectTitle"}, "$object|getTitle")/*,
            FOR("prop", "$object|propIterator",
                " $prop.name=",
                SPAN({"class": "objectPropValue"}, "$prop.value|cropString")
            )*/
        ),

    propIterator: function (object)
    {
        if (!object)
            return [];

        var props = [];
        var len = 0;

        try
        {
            for (var name in object)
            {
                var val;
                try
                {
                    val = object[name];
                }
                catch (exc)
                {
                    continue;
                }

                var t = typeof(val);
                if (t == "boolean" || t == "number" || (t == "string" && val)
                    || (t == "object" && val && val.toString))
                {
                    var title = (t == "object") ? Obj.getTitle(val) : val+"";

                    len += name.length + title.length + 1;
                    if (len < 50)
                        props.push({name: name, value: title});
                    else
                        break;
                }
            }
        }
        catch (exc)
        {
            // Sometimes we get exceptions when trying to read from certain objects, like
            // StorageList, but don't let that gum up the works
            // XXXjjb also History.previous fails because object is a web-page object which does not have
            // permission to read the history
        }

        return props;
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

    className: "object",

    supportsObject: function(object, type)
    {
        return true;
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

//-----------------------------------------------------------------------------
}});
