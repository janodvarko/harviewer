
var JQUERY = require("jquery/jquery");
var HARVIEWER = require("harviewer");

exports.main = function () {

	HARVIEWER.init(JQUERY("#content")[0]);

}
