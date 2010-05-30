/* See license.txt for terms of usage */

HAR.ns(function() { with (HAR.Domplate) { with (HAR.Lib) {

//-----------------------------------------------------------------------------

HAR.Page.Pie = domplate(
{
    tag:
        TABLE({"class": "pagePieTable", cellpadding: 0, cellspacing: 0,
            _repObject: "$pie"},
            TBODY(
                TR(
                    TD({"class": "pieBox", title: "$pie.title"}),
                    TD(
                        FOR("item", "$pie.data",
                            DIV({"class": "pieLabel", _repObject: "$item"},
                                SPAN({"class": "box", style: "background-color: $item.color"}, "&nbsp;"),
                                SPAN({"class": "label"}, "$item.label")
                            )
                        )
                    )
                )
            )
        ),

    render: function(pie, parentNode)
    {
        var root = this.tag.append({pie: pie}, parentNode);

        // Excanvas doesn't support creating CANVAS elements dynamically using
        // HTML injection (and so domplate can't be used). So, create the element
        // using DOM API.
        var pieBox = getElementByClass(root, "pieBox");
        var el = document.createElement('canvas');
        el.setAttribute("class", "pieGraph");
        el.setAttribute("height", "100");
        el.setAttribute("width", "100");
        pieBox.appendChild(el);

        if (typeof(G_vmlCanvasManager) != "undefined")
            G_vmlCanvasManager.initElement(el);

        return root;
    },

    draw: function(canvas, pie)
    {
        if (!canvas || !canvas.getContext)
            return;

        var ctx = canvas.getContext("2d");
        var radius = Math.min(canvas.width, canvas.height) / 2;
        var center = [canvas.width/2, canvas.height/2];
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var sofar = 0; // keep track of progress

        var data = pie.data;
        var total = 0;
        for (var i in data)
            total += data[i].value;

        if (!total)
        {
            ctx.beginPath();
            ctx.moveTo(center[0], center[1]); // center of the pie
            ctx.arc(center[0], center[1], radius, 0, Math.PI * 2, false)
            ctx.closePath();
            ctx.fillStyle = "rgb(229,236,238)";
            ctx.lineStyle = "lightgray";
            ctx.fill();
            return;
        }

        for (var i=0; i<data.length; i++)
        {
            var thisvalue = data[i].value / total;

            ctx.beginPath();
            ctx.moveTo(center[0], center[1]);
            ctx.arc(center[0], center[1], radius,
                Math.PI * (- 0.5 + 2 * sofar), // -0.5 sets set the start to be top
                Math.PI * (- 0.5 + 2 * (sofar + thisvalue)),
                false);

            // line back to the center
            ctx.lineTo(center[0], center[1]);
            ctx.closePath();
            ctx.fillStyle = data[i].color;
            ctx.fill();

            sofar += thisvalue; // increment progress tracker
        }
    },

    showInfoTip: function(infoTip, target, x, y)
    {
        var pieTable = getAncestorByClass(target, "pagePieTable");
        if (!pieTable)
            return false;

        var label = getAncestorByClass(target, "pieLabel");
        if (label)
        {
            HAR.Page.PieInfoTip.render(pieTable.repObject, label.repObject, infoTip);
            return true;
        }
    }
});

//-----------------------------------------------------------------------------

HAR.Page.PieInfoTip = domplate(
{
    tag:
        DIV({"class": "pieLabelInfoTip"},
            "$text"
        ),

    getText: function(item)
    {
        return item.label + ": " + formatTime(item.value);
    },

    render: function(pie, item, parentNode)
    {
        var text = pie.getLabelTooltipText(item);
        this.tag.replace({text: text}, parentNode);
    }
});

//-----------------------------------------------------------------------------
}}});
