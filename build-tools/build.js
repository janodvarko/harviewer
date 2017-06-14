const fs = require("fs");
const os = require("os");
const path = require("path");

const shell = require("shelljs");
const replace = require("replace-in-file");
const jsonfile = require("jsonfile");

const buildConfig = jsonfile.readFileSync("build.json");
const version = buildConfig["VERSION"] || "NO_VERSION";
const gaProfile = buildConfig["GOOGLE-ANALYTICS-PROFILE"] || "";

const n = (p) => path.normalize(p);

const dir = n(path.join(__dirname, ".."));

const appDir = n(`${dir}/webapp`);
const buildDir = n(`${appDir}-build`);
const examplesDir = n(`${appDir}/examples`);
const buildToolsDir = n(`${dir}/build-tools`);

// Log variables
shell.echo(`dir           = ${dir}`);
shell.echo(`appDir        = ${appDir}`);
shell.echo(`buildDir      = ${buildDir}`);
shell.echo(`examplesDir   = ${examplesDir}`);
shell.echo(`buildToolsDir = ${buildToolsDir}`);

// Log info about the current OS
shell.echo("Building HAR Viewer on:");
shell.echo(`os.type     = ${os.type()}`);
shell.echo(`os.platform = ${os.platform()}`);
shell.echo(`os.arch     = ${os.arch()}`);
shell.echo(`os.release  = ${os.release()}`);

/*
Copy fresh harSchema.js we don't want it to be compressed.
Its content is displayed in the Schema tab.
*/
shell.config.verbose = true;
shell.cp(`${appDir}/scripts/preview/harSchema.js`, `${buildDir}/scripts/preview/`);
shell.config.verbose = false;

/*
Preprocess script/core/trace file to avoid using the console object.
*/
shell.config.verbose = true;
shell.exec(`node ${buildToolsDir}/preprocess.js ${appDir}/scripts/core/trace.js ${buildDir}/scripts/core/trace.js`);
shell.config.verbose = false;

/*
Insert version number into PHP/HTML files. The version info is loaded from 'build.json' file.
*/
replace.sync({
    files: [
        `${buildDir}/*.php`,
        `${buildDir}/*.html`,
    ],
    from: /@VERSION@/g,
    to: version,
    encoding: "utf8",
    silent: false,
});

/*
Insert analytics tracking id into analytics.include.
*/
replace.sync({
    files: [
        `${buildDir}/analytics.include`,
    ],
    from: /@GOOGLE-ANALYTICS-PROFILE@/g,
    to: gaProfile,
    encoding: "utf8",
    silent: false,
});

/*
Load the analytics include file, as we're going to insert it into all the PHP/HTML files.
*/
const analyticsInclude = fs.readFileSync(`${buildDir}/analytics.include`, "utf8");
replace.sync({
    files: [
        `${buildDir}/*.php`,
        `${buildDir}/*.html`,
    ],
    from: /<!--@GOOGLE-ANALYTICS-INCLUDE@-->/g,
    to: analyticsInclude,
    encoding: "utf8",
    silent: false,
});

/*
Final version message
*/
shell.echo(`HAR Viewer version: ${version} build OK`);

console.log("END");
