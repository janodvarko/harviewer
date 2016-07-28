/* See license.txt for terms of usage */

/**
 * @module domplate/popupMenu
 */
define("domplate/popupMenu", [
    "domplate/domplate",
    "core/lib",
    "core/trace"
],

function(Domplate, Lib, Trace) {

var domplate = Domplate.domplate;
var A = Domplate.A;
var DIV = Domplate.DIV;
var FOR = Domplate.FOR;
var SPAN = Domplate.SPAN;
var TAG = Domplate.TAG;

// ************************************************************************************************
// Controller

var Controller =
{
    controllers: [],
    controllerContext: {label: "controller context"},

    initialize: function(context)
    {
        this.controllers = [];
        this.controllerContext = context || this.controllerContext;
    },

    shutdown: function()
    {
        this.removeControllers();
    },

    addController: function()
    {
        for (var i=0, arg; arg=arguments[i]; i++)
        {
            // (typeof arg[0]) is never "string" for HAR Viewer.

            // bind the handler to the proper context
            var handler = arg[2];
            arg[2] = Lib.bind(handler, this);
            // save the original handler as an extra-argument, so we can
            // look for it later, when removing a particular controller
            arg[3] = handler;

            this.controllers.push(arg);
            Lib.addEventListener.apply(this, arg);
        }
    },

    removeController: function()
    {
        for (var i=0, arg; arg=arguments[i]; i++)
        {
            for (var j=0, c; c=this.controllers[j]; j++)
            {
                if (arg[0] === c[0] && arg[1] === c[1] && arg[2] === c[3])
                    Lib.removeEventListener.apply(this, c);
            }
        }
    },

    removeControllers: function()
    {
        for (var i=0, c; c=this.controllers[i]; i++)
        {
            Lib.removeEventListener.apply(this, c);
        }
    }
};

//***********************************************************************************************//
// Menu

var menuItemProps = {
    "class": "$item.className",
    type: "$item.type",
    value: "$item.value",
    _command: "$item.command"
};

if (Lib.isIE6)
    menuItemProps.href = "javascript:void(0)";

var MenuPlate = domplate(
{
    tag:
        DIV({"class": "popupMenu popupMenuShadow"},
            DIV({"class": "popupMenuContent popupMenuShadowContent"},
                FOR("item", "$object.items|memberIterator",
                    TAG("$item.tag", {item: "$item"})
                )
            )
        ),

    itemTag:
        A(menuItemProps,
            "$item.label"
        ),

    checkBoxTag:
        A(Lib.extend(menuItemProps, {checked : "$item.checked"}),
            "$item.label"
        ),

    radioButtonTag:
        A(Lib.extend(menuItemProps, {selected : "$item.selected"}),
            "$item.label"
        ),

    groupTag:
        A(Lib.extend(menuItemProps, {child: "$item.child"}),
            "$item.label"
        ),

    shortcutTag:
        A(menuItemProps,
            "$item.label",
            SPAN({"class": "popupMenuShortcutKey"},
                "$item.key"
            )
        ),

    separatorTag:
        SPAN({"class": "popupMenuSeparator"}),

    memberIterator: function(items)
    {
        var result = [];
        for (var i=0, length=items.length; i<length; i++)
        {
            var item = items[i];

            // separator representation
            if (typeof item === "string" && item.indexOf("-") === 0)
            {
                result.push({tag: this.separatorTag});
                continue;
            }

            item = Lib.extend(item, {});
            item.type = item.type || "";
            item.value = item.value || "";

            var type = item.type;

            // default item representation
            item.tag = this.itemTag;

            var className = item.className || "";
            className += "popupMenuOption ";

            // specific representations
            if (type === "checkbox")
            {
                className += "popupMenuCheckBox ";
                item.tag = this.checkBoxTag;
            }
            else if (type === "radio")
            {
                className += "popupMenuRadioButton ";
                item.tag = this.radioButtonTag;
            }
            else if (type === "group")
            {
                className += "popupMenuGroup ";
                item.tag = this.groupTag;
            }
            else if (type === "shortcut")
            {
                className += "popupMenuShortcut ";
                item.tag = this.shortcutTag;
            }

            if (item.checked)
                className += "popupMenuChecked ";
            else if (item.selected)
                className += "popupMenuRadioSelected ";

            if (item.disabled)
                className += "popupMenuDisabled ";

            item.className = className;
            item.label = item.label;
            result.push(item);
        }

        return result;
    }
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

function Menu(options)
{
    // if element is not pre-rendered, we must render it now
    if (!options.element)
    {
        if (options.getItems)
            options.items = options.getItems();

        // Trim separators
        if (options.items[0] === "-")
            options.items.shift();
        if (options.items[options.items.length - 1] === "-")
            options.items.pop();

        var body = Lib.getBody(document);
        options.element = MenuPlate.tag.append({object: options}, body, MenuPlate);
    }

    // extend itself with the provided options
    Lib.append(this, options);

    if (typeof this.element === "string")
    {
        this.id = this.element;
        this.element = $(this.id);
    }
    else if (this.id)
    {
        this.element.id = this.id;
    }

    this.elementStyle = this.element.style;
    this.isVisible = false;

    this.handleMouseDown = Lib.bind(this.handleMouseDown, this);
    this.handleMouseOver = Lib.bind(this.handleMouseOver, this);
    this.handleMouseOut = Lib.bind(this.handleMouseOut, this);
    this.handleWindowMouseDown = Lib.bind(this.handleWindowMouseDown, this);
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

var menuMap = {};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

Menu.prototype = Lib.extend(Controller,
{
    initialize: function()
    {
        Controller.initialize.call(this);

        this.addController(
            [this.element, "mousedown", this.handleMouseDown],
            [this.element, "mouseover", this.handleMouseOver]
        );
    },

    destroy: function()
    {
        this.hide();

        // if it is a childMenu, remove its reference from the parentMenu
        if (this.parentMenu)
            this.parentMenu.childMenu = null;

        // remove the element from the document
        this.element.parentNode.removeChild(this.element);

        // clear references
        this.element = null;
        this.elementStyle = null;
        this.parentMenu = null;
        this.parentTarget = null;
    },

    shutdown: function()
    {
        Controller.shutdown.call(this);
    },

    showPopup: function(target)
    {
        var offsetLeft = Lib.isIE6 ? 1 : -4;  // IE6 problem with fixed position
        var box = Lib.getElementBox(target);
        var offset = {top: 0, left: 0};

        this.show(
            box.left + offsetLeft - offset.left,
            box.top + box.height - 5 - offset.top
        );
    },

    show: function(x, y)
    {
        this.initialize();

        if (this.isVisible)
            return;

        x = x || 0;
        y = y || 0;

        if (this.parentMenu)
        {
            var oldChildMenu = this.parentMenu.childMenu;
            if (oldChildMenu && oldChildMenu !== this)
            {
                oldChildMenu.destroy();
            }

            this.parentMenu.childMenu = this;
        }
        else
        {
            Lib.addEventListener(document, "mousedown", this.handleWindowMouseDown);
        }

        this.elementStyle.display = "block";
        this.elementStyle.visibility = "hidden";

        var size = Lib.getWindowSize();

        x = Math.min(x, size.width - this.element.clientWidth - 10);
        x = Math.max(x, 0);

        y = Math.min(y, size.height - this.element.clientHeight - 10);
        y = Math.max(y, 0);

        this.elementStyle.left = x + "px";
        this.elementStyle.top = y + "px";
        this.elementStyle.visibility = "visible";
        this.isVisible = true;

        if (Lib.isFunction(this.onShow))
            this.onShow.apply(this, arguments);
    },

    hide: function()
    {
        this.clearHideTimeout();
        this.clearShowChildTimeout();

        if (!this.isVisible)
            return;

        this.elementStyle.display = "none";

        if (this.childMenu)
        {
            this.childMenu.destroy();
            this.childMenu = null;
        }

        if (this.parentTarget)
            Lib.removeClass(this.parentTarget, "popupMenuGroupSelected");

        this.isVisible = false;
        this.shutdown();

        if (Lib.isFunction(this.onHide))
            this.onHide.apply(this, arguments);
    },

    showChildMenu: function(target)
    {
        var id = target.getAttribute("child");
        var parent = this;

        this.showChildTimeout = window.setTimeout(function()
        {
            //if (!parent.isVisible) return;
            var box = Lib.getElementBox(target);
            var childMenuObject = menuMap.hasOwnProperty(id) ? menuMap[id] : {element: $(id)};

            var childMenu = new Menu(Lib.extend(childMenuObject,
            {
                parentMenu: parent,
                parentTarget: target
            }));

            var offsetLeft = Lib.isIE6 ? -1 : -6; // IE6 problem with fixed position
            childMenu.show(box.left + box.width + offsetLeft, box.top -6);
            Lib.setClass(target, "popupMenuGroupSelected");
        },350);
    },

    clearHideTimeout: function()
    {
        if (this.hideTimeout)
        {
            window.clearTimeout(this.hideTimeout);
            delete this.hideTimeout;
        }
    },

    clearShowChildTimeout: function()
    {
        if(this.showChildTimeout)
        {
            window.clearTimeout(this.showChildTimeout);
            this.showChildTimeout = null;
        }
    },

    handleMouseDown: function(event)
    {
        Lib.cancelEvent(event, true);

        var topParent = this;
        while (topParent.parentMenu)
            topParent = topParent.parentMenu;

        var target = event.target || event.srcElement;

        target = Lib.getAncestorByClass(target, "popupMenuOption");

        if(!target || Lib.hasClass(target, "popupMenuGroup"))
            return false;

        if (target && !Lib.hasClass(target, "popupMenuDisabled"))
        {
            var type = target.getAttribute("type");

            if (type === "checkbox")
            {
                var value = target.getAttribute("value");
                var wasChecked = Lib.hasClass(target, "popupMenuChecked");

                if (wasChecked)
                {
                    Lib.removeClass(target, "popupMenuChecked");
                    target.setAttribute("checked", "");
                }
                else
                {
                    Lib.setClass(target, "popupMenuChecked");
                    target.setAttribute("checked", "true");
                }

                if (Lib.isFunction(this.onCheck))
                    this.onCheck.call(this, target, value, !wasChecked);
            }

            if (type === "radiobutton")
            {
                var selectedRadios = Lib.getElementsByClass(target.parentNode, "popupMenuRadioSelected");
                var group = target.getAttribute("group");

                for (var i = 0, length = selectedRadios.length; i < length; i++)
                {
                    var radio = selectedRadios[i];

                    if (radio.getAttribute("group") === group)
                    {
                        Lib.removeClass(radio, "popupMenuRadioSelected");
                        radio.setAttribute("selected", "");
                    }
                }

                Lib.setClass(target, "popupMenuRadioSelected");
                target.setAttribute("selected", "true");
            }

            var handler = null;

            // target.command can be a function or a string.
            var cmd = target.command;

            // If it is a function it will be used as the handler
            // If it is a string, tha handler is the property of the current menu object
            // will be used as the handler
            if (Lib.isFunction(cmd))
                handler = cmd;
            else if (typeof cmd === "string")
                handler = this[cmd];

            var closeMenu = true;
            if (handler)
                closeMenu = handler.call(this, target) !== false;

            if (closeMenu)
                topParent.hide();
        }

        return false;
    },

    handleWindowMouseDown: function(event)
    {
        var target = event.target || event.srcElement;
        target = Lib.getAncestorByClass(target, "popupMenu");
        if (!target)
        {
            Lib.removeEventListener(document, "mousedown", this.handleWindowMouseDown);
            this.destroy();
        }
    },

    handleMouseOver: function(event)
    {
        this.clearHideTimeout();
        this.clearShowChildTimeout();

        var target = event.target || event.srcElement;

        target = Lib.getAncestorByClass(target, "popupMenuOption");

        if (!target)
            return;

        var childMenu = this.childMenu;
        if (childMenu)
        {
            Lib.removeClass(childMenu.parentTarget, "popupMenuGroupSelected");

            if (childMenu.parentTarget !== target && childMenu.isVisible)
            {
                childMenu.clearHideTimeout();
                childMenu.hideTimeout = window.setTimeout(function(){
                    childMenu.destroy();
                },300);
            }
        }

        if (Lib.hasClass(target, "popupMenuGroup"))
        {
            this.showChildMenu(target);
        }
    }
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

Lib.append(Menu,
{
    register: function(object)
    {
        menuMap[object.id] = object;
    },

    check: function(element)
    {
        Lib.setClass(element, "popupMenuChecked");
        element.setAttribute("checked", "true");
    },

    uncheck: function(element)
    {
        Lib.removeClass(element, "popupMenuChecked");
        element.setAttribute("checked", "");
    },

    disable: function(element)
    {
        Lib.setClass(element, "popupMenuDisabled");
    },

    enable: function(element)
    {
        Lib.removeClass(element, "popupMenuDisabled");
    }
});

// **********************************************************************************************//

return Menu;

// **********************************************************************************************//
});
