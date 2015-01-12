
const PATH = require("path");
const FS = require("fs");
const PINF = require("pinf-for-nodejs");
const EXPRESS = require("express");
const SEND = require("send");
const HTTP = require("http");
const REWORK = require("rework");
const REWORK_IMPORT = require("rework-import");
const REWORK_INLINE = require("rework-plugin-inline");


const PORT = process.env.PORT || 8080;

return PINF.main(function(options, callback) {

	var app = EXPRESS();

	app.get(/^\/scripts\/css\/(.+\.css)$/, function (req, res, next) {
		var basePath = PATH.join(__dirname, "../webapp/scripts/css");

		var source = FS.readFileSync(PATH.join(basePath, req.params[0]), "utf8");

		source = REWORK(source)
		    .use(REWORK_IMPORT({
		    	path: basePath
		   	}))
		    .toString();

		source = source.replace(/(background[\s\w-]*:[\s#\w]*]*)url(\('?"?images\/)/g, "$1inline$2");

		source = res.end(REWORK(source)
		   	.use(REWORK_INLINE(basePath))
		    .toString());

		return res.end(source);
	});

	// For RequireJS loader.
	app.get(/^\/scripts\/(.+)$/, function (req, res, next) {
		return SEND(req, req.params[0], {
			root: PATH.join(__dirname, "../webapp/scripts")
		}).on("error", next).pipe(res);
	});

	// For PINF loader.
	app.get(/^\/lib\/pinf-loader-js\/(.+)$/, function (req, res, next) {
		return SEND(req, req.params[0], {
			root: PATH.join(__dirname, "node_modules/pinf-for-nodejs/node_modules/pinf-loader-js")
		}).on("error", next).pipe(res);
	});
	app.get(/^\/(plugin.+)$/, PINF.hoist(PATH.join(__dirname, "../fireconsole/program.json"), options.$pinf.makeOptions({
		debug: true,
		verbose: true,
		PINF_RUNTIME: "",
        $pinf: options.$pinf
    })));

	// For both loaders and dev helper files.
	app.get(/^\/examples\/(.+)$/, function (req, res, next) {
		return SEND(req, req.params[0], {
			root: PATH.join(__dirname, "../webapp/examples")
		}).on("error", next).pipe(res);
	});
	app.get(/^(\/.*)$/, function (req, res, next) {
		var path = req.params[0];		
		if (path === "/") path = "/index.html";
		return SEND(req, path, {
			root: PATH.join(__dirname, "www")
		}).on("error", next).pipe(res);
	});

	HTTP.createServer(app).listen(PORT)

	// Wait for debug output from `PINF.hoist()` to finish.
	setTimeout(function() {
		console.log("Open browser to: http://localhost:" + PORT + "/");
	}, 2 * 1000);

}, module);

