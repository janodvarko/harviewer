/* See license.txt for terms of usage */

require.def("domplate/domplate", [
    "jquery/jquery"
], function($) {

//*************************************************************************************************

Domplate = {};

(function(){

function DomplateTag(tagName)
{
    this.tagName = tagName;
}

this.DomplateTag = DomplateTag;

function DomplateEmbed()
{
}

function DomplateLoop()
{
}

var womb = null;

var domplate = function()
{
    var lastSubject;
    for (var i = 0; i < arguments.length; ++i)
        lastSubject = lastSubject ? copyObject(lastSubject, arguments[i]) : arguments[i];

    for (var name in lastSubject)
    {
        var val = lastSubject[name];
        if (isTag(val))
        {
            if (val.tag.subject)
            {
                lastSubject[name] = val = copyObject({}, val);
                val.tag = copyObject({}, val.tag);
            }
            val.tag.subject = lastSubject;
        }
    }

    return lastSubject;
};

domplate.context = function(context, fn)
{
    var lastContext = domplate.lastContext;
    domplate.topContext = context;
    fn.apply(context);
    domplate.topContext = lastContext;
};

this.domplate = domplate;
this.create = domplate;


this.TAG = function()
{
    var embed = new DomplateEmbed();
    return embed.merge(arguments);
};

this.FOR = function()
{
    var loop = new DomplateLoop();
    return loop.merge(arguments);
};

DomplateTag.prototype =
{
    merge: function(args, oldTag)
    {
        if (oldTag)
            this.tagName = oldTag.tagName;

        this.context = oldTag ? oldTag.context : null;
        this.subject = oldTag ? oldTag.subject : null;
        this.attrs = oldTag ? copyObject(oldTag.attrs) : {};
        this.classes = oldTag ? copyObject(oldTag.classes) : {};
        this.props = oldTag ? copyObject(oldTag.props) : null;
        this.listeners = oldTag ? copyArray(oldTag.listeners) : null;
        this.children = oldTag ? copyArray(oldTag.children) : [];
        this.vars = oldTag ? copyArray(oldTag.vars) : [];

        var attrs = args.length ? args[0] : null;
        var hasAttrs = typeof(attrs) == "object" && !isTag(attrs);

        this.children = [];

        if (domplate.topContext)
            this.context = domplate.topContext;

        if (args.length)
            parseChildren(args, hasAttrs ? 1 : 0, this.vars, this.children);

        if (hasAttrs)
            this.parseAttrs(attrs);

        return creator(this, DomplateTag);
    },

    parseAttrs: function(args)
    {
        for (var name in args)
        {
            var val = parseValue(args[name]);
            readPartNames(val, this.vars);

            if (name.indexOf("on") == 0)
            {
                var eventName = $.browser.msie ? name : name.substr(2);
                if (!this.listeners)
                    this.listeners = [];
                this.listeners.push(eventName, val);
            }
            else if (name.indexOf("_") == 0)
            {
                var propName = name.substr(1);
                if (!this.props)
                    this.props = {};
                this.props[propName] = val;
            }
            else if (name.indexOf("$") == 0)
            {
                var className = name.substr(1);
                if (!this.classes)
                    this.classes = {};
                this.classes[className] = val;
            }
            else
            {
                if (name == "class" && name in this.attrs)
                    this.attrs[name] += " " + val;
                else
                    this.attrs[name] = val;
            }
        }
    },

    compile: function()
    {
        if (this.renderMarkup)
            return;

        this.compileMarkup();
        this.compileDOM();

        //ddd(this.renderMarkup);
        //ddd(this.renderDOM);
        //ddd(this.domArgs);
    },

    compileMarkup: function()
    {
        this.markupArgs = [];
        var topBlock = [], topOuts = [], blocks = [], info = {args: this.markupArgs, argIndex: 0};
        //this.addLocals(blocks);
        this.generateMarkup(topBlock, topOuts, blocks, info);
        this.addCode(topBlock, topOuts, blocks);

        var fnBlock = ['(function (__code__, __context__, __in__, __out__'];
        for (var i = 0; i < info.argIndex; ++i)
            fnBlock.push(', s', i);
        fnBlock.push(') {\n');

        if (this.subject)
            fnBlock.push('with (this) {\n');
        if (this.context)
            fnBlock.push('with (__context__) {\n');
        fnBlock.push('with (__in__) {\n');

        fnBlock.push.apply(fnBlock, blocks);

        if (this.subject)
            fnBlock.push('}\n');
        if (this.context)
            fnBlock.push('}\n');

        fnBlock.push('}})\n');

        function __link__(tag, code, outputs, args)
        {
            tag.tag.compile();

            var tagOutputs = [];
            var markupArgs = [code, tag.tag.context, args, tagOutputs];
            markupArgs.push.apply(markupArgs, tag.tag.markupArgs);
            tag.tag.renderMarkup.apply(tag.tag.subject, markupArgs);

            outputs.push(tag);
            outputs.push(tagOutputs);
        }

        function __escape__(value)
        {
            function replaceChars(ch)
            {
                switch (ch)
                {
                    case "<":
                        return "&lt;";
                    case ">":
                        return "&gt;";
                    case "&":
                        return "&amp;";
                    case "'":
                        return "&#39;";
                    case '"':
                        return "&quot;";
                }
                return "?";
            };
            return String(value).replace(/[<>&"']/g, replaceChars);
        }

        function __loop__(iter, outputs, fn)
        {
            var iterOuts = [];
            outputs.push(iterOuts);

            if (iter instanceof Array)
                iter = new ArrayIterator(iter);

            try
            {
                while (1)
                {
                    var value = iter.next();
                    var itemOuts = [0,0];
                    iterOuts.push(itemOuts);
                    fn.apply(this, [value, itemOuts]);
                }
            }
            catch (exc)
            {
                if (exc != StopIteration)
                    throw exc;
            }
        }

        var js = $.browser.msie ? 'var f = ' + fnBlock.join("") + ';f' : fnBlock.join("");
        this.renderMarkup = eval(js);
    },

    getVarNames: function(args)
    {
        if (this.vars)
            args.push.apply(args, this.vars);

        for (var i = 0; i < this.children.length; ++i)
        {
            var child = this.children[i];
            if (isTag(child))
                child.tag.getVarNames(args);
            else if (child instanceof Parts)
            {
                for (var i = 0; i < child.parts.length; ++i)
                {
                    if (child.parts[i] instanceof Variable)
                    {
                        var name = child.parts[i].name;
                        var names = name.split(".");
                        args.push(names[0]);
                    }
                }
            }
        }
    },

    generateMarkup: function(topBlock, topOuts, blocks, info)
    {
        topBlock.push(',"<', this.tagName, '"');

        for (var name in this.attrs)
        {
            if (name != "class")
            {
                var val = this.attrs[name];
                topBlock.push(', " ', name, '=\\""');
                addParts(val, ',', topBlock, info, true);
                topBlock.push(', "\\""');
            }
        }

        if (this.listeners)
        {
            for (var i = 0; i < this.listeners.length; i += 2)
                readPartNames(this.listeners[i+1], topOuts);
        }

        if (this.props)
        {
            for (var name in this.props)
                readPartNames(this.props[name], topOuts);
        }

        if ("class" in this.attrs || this.classes)
        {
            topBlock.push(', " class=\\""');
            if ("class" in this.attrs)
                addParts(this.attrs["class"], ',', topBlock, info, true);
              topBlock.push(', " "');
            for (var name in this.classes)
            {
                topBlock.push(', (');
                addParts(this.classes[name], '', topBlock, info);
                topBlock.push(' ? "', name, '" + " " : "")');
            }
            topBlock.push(', "\\""');
        }
        topBlock.push(',">"');

        this.generateChildMarkup(topBlock, topOuts, blocks, info);
        topBlock.push(',"</', this.tagName, '>"');
    },

    generateChildMarkup: function(topBlock, topOuts, blocks, info)
    {
        for (var i = 0; i < this.children.length; ++i)
        {
            var child = this.children[i];
            if (isTag(child))
                child.tag.generateMarkup(topBlock, topOuts, blocks, info);
            else
                addParts(child, ',', topBlock, info, true);
        }
    },

    addCode: function(topBlock, topOuts, blocks)
    {
        if (topBlock.length)
            blocks.push('__code__.push(""', topBlock.join(""), ');\n');
        if (topOuts.length)
            blocks.push('__out__.push(', topOuts.join(","), ');\n');
        topBlock.splice(0, topBlock.length);
        topOuts.splice(0, topOuts.length);
    },

    addLocals: function(blocks)
    {
        var varNames = [];
        this.getVarNames(varNames);

        var map = {};
        for (var i = 0; i < varNames.length; ++i)
        {
            var name = varNames[i];
            if ( map.hasOwnProperty(name) )
                continue;

            map[name] = 1;
            var names = name.split(".");
            blocks.push('var ', names[0] + ' = ' + '__in__.' + names[0] + ';\n');
        }
    },

    compileDOM: function()
    {
        var path = [];
        var blocks = [];
        this.domArgs = [];
        path.embedIndex = 0;
        path.loopIndex = 0;
        path.staticIndex = 0;
        path.renderIndex = 0;
        var nodeCount = this.generateDOM(path, blocks, this.domArgs);

        var fnBlock = ['(function (root, context, o'];

        for (var i = 0; i < path.staticIndex; ++i)
            fnBlock.push(', ', 's'+i);

        for (var i = 0; i < path.renderIndex; ++i)
            fnBlock.push(', ', 'd'+i);

        fnBlock.push(') {\n');
        for (var i = 0; i < path.loopIndex; ++i)
            fnBlock.push('var l', i, ' = 0;\n');
        for (var i = 0; i < path.embedIndex; ++i)
            fnBlock.push('var e', i, ' = 0;\n');

        if (this.subject)
            fnBlock.push('with (this) {\n');
        if (this.context)
            fnBlock.push('with (context) {\n');

        fnBlock.push(blocks.join(""));

        if (this.subject)
            fnBlock.push('}\n');
        if (this.context)
            fnBlock.push('}\n');

        fnBlock.push('return ', nodeCount, ';\n');
        fnBlock.push('})\n');

        function __prop__(object, prop, value)
        {
            object[prop] = value;
        }

        function __bind__(object, fn)
        {
            return function(event) { return fn.apply(object, [event]); }
        }

        function __link__(node, tag, args)
        {
            tag.tag.compile();

            var domArgs = [node, tag.tag.context, 0];
            domArgs.push.apply(domArgs, tag.tag.domArgs);
            domArgs.push.apply(domArgs, args);

            return tag.tag.renderDOM.apply(tag.tag.subject, domArgs);
        }

        var self = this;
        function __loop__(iter, fn)
        {
            var nodeCount = 0;
            for (var i = 0; i < iter.length; ++i)
            {
                iter[i][0] = i;
                iter[i][1] = nodeCount;
                nodeCount += fn.apply(this, iter[i]);
                //ddd("nodeCount", nodeCount);
            }
            return nodeCount;
        }

        function __path__(parent, offset)
        {
            //ddd("offset", arguments[2])
            var root = parent;

            for (var i = 2; i < arguments.length; ++i)
            {
                var index = arguments[i];
                if (i == 3)
                    index += offset;

                if (index == -1)
                    parent = parent.parentNode;
                else
                    parent = parent.childNodes[index];
            }

            //ddd(arguments[2], root, parent);
            return parent;
        }

        var js = $.browser.msie ? 'var f = ' + fnBlock.join("") + ';f' : fnBlock.join("");
        //ddd(js.replace(/(\;|\{)/g, "$1\n"));
        this.renderDOM = eval(js);
    },

    generateDOM: function(path, blocks, args)
    {
        if (this.listeners || this.props)
            this.generateNodePath(path, blocks);

        if (this.listeners)
        {
            for (var i = 0; i < this.listeners.length; i += 2)
            {
                var val = this.listeners[i+1];
                var arg = generateArg(val, path, args);
                if ($.browser.msie)
                    blocks.push('node.attachEvent("', this.listeners[i], '", __bind__(this, ', arg, '));\n');
                else
                    blocks.push('node.addEventListener("', this.listeners[i], '", __bind__(this, ', arg, '), false);\n');
            }
        }

        if (this.props)
        {
            for (var name in this.props)
            {
                var val = this.props[name];
                var arg = generateArg(val, path, args);
                blocks.push("__prop__(node, '" + name + "', " + arg + ");\n");
                //blocks.push('node.', name, ' = ', arg, ';');
            }
        }

        this.generateChildDOM(path, blocks, args);
        return 1;
    },

    generateNodePath: function(path, blocks)
    {
        blocks.push("var node = __path__(root, o");
        for (var i = 0; i < path.length; ++i)
            blocks.push(",", path[i]);
        blocks.push(");\n");
        //blocks.push("try {ddd(l0,l1,l2); } catch (exc) {}");
    },

    generateChildDOM: function(path, blocks, args)
    {
        path.push(0);
        for (var i = 0; i < this.children.length; ++i)
        {
            var child = this.children[i];
            if (isTag(child))
                path[path.length-1] += '+' + child.tag.generateDOM(path, blocks, args);
            else
                path[path.length-1] += '+1';
        }
        path.pop();
    }
};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

DomplateEmbed.prototype = copyObject(DomplateTag.prototype,
{
    merge: function(args, oldTag)
    {
        this.value = oldTag ? oldTag.value : parseValue(args[0]);
        this.attrs = oldTag ? oldTag.attrs : {};
        this.vars = oldTag ? copyArray(oldTag.vars) : [];

        var attrs = args[1];
        for (var name in attrs)
        {
            var val = parseValue(attrs[name]);
            this.attrs[name] = val;
            readPartNames(val, this.vars);
        }

        return creator(this, DomplateEmbed);
    },

    getVarNames: function(names)
    {
        if (this.value instanceof Parts)
            names.push(this.value.parts[0].name);

        if (this.vars)
            names.push.apply(names, this.vars);
    },

    generateMarkup: function(topBlock, topOuts, blocks, info)
    {
        this.addCode(topBlock, topOuts, blocks);

        blocks.push('__link__(');
        addParts(this.value, '', blocks, info);
        blocks.push(', __code__, __out__, {\n');

        var lastName = null;
        for (var name in this.attrs)
        {
            if (lastName)
                blocks.push(',');
            lastName = name;

            var val = this.attrs[name];
            blocks.push('"', name, '":');
            addParts(val, '', blocks, info);
        }

        blocks.push('});\n');
        //this.generateChildMarkup(topBlock, topOuts, blocks, info);
    },

    generateDOM: function(path, blocks, args)
    {
        var embedName = 'e'+path.embedIndex++;

        this.generateNodePath(path, blocks);

        var valueName = 'd' + path.renderIndex++;
        var argsName = 'd' + path.renderIndex++;
        blocks.push(embedName + ' = __link__(node, ', valueName, ', ', argsName, ');\n');

        return embedName;
    }
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

DomplateLoop.prototype = copyObject(DomplateTag.prototype,
{
    merge: function(args, oldTag)
    {
        this.isLoop = true;
        this.varName = oldTag ? oldTag.varName : args[0];
        this.iter = oldTag ? oldTag.iter : parseValue(args[1]);
        this.vars = [];

        this.children = oldTag ? copyArray(oldTag.children) : [];

        var offset = Math.min(args.length, 2);
        parseChildren(args, offset, this.vars, this.children);

        return creator(this, DomplateLoop);
    },

    getVarNames: function(names)
    {
        if (this.iter instanceof Parts)
            names.push(this.iter.parts[0].name);

        DomplateTag.prototype.getVarNames.apply(this, [names]);
    },

    generateMarkup: function(topBlock, topOuts, blocks, info)
    {
        this.addCode(topBlock, topOuts, blocks);

        var iterName;
        if (this.iter instanceof Parts)
        {
            var part = this.iter.parts[0];
            iterName = part.name;

            if (part.format)
            {
                for (var i = 0; i < part.format.length; ++i)
                    iterName = part.format[i] + "(" + iterName + ")";
            }
        }
        else
            iterName = this.iter;

        blocks.push('__loop__.apply(this, [', iterName, ', __out__, function(', this.varName, ', __out__) {\n');
        this.generateChildMarkup(topBlock, topOuts, blocks, info);
        this.addCode(topBlock, topOuts, blocks);
        blocks.push('}]);\n');
    },

    generateDOM: function(path, blocks, args)
    {
        var iterName = 'd'+path.renderIndex++;
        var counterName = 'i'+path.loopIndex;
        var loopName = 'l'+path.loopIndex++;

        if (!path.length)
            path.push(-1, 0);

        var preIndex = path.renderIndex;
        path.renderIndex = 0;

        var nodeCount = 0;

        var subBlocks = [];
        var basePath = path[path.length-1];
        for (var i = 0; i < this.children.length; ++i)
        {
            path[path.length-1] = basePath+'+'+loopName+'+'+nodeCount;

            var child = this.children[i];
            if (isTag(child))
                nodeCount += '+' + child.tag.generateDOM(path, subBlocks, args);
            else
                nodeCount += '+1';
        }

        path[path.length-1] = basePath+'+'+loopName;

        //blocks.push("console.group('", loopName, "');");
        blocks.push(loopName,' = __loop__.apply(this, [', iterName, ', function(', counterName,',',loopName);
        for (var i = 0; i < path.renderIndex; ++i)
            blocks.push(',d'+i);
        blocks.push(') {\n');
        blocks.push(subBlocks.join(""));
        blocks.push('return ', nodeCount, ';\n');
        blocks.push('}]);\n');
        //blocks.push("console.groupEnd();");

        path.renderIndex = preIndex;

        return loopName;
    }
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

function Variable(name, format)
{
    this.name = name;
    this.format = format;
}

function Parts(parts)
{
    this.parts = parts;
}

// ************************************************************************************************

function parseParts(str)
{
    var re = /\$([_A-Za-z][_A-Za-z0-9.|]*)/g;
    var index = 0;
    var parts = [];

    var m;
    while (m = re.exec(str))
    {
        var pre = str.substr(index, (re.lastIndex-m[0].length)-index);
        if (pre)
            parts.push(pre);

        var expr = m[1].split("|");
        parts.push(new Variable(expr[0], expr.slice(1)));
        index = re.lastIndex;
    }

    if (!index)
        return str;

    var post = str.substr(index);
    if (post)
        parts.push(post);

    return new Parts(parts);
}

function parseValue(val)
{
    return typeof(val) == 'string' ? parseParts(val) : val;
}

function parseChildren(args, offset, vars, children)
{
    for (var i = offset; i < args.length; ++i)
    {
        var val = parseValue(args[i]);
        children.push(val);
        readPartNames(val, vars);
    }
}

function readPartNames(val, vars)
{
    if (val instanceof Parts)
    {
        for (var i = 0; i < val.parts.length; ++i)
        {
            var part = val.parts[i];
            if (part instanceof Variable)
                vars.push(part.name);
        }
    }
}

function generateArg(val, path, args)
{
    if (val instanceof Parts)
    {
        var vals = [];
        for (var i = 0; i < val.parts.length; ++i)
        {
            var part = val.parts[i];
            if (part instanceof Variable)
            {
                var varName = 'd'+path.renderIndex++;
                if (part.format)
                {
                    for (var j = 0; j < part.format.length; ++j)
                        varName = part.format[j] + '(' + varName + ')';
                }

                vals.push(varName);
            }
            else
                vals.push('"'+part.replace(/"/g, '\\"')+'"');
        }

        return vals.join('+');
    }
    else
    {
        args.push(val);
        return 's' + path.staticIndex++;
    }
}

function addParts(val, delim, block, info, escapeIt)
{
    var vals = [];
    if (val instanceof Parts)
    {
        for (var i = 0; i < val.parts.length; ++i)
        {
            var part = val.parts[i];
            if (part instanceof Variable)
            {
                var partName = part.name;
                if (part.format)
                {
                    for (var j = 0; j < part.format.length; ++j)
                        partName = part.format[j] + "(" + partName + ")";
                }

                if (escapeIt)
                    vals.push("__escape__(" + partName + ")");
                else
                    vals.push(partName);
            }
            else
                vals.push('"'+ part + '"');
        }
    }
    else if (isTag(val))
    {
        info.args.push(val);
        vals.push('s'+info.argIndex++);
    }
    else
        vals.push('"'+ val + '"');

    var parts = vals.join(delim);
    if (parts)
        block.push(delim, parts);
}

function isTag(obj)
{
    return (typeof(obj) == "function" || obj instanceof Function) && !!obj.tag;
}

function isDomplate(obj)
{
    return (typeof(obj) == "object") && !!obj.render;
}

function creator(tag, cons)
{
    var fn = new Function(
        "var tag = arguments.callee.tag;" +
        "var cons = arguments.callee.cons;" +
        "var newTag = new cons();" +
        "return newTag.merge(arguments, tag);");

    fn.tag = tag;
    fn.cons = cons;
    extend(fn, Renderer);

    return fn;
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

function copyArray(oldArray)
{
    var ary = [];
    if (oldArray)
        for (var i = 0; i < oldArray.length; ++i)
            ary.push(oldArray[i]);
   return ary;
}

function copyObject(l, r)
{
    var m = {};
    extend(m, l);
    extend(m, r);
    return m;
}

function extend(l, r)
{
    for (var n in r)
        l[n] = r[n];
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

function ArrayIterator(array)
{
    var index = -1;

    this.next = function()
    {
        if (++index >= array.length)
            throw StopIteration;

        return array[index];
    };
}

function StopIteration() {}

this.$break = function()
{
    throw StopIteration;
};

// ************************************************************************************************

var Renderer =
{
    renderHTML: function(args, outputs, self)
    {
        var code = [];
        var markupArgs = [code, this.tag.context, args, outputs];
        markupArgs.push.apply(markupArgs, this.tag.markupArgs);
        this.tag.renderMarkup.apply(self ? self : this.tag.subject, markupArgs);
        return code.join("");
    },

    insertRows: function(args, before, self)
    {
        this.tag.compile();

        var outputs = [];
        var html = this.renderHTML(args, outputs, self);

        var doc = before.ownerDocument;
        var tableParent = doc.createElement("div"); // Workaround: IE doesn't allow to set TABLE.innerHTML
        tableParent.innerHTML = "<table>" + html + "</table>";

        var tbody = tableParent.firstChild.firstChild;
        var parent = before.tagName.toLowerCase() == "tr" ? before.parentNode : before;
        var after = before.tagName.toLowerCase() == "tr" ? before.nextSibling : null;

        var firstRow = tbody.firstChild, lastRow;
        while (tbody.firstChild)
        {
            lastRow = tbody.firstChild;
            if (after)
                parent.insertBefore(lastRow, after);
            else
                parent.appendChild(lastRow);
        }

        var offset = 0;
        if (this.tag.isLoop)
        {
            var node = firstRow.parentNode.firstChild;
            for (; node && node != firstRow; node = node.nextSibling)
                ++offset;
        }

        var domArgs = [firstRow, this.tag.context, offset];
        domArgs.push.apply(domArgs, this.tag.domArgs);
        domArgs.push.apply(domArgs, outputs);

        this.tag.renderDOM.apply(self ? self : this.tag.subject, domArgs);
        return [firstRow, lastRow];
    },

    insertAfter: function(args, before, self)
    {
        this.tag.compile();

        var outputs = [];
        var html = this.renderHTML(args, outputs, self);

        var doc = before.ownerDocument;
        var range = doc.createRange();
        range.selectNode(doc.body);
        var frag = range.createContextualFragment(html);

        var root = frag.firstChild;
        if (before.nextSibling)
            before.parentNode.insertBefore(frag, before.nextSibling);
        else
            before.parentNode.appendChild(frag);

        var domArgs = [root, this.tag.context, 0];
        domArgs.push.apply(domArgs, this.tag.domArgs);
        domArgs.push.apply(domArgs, outputs);

        this.tag.renderDOM.apply(self ? self : (this.tag.subject ? this.tag.subject : null),
            domArgs);

        return root;
    },

    replace: function(args, parent, self)
    {
        this.tag.compile();

        var outputs = [];
        var html = this.renderHTML(args, outputs, self);

        var root;
        if (parent.nodeType == 1)
        {
            parent.innerHTML = html;
            root = parent.firstChild;
        }
        else
        {
            if (!parent || parent.nodeType != 9)
                parent = document; //xxxHonza: There are no globals.

            if (!womb || womb.ownerDocument != parent)
                womb = parent.createElement("div");
            womb.innerHTML = html;

            root = womb.firstChild;
            //womb.removeChild(root);
        }

        var domArgs = [root, this.tag.context, 0];
        domArgs.push.apply(domArgs, this.tag.domArgs);
        domArgs.push.apply(domArgs, outputs);
        this.tag.renderDOM.apply(self ? self : this.tag.subject, domArgs);

        return root;
    },

    append: function(args, parent, self)
    {
        this.tag.compile();

        var outputs = [];
        var html = this.renderHTML(args, outputs, self);

        if (!womb || womb.ownerDocument != parent.ownerDocument)
            womb = parent.ownerDocument.createElement("div");
        womb.innerHTML = html;

        var root = womb.firstChild;
        while (womb.firstChild)
            parent.appendChild(womb.firstChild);

        var domArgs = [root, this.tag.context, 0];
        domArgs.push.apply(domArgs, this.tag.domArgs);
        domArgs.push.apply(domArgs, outputs);
        this.tag.renderDOM.apply(self ? self : this.tag.subject, domArgs);

        return root;
    },

    insertCols: function(args, parent, self)
    {
        this.tag.compile();

        var outputs = [];
        var html = this.renderHTML(args, outputs, self);

        // This doesn't work in IE.
        //var table = parent.ownerDocument.createElement("table");
        //var womb = parent.ownerDocument.createElement("tr");
        //table.appendChild(womb);
        //womb.innerHTML = html;

        var womb = parent.ownerDocument.createElement("div");
        womb.innerHTML = "<table><tbody><tr>" + html + "</tr></tbody></table>";
        womb = womb.firstChild.firstChild.firstChild;

        var firstCol = womb.firstChild;
        if (!firstCol)
            return null;

        while (womb.firstChild)
            parent.appendChild(womb.firstChild);

        // See insertRows for comment.
        var offset = 0;
        if (this.tag.isLoop)
        {
            var node = firstCol.parentNode.firstChild;
            for (; node && node != firstCol; node = node.nextSibling)
                ++offset;
        }

        var domArgs = [firstCol, this.tag.context, offset];
        domArgs.push.apply(domArgs, this.tag.domArgs);
        domArgs.push.apply(domArgs, outputs);
        this.tag.renderDOM.apply(self ? self : this.tag.subject, domArgs);

        return firstCol;
    }
};

// ************************************************************************************************

function defineTags()
{
    for (var i = 0; i < arguments.length; ++i)
    {
        var tagName = arguments[i];
        var fn = new Function("var newTag = new Domplate.DomplateTag('"+tagName+"'); return newTag.merge(arguments);");

        var fnName = tagName.toUpperCase();
        Domplate[fnName] = fn;
    }
}

defineTags(
    "a", "button", "br", "canvas", "col", "colgroup", "div", "fieldset", "form", "h1", "h2", "h3", "hr",
     "img", "input", "label", "legend", "li", "ol", "optgroup", "option", "p", "pre", "select",
    "span", "strong", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "tr", "tt", "ul", "code",
    "iframe", "canvas"
);

}).apply(Domplate);

return Domplate;

//*************************************************************************************************
});

