const fs = require("fs");
const path = require("path");

/**
 * A function to load a ".har" file from disk and wrap it with a JSONP callback.
 *
 * This function assumes that req.baseUrl will end with ".harp". This baseUrl
 * string will have ".harp" replaced with ".har" to make a filename, and this
 * filename will be loaded from disk and wrapped in the JSONP callback.
 */
function harpHandler(rootDir, req, res, next) {
    if (!req.query.callback) {
        next();
        return;
    }

    if (!/^[a-zA-Z0-9_]+$/.exec(req.query.callback)) {
        throw new Error("Invalid callback name");
    }

    // http://expressjs.com/4x/api.html#req.baseUrl
    // baseUrl is, for example
    // "/selenium/tests/hars/testLoad2.harp"
    const filename = req.baseUrl.replace(/\.harp$/, ".har");
    filename = path.join(rootDir, filename);

    fs.readFile(filename, function(err, data) {
        if (err) {
            console.error("HARP PROCESSING", err);
            next();
        }
        res.set("Content-Type", "application/javascript");
        res.send(req.query.callback + "(" + data + ");");
    });
}

function _harpHandler(rootDir) {
    return harpHandler.bind(null, rootDir);
}

module.exports = _harpHandler;
