/* See license.txt for terms of usage */

define([
    "require"
],

function(require) {
    return {
        load: function (path) {

            var href = document.location.href;
            var index = href.indexOf("?");
            var url = href.substr(0, index) + "?path=";

            if (typeof require.sandbox !== "undefined") {
                url += require.sandbox.id + require.id(path.replace(/^examples\//, "./"));
            } else {
                url += path;
            }

            document.location = url;
        }
    };
});
