// Run the server from project root. E.g. "node tests/server/server.js"

const path = require("path");
const url = require("url");

const express = require("express");
const ejs = require("ejs");
const cors = require("cors");
const requirejs = require("requirejs");

const createViewHandler = require("./viewHandler.js");
const delayHandler = require("./delayHandler.js");

const functionalConfig = requirejs("../tests/functional/config");

// look for views in root
// look for static files in root
const viewsDir = path.resolve(".");
const staticDir = path.resolve(".");

function addConfig(req, res, next) {
    //res.locals.config = config;
    res.locals.req = req;
    res.locals.res = res;

    res.locals.setcookie = (name, value, opts) => {
        // Add the current pathname in a cookie-compatible format.
        // Given cookies set in the browser use the current address path,
        // any server side cookies need to be set using the same path,
        // otherwise these won't overwrite properly.
        let pathname = url.parse(req.originalUrl).pathname;
        if (!pathname.endsWith("/")) {
            const i = pathname.lastIndexOf("/");
            if (i > -1) {
                pathname = pathname.substring(0, i + 1);
            }
        }
        res.cookie(name, value, Object.assign({
            path: pathname,
        }, opts));
    };

    next();
}

const app = express();

app.engine("html", ejs.renderFile);
app.set("view engine", "html");
app.set("views", [viewsDir]);

// add the global app config to the response.
app.use(addConfig);
// delay the response if the request parameter is provided.
app.use(delayHandler("delay", 0, 10 * 1000));

app.use(cors());

//app.use(/.*\.harp$/, harpHandler(staticDir, { "index": ["index.html", "index.php"] }));

// process the views, with some context variables.
const locals = Object.assign({}, {
    // default context variables
    harviewer_base: "/webapp/",
    test_base: "/selenium/",
}, {
    // the templates use different names to the config object
    harviewer_base: functionalConfig.harViewerBase,
    test_base: functionalConfig.testBase,
});
app.use("/selenium/tests/", createViewHandler(path.resolve("./selenium/tests/"), locals));

// fall-through to static files
app.use("/", express.static(staticDir));

const args = process.argv.slice(2);
const port = parseInt(args[0] || "49001");

const server = app.listen(port, function() {
    const host = server.address().address;
    const port = server.address().port;

    console.log("harviewer test server listening at http://%s:%s", host, port);
});
