/* See license.txt for terms of usage */

(function() {
// ********************************************************************************************* //

/**
 * Finds all elements with class="har" on the page and creates HAR preview frame for each.
 * See list of attributes that can be specified on such elements:
 *
 * class: (mandatory) elements with this class are considered as HAR preview elements.
 *      The class is removed as soon as the element is processed. Possible additional
 *      classes are not touched.
 * data-har: (mandatory) source URL for target file.
 *      1) The URL must start with 'http:' in case where the target file is located on
 *         a different domain. The file must use HARP syntax (JSONP) in these cases.
 *      2) Otherwise the URL is considered to be from the same domain and path relative to
 *         the current location). The file must use HAR syntax (JSON) in these cases.
 * width: (optional, default: '100%') width of the preview.
 * height: (optional, default: '150px') height of the preview.
 * expand: (optional, default: 'true') true if individual pages should be expanded.
 * validate: (optional, default: 'true') false if HAR validation (according to the schema) should be skipped.
 *
 * Embed this script on a page:
 * <script>
 * (function() {
 *     var har = document.createElement("script");
 *     har.src = "http://www.softwareishard.com/har/viewer/har.js";
 *     har.setAttribute("id", "har");
 *     har.setAttribute("async", "true");
 *     document.documentElement.firstChild.appendChild(har);
 * })();
 * if(typeof(harInitialize)!="undefined"){harInitialize()}
 * </script>
 *
 * Examples of HAR elements:
 * <div class="har" data-har="http://example.com/my.harp"></div>
 * - load HARP file from an external domain using JSONP.
 *
 * <div class="har" data-har="/my.har"></div>
 * - load HAR file from the same domain.

 * <div class="har" data-har="http://example.com/my.harp" expand="true"></div>
 * - load HAR file from an external domain and expads all pages.
 *
 * <div class="har" data-har="/my.har" validate="false"></div>
 * - Do not validate the loaded HAR file.
*/
var harInitialize = window.harInitialize = function()
{
    var script = document.getElementById("har");
    var index = script.src.lastIndexOf("/");
    var baseUrl = script.src.substr(0, index+1);

    var elements = findHarElements();
    for (var i=0; i<elements.length; i++)
    {
        var element = elements[i];
        var path = element.getAttribute("data-har");
        if (!path)
            continue;

        var callback = element.getAttribute("data-callback");

        var width = element.getAttribute("width");
        var height = element.getAttribute("height");
        var expand = element.getAttribute("expand");
        var validate = element.getAttribute("validate");

        var args = "?" + (path.indexOf("http:") === 0 ? "inputUrl" : "path") + "=" + encodeURIComponent(path);
        if (expand !== "false")
            args += "&expand=" + (expand ? expand : "true");

        if (validate === "false")
            args += "&validate=false";

        if (callback)
            args += "&callback=" + callback;

        var iframe = document.createElement("iframe");
        iframe.setAttribute("style", "border: 1px solid lightgray;");
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("width", width ? width : "100%");
        iframe.setAttribute("height", height ? height : "150px");
        iframe.setAttribute("src", baseUrl + "preview.php" + args);
        element.appendChild(iframe);

        removeHarClass(element);
    }
};

var re = new RegExp('(^|\\s)har(\\s|$)', "g");

/**
 * Removes "har" class from specified element so it isn't processed twice.
 * @param {Object} node to be marked as processed
 */
function removeHarClass(node)
{
    var className = node.className.replace(re, " ");
    node.className = className.replace(/^\s*|\s*$/g,"");
}

/**
 * Returns list of all elements with class="har" on the page.
 */
function findHarElements()
{
    var elements = [];
    if (document.getElementsByClassName)
    {
        elements = document.getElementsByClassName("har");
    }
    else if (document.getElementsByTagName)
    {
        var divs = document.getElementsByTagName("div");
        for (var i=0; i<divs.length; i++)
        {
            var cn = divs[i].className;
            if (cn && cn.match(re))
                elements.push(divs[i]);
        }
    }

    var result = [];
    for (var j=0; j<elements.length; j++)
        result.push(elements[j]);

    return result;
}

function addEventListener(object, name, handler, direction)
{
    direction = direction || false;

    if (object.addEventListener)
        object.addEventListener(name, handler, direction);
    else
        object.attachEvent("on"+name, handler);
}

harInitialize();

addEventListener(window, "load", harInitialize, false);

// ********************************************************************************************* //
})();
