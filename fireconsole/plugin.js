
var JQUERY = require("jquery/jquery");
var HARVIEWER = require("harviewer");

exports.main = function (domNode) {

	HARVIEWER.init(domNode || JQUERY("#content")[0]);

}
