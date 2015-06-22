/* See license.txt for terms of usage */

define([
    "jquery/jquery",
    "text!./harViewer.css",
    "require"
],

function($, HarviewerCss, require) {
    return {
        initialize: function () {

/*
			var url = null;
			if (typeof require.sandbox !== "undefined") {
				url = require.sandbox.id + require.id("./harViewer.css");
			} else {
				url = require.toUrl("./harViewer.css");
			}
            $('<link rel="stylesheet" href="' + url + '"/>').appendTo("HEAD");
*/

            $('<style></style>').appendTo("HEAD").html(HarviewerCss);

        }
    };
});
